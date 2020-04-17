const csv = require('csv-parser');
const fs = require('fs');

const mappingFields = [];
const fieldMapPath = "./config/field_map.csv";
fs.createReadStream(fieldMapPath)
  .pipe(csv())
  .on('data', (data) => mappingFields.push(data));

module.exports = {
  mappingFields,
  appID: "",
  kintoneAuthenToken: "",
  kintoneDomain: "",
  externalUrl: "",
  externalAuthen: {
  }
};
