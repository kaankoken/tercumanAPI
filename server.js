const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);
console.info("\n\n\nServer listening on port " + server.address().port + " ...\n\n\n");