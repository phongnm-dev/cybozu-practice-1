function validateRequired (record, requiredFields) {
  for (const field of requiredFields) {
    if (!record[field.code] || record[field.code].value === null) {
      return field.code
    };
  }
  return false
}

function validateUniqueField (record, kintoneRecords, uniqueFields) {
  for (const field of uniqueFields) {
    const existRecords = kintoneRecords.filter(
      (item) => {
        return item[field.code] &&
          item[field.code].value === record[field.code].value
      }
    )
    if (existRecords.length) {
      const existField = {
        field: field.code,
        value: record[field.code].value
      }
      return existField
    }
  }
  return false
}

export default { validateRequired, validateUniqueField }
