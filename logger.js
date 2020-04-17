var fs = require('fs');

function writeLog (content) {
  const logFile = 'error_record.log'
  fs.appendFile(logFile, content+'\r\n', function (err) {
    if (err) console.log(err);
  });
}
module.exports = { writeLog }
