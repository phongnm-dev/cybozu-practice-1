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

function getAllRecord(opt_last_record_id = '', opt_records = []) {
  const recordLimit = 100;
  var records = opt_records;
  var query = opt_last_record_id ? '$id > ' + opt_last_record_id : '';
  query += ` order by $id asc limit ${ recordLimit }`;
  var params = {
    query: query
  };
  return getRecords(params).then(function({ data: resp }) {
    records = records.concat(resp.records);
    if (resp.records.length === recordLimit) {
      return getAllRecord(resp.records[resp.records.length - 1].$id.value, records);
    }
    return records;
  });
};

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

module.exports = { getRecords, updateRecords, getFields, getAllRecord, createRecords };
