const fs = require('fs');
const path = require('path');

function getHttpsConfig() {
  const https = process.env.HTTPS === 'true'; // or any condition you want
  if (https) {
    return {
      type: 'https',
      options: {
        key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
      },
    };
  }
  return {};
}

module.exports = getHttpsConfig;
