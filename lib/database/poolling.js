var mysql = require('mysql');
var config = require('./../../config.json');

 var poolData = {
        host: config.server,
        database: config.database,
        user: config.user,
        password: config.password,
        port: config.database_port,
        connectionLimit: config.connectionLimit
    };

    var pool = mysql.createPool(poolData);

    exports.getConnection = function (callback) {
        pool.getConnection(function (err, connection) {
            callback(err, connection);
        });
    };
