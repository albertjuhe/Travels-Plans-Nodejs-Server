var MySQL = require('../database/mysql_pooling');

var Location = function(){

	var mysql = new MySQL();

	var get = function(id,callback){

		var query_select = "select *,location.id as identificador,mark.title as city, location.title as title, typelocation.title as title_type from location,mark,typelocation where typelocation.id=typelocation_id and location.mark_id = mark.id and location.id="+id+";";
		mysql.query(query_select,function(err,rows,fields){
		  if (err) throw err;		
		  callback(rows);
		});
	};

	return {get:get}
	 
};
module.exports = Location;
