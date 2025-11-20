// simple Node server
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Health check endpoint
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('OK'); // ALB expects a 200 response
  } else {
    // Default response
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello from CI/CD Pipeline on AWS ECS! by-Kanishkar S\n');
  }
});

server.listen(port, () => console.log(`Listening on ${port}`));
