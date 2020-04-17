const logger = require("../logger");

function removeMissingRequired(records, fields) {
  const requiredField = fields.filter(field => field.required)
  const results = records.filter(item => {
    for (const field of requiredField) {
      if (!item[field.code] || item[field.code]['value'] === null) {
        let logMessage = `${new Date} Required field missing (${field.code}): ${JSON.stringify(item)}`;
        logger.writeLog(logMessage);
        return false;
      }
    }
    return true;
  })
  return results;
};

function getExistField(externalRecord, records, uniqueFields) {
  for (const field of uniqueFields) {
    let existRecord = records.filter(record => {
      return (externalRecord[field.code] && record[field.code]['value'] == externalRecord[field.code]['value'])
    })
    if (existRecord.length) {
      let updateKey = {
        field: field.code,
        value: externalRecord[field.code]['value']
      }
      return updateKey;
    }
  }
  return null;
};

module.exports = { getExistField, removeMissingRequired };