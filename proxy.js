var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');
var clientProxy = require('./proxyClient.js')

var PocketMineProxy = function (options) {
    var self = this;
    self.servers = [];
    for (var i=0; i < options.servers.length; i++) {
       this.servers.push(options.servers[i]);
    }
    self.proxyPort  = options.proxyPort || 19132;
    self.proxyHost = options.proxyHost || '0.0.0.0';
    self.timeOutTime = options.timeOutTime || 10000;
    self.udpType = option.udpType || 'udp4';
    self.connections = {};
    self.socket = dgram.createSocket(this.udpType);
    self.socket.on('listening', function () {
        self.emit('listening', proxyPort);
        console.log("listening on port " + proxyPort);
    }).on('message', function (msg, rinfo) {
        var clientId = self.strip(rinfo)
        if (!connections.hasOwnProperty(clientId)) { 
           var server = self.getServer();
           var clientOptions = {
                                 server: self.getServer(),
                                 message: msg,
                                 rinfo: rinfo,
                                 client: self._socket
                               };
           self.connections[clientId] = proxyClient.spawn(clientOptions);
        }
        var client = self.connections[clientId];
        client.send(msg, function (err, bytes) {
            if (err) console.log('proxyError: '+ err);
        });
    }).on('error', function (err) {
        console.log("error; closing connection");
        self._socket.close();
        proxy.emit('error', err);
    }).on('close', function () {
        proxy.emit('close');
    });
    self._socket.bind(proxyPort, proxyHost);
}

util.inherits(ProxyClient, events.EventEmitter);


PocketMineProxy.prototype.send = function send(msg, port, address, callback) {
    this._socket.send(msg, 0, msg.length, port, address, callback);
};

PocketMineProxy.prototype.strip = function strip(address) {
    return (address.address + address.port).replace(/\./g, '');
};


exports.start = function (options) {
    return new PocketMineProxy(options);
};
