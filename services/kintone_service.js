import {
  CREATE_RECORDS_LIMIT,
  UPDATE_RECORDS_LIMIT,
  GET_RECORDS_LIMIT
} from '../constants'
import axios from 'axios'
import config from '../config'

const kintoneRecordService = axios.create({
  baseURL: `${config.kintoneDomain}/k/v1/`,
  headers: {
    'X-Cybozu-Authorization': config.kintoneAuthenToken
  }
})

async function getRecords (options = {}) {
  const params = {
    app: config.appID,
    ...options
  }
  return kintoneRecordService.get('records.json', { params })
}

function getAllRecords (optLastRecordId = '', optRecords = []) {
  let records = optRecords
  let query = optLastRecordId ? `$id > ${optLastRecordId}` : ''
  query += ` order by $id asc limit ${GET_RECORDS_LIMIT}`
  const params = {
    query
  }
  return getRecords(params).then(({ data: resp }) => {
    records = records.concat(resp.records)
    if (resp.records.length === GET_RECORDS_LIMIT) {
      return getAllRecords(resp.records[resp.records.length - 1].$id.value, records)
    }
    return records
  })
}

async function updateRecords (records = {}) {
  const actions = []
  while (records.length) {
    const params = {
      app: config.appID,
      records: records.slice(0, UPDATE_RECORDS_LIMIT)
    }
    actions.push(kintoneRecordService.put('records.json', params))
    records = records.slice(UPDATE_RECORDS_LIMIT)
  }
  return Promise.all(actions)
}

async function updateAllRecords (records = {}) {
  const recordLimit = 100
  const params = {
    app: config.appID,
    records: records.slice(0, recordLimit)
  }
  return kintoneRecordService.put('records.json', params).then(() => {
    records = records.slice(recordLimit)
    if (records.length) {
      return updateAllRecords(records)
    }
    return records
  }).catch((error) => {
    console.log(error)
    return records
  })
}

async function createRecords (records = {}) {
  const actions = []
  while (records.length) {
    const params = {
      app: config.appID,
      records: records.slice(0, CREATE_RECORDS_LIMIT)
    }
    actions.push(kintoneRecordService.post('records.json', params))
    records = records.slice(CREATE_RECORDS_LIMIT)
  }
  return Promise.all(actions)
}

async function getFields (options = {}) {
  const params = {
    app: config.appID,
    ...options
  }
  return new Promise(function (resolve, reject) {
    kintoneRecordService.get('app/form/fields.json', { params }).then((result) => {
      const { data: { properties } } = result
      const fields = Object.values(properties)
      resolve(fields)
    }).catch(error => {
      reject(error)
    })
  })
}

module.exports = {
  getAllRecords, updateRecords, getFields, createRecords, updateAllRecords
}
