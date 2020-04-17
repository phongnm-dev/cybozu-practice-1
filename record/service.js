const ExternalService = require("../services/external_service");
const fieldValidator = require("../field/validator");
const kintoneService = require("../services/kintone_service");
const fieldService = require("../field/service");

async function getExternalRecords(query = {}) {
  // let countryName = "Vietnam";
  // const query = { where: { "countryName": countryName } };
  let { data: { results: externalRecords } } = await ExternalService.fetchData(query);
  return externalRecords;
}

async function migrateRecords(externalRecords, fields) {
  const updateRecords = [];
  const createRecords = [];
  try {
    var records = await getAllRecord();
  } catch (error) {
    console.log(error);
    return;
  };
  const uniqueFields = fields.filter(field => {
    return field.unique
  });
  externalRecords.forEach((data) => {
    const existField = fieldValidator.getExistField(data, records, uniqueFields)
    if (existField) {
      delete data[existField.field];
      updateRecords.push({
        "updateKey": existField,
        "record": data
      });
    } else {
      createRecords.push(data);
    }
  });
  let actions = [];
  if (updateRecords.length) actions.push(kintoneService.updateRecords(updateRecords));
  if (createRecords.length) actions.push(kintoneService.createRecords(createRecords));
  return Promise.all(actions);
}

function getAllRecord(opt_last_record_id = '', opt_records = []) {
  const recordLimit = 100;
  var records = opt_records;
  var query = opt_last_record_id ? '$id > ' + opt_last_record_id : '';
  query += ` order by $id asc limit ${recordLimit}`;
  var params = {
    query: query
  };
  return kintoneService.getRecords(params).then(function ({ data: resp }) {
    records = records.concat(resp.records);
    if (resp.records.length === recordLimit) {
      return getAllRecord(resp.records[resp.records.length - 1].$id.value, records);
    }
    return records;
  });
};

module.exports = { getExternalRecords, migrateRecords, getAllRecord }