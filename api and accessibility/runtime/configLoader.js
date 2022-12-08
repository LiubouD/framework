const fs = require('fs');

module.exports = (configFilePath) => {
  const json = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

  // TODO: add validation if schema
  return json;
};
