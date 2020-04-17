const ExternalService = require("./services/external_service");
const kintoneService = require("./services/kintone_service");
const config = require("./config");
const logger = require("./logger");
const { get } = require("lodash");

async function main() {
  try {
    var response = await Promise.all([
      getExternalData(),
      kintoneService.getAllRecord(),
      getFields()
    ])
    var [externalDatas, records, fields] = response;
  } catch(error) {
    console.log(error);
    return;
  }

  var mappingDatas = mappingField(externalDatas, config.mappingFields);
  mappingDatas = validateRequired(mappingDatas, fields)
  migrateRecords(mappingDatas, records, fields)
};

function validateRequired(data, fields) {
  const requiredField = fields.filter(field => field.required)
  var results = data;
  results = results.filter(item => {
    for (const field of requiredField) {
      if(!item[field.code] || item[field.code]['value'] === null ) {
        let logMessage = `${new Date} Required field missing (${ field.code }): ${ JSON.stringify(item) }`;
        logger.writeLog(logMessage);
        return false;
      }
    }
    return true;
  })
  return results;
};

function mappingField(externalDatas, mappingFields) {
  let mappingDatas = []
  externalDatas.forEach(externalData => {
    let mappingData = {};
    mappingFields.forEach(mapping => {
      let mappingValue = get(externalData, mapping.externalField);
      mappingData[mapping.recordField] = {
        value: mappingValue
      }
    });
    mappingDatas.push(mappingData);
  });
  return mappingDatas
}

async function getExternalData() {
  let countryName = "Vietnam";
  const query = { where: { "countryName": countryName } };
  let { data: {results: externalData} } = await ExternalService.fetchData(query);
  return externalData;
}

async function getFields() {
  let { data: { properties } } = await kintoneService.getFields();
  return Object.values(properties)
}

async function migrateRecords(Externaldata, records, fields) {
  const updateData = []
  const createData = []
  const uniqueFields = fields.filter(field => {
    return field.unique
  })
  Externaldata.forEach((data) => {
    const existUniqueField = getExistUniqueField(data, records, uniqueFields)
    if(existUniqueField) {
      delete data[existUniqueField.field];
      updateData.push({
        "updateKey": existUniqueField,
        "record": data
      })
    } else {
      createData.push(data)
    }
  })
  let actions = [];
  if (updateData.length) actions.push(kintoneService.updateRecords(updateData))
  if (createData.length) actions.push(kintoneService.createRecords(createData))
  try {
    await Promise.all(actions);
    console.log("Sync data success");
  } catch (error) {
    console.log(error.response.data.errors)
  }
}

function getExistUniqueField(data, records, uniqueFields) {
  for (const field of uniqueFields) {
    let existRecord = records.filter(record => {
      return (data[field.code] && record[field.code]['value'] == data[field.code]['value'])
    })
    if(existRecord.length) {
      let updateKey = {
        field: field.code,
        value: data[field.code]['value']
      }
      return updateKey;
    }
  }
  return null;
}

main();
