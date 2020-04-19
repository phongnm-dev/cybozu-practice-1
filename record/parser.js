const { get } = require('lodash')

function mappingRecord (data, mappingFields) {
  const mappingRecord = {}
  mappingFields.forEach((mapping) => {
    const mappingValue = get(data, mapping.externalField)
    mappingRecord[mapping.recordField] = {
      value: mappingValue
    }
  })
  return mappingRecord
}

export default { mappingRecord }
