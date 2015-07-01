var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');

var PocketMineProxy = function (options) {
    "use strict";
    var proxy = this;
    var localUdpType = 'udp4';
    var localfamily = 'IPv4';
    var servers = [];
    for (i=0; i < options.servers.length; i++) {
       servers.push(options.servers[i]);
    }
    var serverPort = options.localport || 0;
    var serverHost = options.localaddress || '0.0.0.0';
    var proxyHost = options.proxyaddress || '0.0.0.0';
    this.timeOutTime = options.timeOutTime || 10000;
    this.family = 'IPv4';
    this.udpType = 'udp4';
    this.host = options.address || 'localhost';
    this.port = options.port || 41234;
    this.connections = {};
}


PocketMineProxy.prototype.acceptClient = function acceptClient(msg, sender) {
    var dest = this.hashD(sender);
    var proxy = this;
     if (this.connections.hasOwnProperty(dest)) {
        client = this.connections[dest];
        clearTimeout(client.t);
        client.t = null;
        return client;
    }
    client = dgram.createSocket(this.udpType);
    client.once('listening', function () {
        var details = proxy.getDetails({route: this.address(), peer: sender});
        this.peer = sender;
        this._bound = true;
        proxy.emit('bound', details);
        this.emit('send', msg, sender);
    }).on('message', function (msg, sender) {
        proxy.send(msg, this.peer.port, this.peer.address, function (err, bytes) {
            if (err) proxy.emit('proxyError', err);
        });
        proxy.emit('proxyMsg', msg, sender);
    }).on('close', function () {
        proxy.emit('proxyClose', this.peer);
        this.removeAllListeners();
        delete proxy.connections[senderD];
    }).on('error', function (err) {
        this.close();
        proxy.emit('proxyError', err);
    }).on('send', function (msg, sender) {
        var self = this;
        proxy.emit('message', msg, sender);
        this.send(msg, 0, msg.length, proxy.port, proxy.host, function (err, bytes) {
            if (err) proxy.emit('proxyError', err);
            if (!self.t) self.t = setTimeout(function () {
                self.close();
            }, proxy.tOutTime);
        });
    });
    this.connections[senderD] = client;
    return client;
};
