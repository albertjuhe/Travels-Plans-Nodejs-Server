var mysqlPooling = require('../database/poolling');

var MySQL = function(){

    var query = function(str,callback){
        mysqlPooling.getConnection(function(err, conn){
            conn.query( str,  function(err, rows,fields){
                if(err)	{
                    throw err;
                }else{
                    callback(err,rows,fields);
                }
            });
            conn.release();
        })
    };

    var clean = function(str,callback){
        mysqlPooling.getConnection(function(err, conn){
            cleanQuery = conn.escape(str);
            conn.release();
            callback(cleanQuery);
        })
    };

    return {query:query,clean:clean}
};
module.exports = MySQL;


 