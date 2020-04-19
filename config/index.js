const csv = require('csv-parser')
const fs = require('fs')

const mappingFields = []
const fieldMapPath = './config/field_map.csv'
fs.createReadStream(fieldMapPath)
  .pipe(csv())
  .on('data', (data) => {
    return mappingFields.push(data)
  })

module.exports = {
  mappingFields: mappingFields,
  appID: '2',
  kintoneAuthenToken: 'bWVtYmVyX3Rlc3Q6a2FyaXVzOTc=',
  kintoneDomain: 'https://6dhg5.kintone.com',
  externalUrl: 'https://parseapi.back4app.com/classes/Covid19Case',
  externalAuthen: {
    'X-Parse-Application-Id': 'zoZ3zW1YABEWJMPInMwruD5XHgqT4QluDAAVx0Zz',
    'X-Parse-Master-Key': 'gIo7p0nTyt72aROJqf0ronfzxGKw8Unjw0Zk6qFm'
  }
}
