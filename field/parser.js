const { get } = require("lodash");

function mappingField(externalRecords, mappingFields) {
  let mappingRecords = []
  externalRecords.forEach(externalRecord => {
    let mappingRecord = {};
    mappingFields.forEach(mapping => {
      let mappingValue = get(externalRecord, mapping.externalField);
      mappingRecord[mapping.recordField] = {
        value: mappingValue
      }
    });
    mappingRecords.push(mappingRecord);
  });
  return mappingRecords
};

module.exports = { mappingField };