const axios = require("axios");
const config = require("../config")

const kintoneRecordService = axios.create({
  baseURL: `${config.kintoneDomain}/k/v1/`,
  headers: {
    "X-Cybozu-Authorization": config.kintoneAuthenToken
  }
});

async function getRecords (options = {}) {
  const params = { 
    app: config.appID,
    ...options
  };
  return kintoneRecordService.get("records.json", { params })
}

async function updateRecords (records = {}) {
  var actions = [];
  const recordLimit = 100;
  while(records.length) {
    const params = {
      app: config.appID,
      records: records.slice(0, recordLimit)
    };
    actions.push(kintoneRecordService.put("records.json", params));
    records = records.slice(recordLimit)
  };
  return Promise.all(actions);
};

async function createRecords (records = {}) {
  var actions = [];
  const recordLimit = 100
  while(records.length) {
    const params = {
      app: config.appID,
      records: records.slice(0, recordLimit)
    };
    actions.push(kintoneRecordService.post("records.json", params));
    records = records.slice(recordLimit)
  };
  return Promise.all(actions);
};

async function getFields (options = {}) {
  const params = {
    app: config.appID,
    ...options
  };
  return kintoneRecordService.get("app/form/fields.json", { params });
};

module.exports = { getRecords, updateRecords, getFields, createRecords };
