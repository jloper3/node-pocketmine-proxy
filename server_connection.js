var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');

function ServerConnection(options) {
    var self = this;
    self.timeOut = options.timeOut || 10000;
    self.port = options.port;
    self.host = options.host;
    self.server = options.server;
    var proxy = options.proxy;
    self.udpType = options.udpType || 'udp4';
    self._socket = dgram.createSocket(self.udpType);
    var client = self._socket;
    var msg = options.message;
    client.once('listening', function () {
        self.send(msg, function (err, bytes) {
           if (err) { 
              //self.emit('proxyError', err);
              client.close();
              console.log("error initial send " + err);
           }
        });
        //self._bound = true;
        //self.emit('bound', rinfo);
    }).on('message', function (msg, rinfoo) {
         proxy.send(msg, self.port, self.host, function (err, bytes) {
            if (err) { 
         //      self.emit('proxyError', err);
               console.log("error send " + err);
            }
        });
        clearTimeout(self.t);
        self.t = setTimeout(function() {
           client.close();
           console.log("timed out. closing connection");
        }, self.timeOut);
    }).on('close', function () {
        //proxy.emit('proxyClose', this.peer);
        client.removeAllListeners();
        //delete self.connections[clientId];
        console.log("connection closed for " + self.host +":"+self.port);
    }).on('error', function (err) {
        client.close();
       // self.emit('proxyError', err);
    });
};

ServerConnection.prototype.send = function send(msg, callback) {
    this._socket.send(msg, 0, msg.length, this.server.serverPort, this.server.serverHost, callback);
};

exports.connect = function (options) {
  return new ServerConnection(options);
}


