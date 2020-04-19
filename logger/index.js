import fs from 'fs'
import { LOG_PATH } from '../constants'

function writeLog (content) {
  fs.appendFile(LOG_PATH, `${content}\r\n`, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

function printLog (message) {
  console.log(message)
}

module.exports = { writeLog, printLog }
