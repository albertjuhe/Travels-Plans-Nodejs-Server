//Routing
module.exports = function(app){
    //API
    require('../handlers/mapRouting')(app);
    require('../handlers/graphQL')(app);
};