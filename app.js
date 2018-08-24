var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

require('./lib/routing/routes')(app);
var port  = 3099;
server.listen(port);
app.set('server', server);

//Socket.io init
var comunication = require('./lib/sockets/communication');
var cmq = new comunication();
cmq.init(app);
console.log('Carregat al port:' + port);