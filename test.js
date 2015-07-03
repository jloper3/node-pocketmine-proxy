var proxy = require('./index.js');
var options = {
    address: '127.0.0.1',
    port: 19132,
    servers: [{ serverHost: '127.0.0.1', serverPort: '19133'}],
    proxyaddress: '0.0.0.0',
    timeOutTime: 10000
};
var server = proxy.start(options);
