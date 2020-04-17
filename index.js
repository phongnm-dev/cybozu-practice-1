const config = require("./config");
const recordService = require("./record/service");
const fieldService = require("./field/service");
const fieldParser = require("./field/parser");
const fieldValidator = require("./field/validator");

async function main() {
  try {
    var response = await Promise.all([
      recordService.getExternalRecords(),
      fieldService.getFields()
    ])
    var [externalRecords, fields] = response;
  } catch(error) {
    console.log(error);
    return;
  }
  var mappingRecords = fieldParser.mappingField(externalRecords, config.mappingFields);
  mappingRecords = fieldValidator.removeMissingRequired(mappingRecords, fields)
  try {
    await recordService.migrateRecords(mappingRecords, fields);
    console.log("Sync data success");
  } catch (error) {
    console.log(error)
  }
};

main();
