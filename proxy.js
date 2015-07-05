var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');
var connect = require('./server_connection.js')

var PocketMineProxy = function (options) {
    var self = this;
    self.servers = [];
    for (var i=0; i < options.servers.length; i++) {
       this.servers.push(options.servers[i]);
    }
    self.proxyPort  = options.proxyPort || 19132;
    self.proxyHost = options.proxyHost || '0.0.0.0';
    self.timeOutTime = options.timeOutTime || 10000;
    self.udpType = options.udpType || 'udp4';
    self.connections = {};
    self.socket = dgram.createSocket(this.udpType);
    self.socket.on('listening', function () {
        self.emit('listening', self.proxyPort);
        console.log("listening on port " + self.proxyPort);
    }).on('message', function (msg, rinfo) {
        var clientId = self.strip(rinfo)
        if (! self.connections.hasOwnProperty(clientId)) { 
           var clientOptions = {
                                 server: self.getServer(),
                                 message: msg,
                                 host: rinfo.address,
                                 port: rinfo.port,
                                 proxy: self
                               };
           console.log("ClientOptions: "+JSON.stringify(clientOptions.port));
           self.connections[clientId] = connect.connect(clientOptions);
        }
        var client = self.connections[clientId];
        client.send(msg, function (err, bytes) {
            if (err) console.log('proxyError: '+ err);
        });
    }).on('error', function (err) {
        console.log("error; closing connection");
        self.socket.close();
        proxy.emit('error', err);
    }).on('close', function () {
        proxy.emit('close');
    });
    self.socket.bind(self.proxyPort, self.proxyHost);
}

util.inherits(PocketMineProxy, events.EventEmitter);


PocketMineProxy.prototype.send = function send(msg, port, address, callback) {
    this.socket.send(msg, 0, msg.length, port, address, callback);
};

PocketMineProxy.prototype.strip = function strip(address) {
    return (address.address + address.port).replace(/\./g, '');
};

PocketMineProxy.prototype.getServer = function () {
   return this.servers[0];
}


exports.start = function (options) {
    return new PocketMineProxy(options);
};
