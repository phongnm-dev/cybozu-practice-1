const kintoneService = require("../services/kintone_service");

async function getFields() {
  let { data: { properties } } = await kintoneService.getFields();
  const fields = Object.values(properties)
  return fields;
};

module.exports = { getFields }