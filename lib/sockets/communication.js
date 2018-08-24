var _ = require('underscore');
var Room = require('./room');
var locationDAO = require('../DAO/location');

module.exports = function(){

    var rooms = {};

    var init = function(app) {
        var server = app.get('server');
        var io = require('socket.io').listen(server);

        io.on('connection', function(socket){
            console.log('a user connected');

            socket.on('login',function(username) {
                socket.username = username;
            });

            socket.on('add',function(element) {
                socket.element = element;
                /* Busquem el registre i l'enviem a els usuaris del meu room */
                var location = new locationDAO();
                location.get(element,function (resultObj, err) {
                    if (err) {
                       console.log('Error getting location');
                    } else {
                        if (resultObj.length > 0) {
                            var resultado = "";

                            _.each(resultObj, function (result) {
                                var locationPoint = {};
                                locationPoint.operation = 'add';
                                locationPoint.username = socket.username;
                                locationPoint.place_id = result.place_id;
                                locationPoint.id = result.identificador;
                                locationPoint.lat = result.lat;
                                locationPoint.lng = result.lng;
                                locationPoint.title = result.title;
                                locationPoint.city = result.city;
                                locationPoint.icon = result.icon;
                                locationPoint.title_type = result.title_type;
                                locationPoint.comment = result.description;
                                objTempString = JSON.stringify(locationPoint);
                                resultado = resultado.concat(objTempString + ",");
                            });
                            resultado = resultado.substring(0, resultado.length - 1);
                            limpio = "[" + resultado;
                            limpio = limpio.concat("]");
                            objetJson = JSON.parse(limpio);
                            socket.broadcast.to(socket.room).emit('sincronization', { location: objetJson });

                        };
                    }
                })

            });

            socket.on('disconnect', function () {
                socket.leave(socket.room);

                /* Remove the user in his room */
                room = rooms[socket.room];
                if (typeof room === 'undefined'){
                    console.log("ROOM undefined: " + socket.id);
                } else {
                    room.removeUser(socket.id);
                    var counter_refresh = setTimeout(function() {
                        var users = rooms[socket.room].users;
                        io.sockets.in(socket.room).emit('notification', { online:users.length});
                        clearTimeout(counter_refresh)
                    }, 2000);
                }

            });


            /* Cada room representa un classroom. */
            socket.on('join',function(room) {
                socket.room = room;
                if (rooms[room]) {
                    rooms[room].addUser(socket.id,socket.username);
                } else {
                    var R = new Room(room);
                    R.addUser(socket.id,socket.username);
                    rooms[room] = R;
                }

                socket.join(room);

                var users = rooms[room].users;

                io.sockets.in(room).emit('notification', { online: users.length });
            });


        });
    };

    return {init:init}

};