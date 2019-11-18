const app = require('../app')
const http = require('http');

let port = 3003

let server = http.createServer(app);

server.listen(port);

