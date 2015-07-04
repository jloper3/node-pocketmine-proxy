var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');



function ProxyClient(options) {
    var self = this;
    self.serverHost = options.serverHost;
    self.serverPort = options.serverPort;
    self.Socket = options.clientSocket;
    self.clientHost = options.clientHost;
    self.clientPort = option.clientPort;
    self.timeOut = options.timeOut || 10000;
    self.family = options.family || 'IPv4';
    self.udpType = options.udpType || 'udp4';
    self.client = dgram.createSocket(self.udpType);
    var client = self.client;
    client.once('listening', function () {
        server.send(msg, 0, msg.length, self.serverPort, self.serverHost, function (err, bytes) {
           if (err) { 
              //self.emit('proxyError', err);
              console.log("error initial send " + err);
           }
        });
        //self._bound = true;
        //self.emit('bound', rinfo);
    }).on('message', function (msg, rinfoo) {
        self.send(msg, rinfo.port, rinfo.address, function (err, bytes) {
            if (err) { 
         //      self.emit('proxyError', err);
               console.log("error send " + err);
            }
        });
        clearTimeout(self.t);
        self.t = setTimeout(function() {
           server.close();
           console.log("timed out. closing connection");
        }, self.timeOutTime);
    }).on('close', function () {
        //proxy.emit('proxyClose', this.peer);
        server.removeAllListeners();
        //delete self.connections[clientId];
        console.log("connection closed for " + rinfo.address +":"+rinfo.port);
    }).on('error', function (err) {
        server.close();
        self.emit('proxyError', err);
    });
};

exports.spawn = function (options) {
  return new ProxyClient(options);
}


