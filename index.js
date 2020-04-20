import ExternalService from './services/external_service'
import KintoneService from './services/kintone_service'
import config from './config'
import recordParser from './record/parser'
import recordValidator from './record/validator'
import logger from './logger'
import { MISSING_FIELD_MESSAGE, SYNC_SUCCESS_MESSAGE } from './constants'

async function main () {
  try {
    const response = await Promise.all([
      getExternalData(),
      KintoneService.getFields()
    ])
    var [externalData, fields] = response

    let mappingRecords = externalData.map(data => {
      return recordParser.mappingRecord(data, config.mappingFields)
    })

    const requiredFields = fields.filter((field) => {
      return field.required
    })
    mappingRecords = mappingRecords.filter((record) => {
      const missingField = recordValidator.validateRequired(record, requiredFields)
      if (missingField) {
        logger.writeLog(MISSING_FIELD_MESSAGE(missingField, JSON.stringify(record)))
        return false
      }
      return true
    })

    await syncData(mappingRecords, fields)
    logger.printLog(SYNC_SUCCESS_MESSAGE)
  } catch (error) {
    logger.printLog(error)
  }
}

async function syncData (externalRecords, fields) {
  const updateRecords = []
  const createRecords = []
  let kintoneRecords = []
  const uniqueFields = fields.filter((field) => { return field.unique })
  kintoneRecords = await KintoneService.getAllRecords()
  externalRecords.forEach((record) => {
    const existField = recordValidator.validateUniqueField(record, kintoneRecords, uniqueFields)
    if (existField) {
      delete record[existField.field]
      updateRecords.push({
        updateKey: existField,
        record: record
      })
    } else {
      createRecords.push(record)
    }
  })

  const actions = []
  if (updateRecords.length) actions.push(KintoneService.updateRecords(updateRecords))
  if (createRecords.length) actions.push(KintoneService.createRecords(createRecords))

  return Promise.all(actions)
}

async function getExternalData () {
  const { data: { results: externalRecords } } = await ExternalService.fetchData()
  return externalRecords
}

main()
