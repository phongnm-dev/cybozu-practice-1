export const LOG_PATH = 'error_record.log'
export const MISSING_FIELD_MESSAGE = (fieldCode, item) => {
  return `${new Date()} Required field missing (${fieldCode}): ${item}`
}
export const SYNC_SUCCESS_MESSAGE = 'Sync data success'
