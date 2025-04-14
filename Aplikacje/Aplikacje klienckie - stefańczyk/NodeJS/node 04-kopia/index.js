const http = require('http');
const router = require('./app/router');

const server = http.createServer((req, res) => {
    router.handleRequest(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});