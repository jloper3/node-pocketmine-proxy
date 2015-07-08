var proxy = require('./proxy.js');

var options = {   proxyPort:  19134,
                  proxyHost: '0.0.0.0',
                timeOutTime: '10000',
                    udpType: 'udp4',
                    servers: [
                              { serverHost: '127.0.0.1',
                                serverPort: 19135 }
                             ]
               };
proxy.start(options);

                
