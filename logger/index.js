import fs from 'fs'
import { LOG_PATH } from '../constants'

function writeLog (content) {
  const message = `${content}\r\n`
  fs.appendFile(LOG_PATH, message, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

function printLog (message) {
  console.log(message)
}

module.exports = { writeLog, printLog }
