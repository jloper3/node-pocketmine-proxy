var dgram = require('dgram');
var events = require('events');
var util = require('util');
var net = require('net');

var PocketMineProxy = function (options) {
    "use strict";
    var settings = { UDP_TYPE: 'udp4',
                     IP_FAMILY:  'IPv4' };
    var proxy = this;
    this.servers = [];
    for (var i=0; i < options.servers.length; i++) {
       this.servers.push(options.servers[i]);
    }
    var proxyPort  = options.proxyPort || 19132;
    var proxyHost = options.proxyHost || '0.0.0.0';
    this.timeOutTime = options.timeOutTime || 10000;
    this.family = settings.IP_FAMILY;
    this.udpType = settings.UDP_TYPE;
    this.connections = {};
    this._proxy = dgram.createSocket(this.udpType);
    this._proxy.on('listening', function () {
      //  setImmediate(function() {
       //     proxy.emit('listening', details);
       // });
        console.log("listening on port " + proxyPort);
    }).on('message', function (msg, rinfo) {
        console.log("msg from "+ JSON.stringify(rinfo));
        var conn = proxy.createConnection(msg, rinfo);
        if (!conn._bound) conn.bind();
        console.log("sending to "+ proxy.servers[0].serverHost + ':' + proxy.servers[0].serverPort);
        conn.send(msg, 0, msg.length, proxy.servers[0].serverPort, proxy.servers[0].serverHost , function (err, bytes) {
            if (err) console.log('proxyError: '+ err);
        });
    }).on('error', function (err) {
        console.log("error; closing connection");
        this.close();
    //    proxy.emit('error', err);
    }).on('close', function () {
     //   proxy.emit('close');
    });
    this._proxy.bind(proxyPort, proxyHost);
}

util.inherits(PocketMineProxy, events.EventEmitter);

PocketMineProxy.prototype.addServer = function addServer(server) {
    this.servers.push(server);
};

PocketMineProxy.prototype.send = function send(msg, port, address, callback) {
    this._proxy.send(msg, 0, msg.length, port, address, callback);
};

PocketMineProxy.prototype.strip = function strip(address) {
    return (address.address + address.port).replace(/\./g, '');
};

PocketMineProxy.prototype.createConnection = function getConnection(msg, rinfo) {
    var clientId = this.strip(rinfo);
    var proxy = this;
     if (this.connections.hasOwnProperty(clientId)) {
        console.log("Found connection for " + clientId);
        var conn = this.connections[clientId];
        clearTimeout(conn.t);
        conn.t = null;
        return conn;
    }
    console.log("Creating new connection for "+ rinfo.address + ":" + rinfo.port);
    conn = dgram.createSocket(this.udpType);
    conn.once('listening', function () {
        //var details = proxy.getDetails({route: this.address(), peer: sender});
        //console.log("sending to " + JSON.stringify(proxy.servers[0]));
        this.send(msg, 0, msg.length, proxy.servers[0].serverPort, proxy.servers[0].serverHost, function (err, bytes) {
           if (err) proxy.emit('proxyError', err);
           console.log("error initial send " + err);
        });
        this._bound = true;
        proxy.emit('bound', rinfo);
    }).on('message', function (msg, rinfoo) {
        proxy.send(msg, rinfo.port, rinfo.address, function (err, bytes) {
            if (err) { 
               proxy.emit('proxyError', err);
               console.log("error send " + err);
            }
        });
    }).on('close', function () {
        //proxy.emit('proxyClose', this.peer);
        this.removeAllListeners();
        delete proxy.connections[clientId];
        console.log("connection closed for " + rinfo.address +":"+rinfo.port);
    }).on('error', function (err) {
        this.close();
        proxy.emit('proxyError', err);
    });
    this.connections[clientId] = conn;
    return conn;
};

exports.start = function (options) {
    return new PocketMineProxy(options);
};
