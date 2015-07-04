var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');
var clientProxy = require('./proxyClient.js')

var PocketMineProxy = function (options) {
    var proxy = this;
    this.servers = [];
    this.index = 0;
    for (var i=0; i < options.servers.length; i++) {
       this.servers.push(options.servers[i]);
    }
    var proxyPort  = options.proxyPort || 19132;
    var proxyHost = options.proxyHost || '0.0.0.0';
    this.timeOutTime = options.timeOutTime || 10000;
    this.family = options.family || 'IPv4';
    this.udpType = option.udpType || 'udp4';
    this.connections = {};
    this._socket = dgram.createSocket(this.udpType);
    this._socket.on('listening', function () {
        proxy.emit('listening', proxyPort);
        console.log("listening on port " + proxyPort);
    }).on('message', function (msg, rinfo) {
        var clientId = proxy.strip(rinfo)
        if (!connections.hasOwnProperty(clientId)) connections[clientId] = proxyClient.Client(clientOptions);
        var client = connections[clientId];
        client.send(msg, 0, msg.length, conn.server.serverPort, conn.server.serverHost , function (err, bytes) {
            if (err) console.log('proxyError: '+ err);
        });
    }).on('error', function (err) {
        console.log("error; closing connection");
        this.close();
        proxy.emit('error', err);
    }).on('close', function () {
        proxy.emit('close');
    });
    this._socket.bind(proxyPort, proxyHost);
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
