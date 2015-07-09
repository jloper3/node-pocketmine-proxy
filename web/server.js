var express = require('express');
var app = express();
var proxy = require('../proxy.js');
var server;
app.use(express.static(__dirname + '/public'));



app.get('/api/servers', function (req, res) {
   res.json(server.getConnections());
});

module.exports = {
   start: function (options) {
      var port = options.webPort || 8080;
      app.listen(port);
      console.log('Webserver listening on port '+port);
      server = proxy.start(options)
   }
};




