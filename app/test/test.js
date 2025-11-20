const http = require('http');
const req = http.get({hostname:'127.0.0.1', port:3000, path:'/'}, res => {
  console.log('TEST STATUS', res.statusCode);
  process.exit(res.statusCode === 200 ? 0 : 1);
});
req.on('error', e => { console.error(e); process.exit(1); });
