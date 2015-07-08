var proxy = require('./index.js');
var options = {
    address: '127.0.0.1',
    proxyPort: 19134,
    servers: [ { serverHost: '127.0.0.1', serverPort: '19135'}
                ],
    proxyHost: '0.0.0.0',
    timeOutTime: 10000
};
var server = proxy.start(options);
