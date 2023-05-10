var moment = require('moment-timezone');//http://momentjs.com/docs
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
var server = require('./server.js')

var io = server.io

module.exports = (function () {
    var db_pg = require('./db_pg');


    io.on('connection', function (socket) {
        console.log("555555555555555555555555555555555555555");
        console.log('connection: ', socket.id, Date());
        socket.join(socket.handshake.sessionID);
        var sockets = io.sockets.sockets;
        keys = Object.keys(sockets);
        console.log('keys...', keys);

        /*keys.forEach(function (sock) {
         console.log('sockets[sock].id ...', sockets[sock].id)
         console.log('sockets[sock].handshake.sessionID ...', sockets[sock].handshake.sessionID)
         //console.log('sockets[sock].handshake.session.userid ...', sockets[sock].handshake.session.userid)
         console.log('sockets[sock].handshake.session.userdata ...', sockets[sock].handshake.session.userdata)

         if (sockets[sock].id != socket.id) {
         console.log("sockets[sock].id", sockets[sock].id)
         //sockets[sock].emit('ish', {ish: 1});
         }
         });*/
        //console.log(socket);

        socket.on('error', (error) => {
            console.log(error);
        });


        socket.on('test', function (data) {
            console.log('uid...', sockets[socket.id].handshake.session.userid);
            console.log('android Test..: ' + data);
        });


        // Accept a login event with user's data

        socket.on("login", function (data, callback) {
            console.log("login userdata... ", data);
            var login = data.login.trim().toLowerCase();
            var pass = data.pass.trim().toLowerCase();
            if (0 < login.length && 0 < pass.length) {
                var sql = "select *, LOWER(login) AS login, LOWER(pass) AS pass FROM users WHERE login ='" + login + "' AND pass = '" + pass + "'; ";

                db_pg.query(sql, (e, r)=> {
                    //console.log("login..onlogin e.", e, r.rows);
                    // console.log("login..onlogin r.", r);
                    //console.log("login..onlogin r.", r.rows);

                    var rowCount = r.rowCount;

                    if (0 < rowCount) {
                        var row = r.rows[0];
                        socket.handshake.session.userid = row.id;
                        socket.handshake.session.login = row.login;
                        socket.handshake.session.userdata = row;

                        var loginsuccess = {bool: true, user: row};
                        if (sockets[socket.id] != undefined
                            && sockets[socket.id].handshake.session.userid) {

                            callback(loginsuccess);
                            socket.handshake.session.save();
                            //socket.join(socket.handshake.sessionID);
                            //io.to(socket.handshake.sessionID).emit('reslogin', true);
                            /*keys.forEach(function (sock) {
                             //console.log('sockets[sock].id ...', sockets[sock].id)
                             //console.log('sockets[sock].handshake.sessionID ...', sockets[sock].handshake.sessionID)
                             //console.log('sockets[sock].handshake.session.userid ...', sockets[sock].handshake.session.userid)
                             //console.log('sockets[sock].handshake.session.userdata ...', sockets[sock].handshake.session.userdata)

                             if (sockets[sock].handshake.sessionID != sockets[socket.id].handshake.session.sessionID) {
                             console.log(sockets[sock].id)
                             //sockets[sock].emit('reslogin', loginsuccess);
                             }
                             });*/
                        }
                        //console.log('socket.handshake.session.userdata....', socket.handshake.session.userdata);
                        //console.log('sockets[socket.id]....', sockets[socket.id]);
                        //console.log('sockets[socket.id].handshake.session.userdata....', sockets[socket.id].handshake.session.userdata);
                    } else {
                        var loginsuccess = {};
                        loginsuccess.bool = false;
                        if (sockets[socket.id] != undefined) {
                            callback(loginsuccess);
                            //sockets[socket.id].emit('loginsuccess', loginsuccess);

                        }
                    }
                });
            }
            //console.log(socket);
            //console.log(socket.handshake);
            //console.log('socket.handshake.session ...' , socket.handshake.session);
            //console.log(socket.handshake.session.userdata);

        });


        socket.on("reqlogout", function (userdata) {
            //console.log(sockets[socket.id].id)
            // console.log(sockets[socket.id].handshake.sessionID)
            // console.log(sockets[socket.id].handshake.session.userid)
            console.log('socket.handshake.session.userdata ...', socket.handshake.session.userdata)
            io.to(socket.handshake.sessionID).emit('reslogout', true);
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        });

        socket.on("sessioncheckreq", function (data) {
            console.log("sessioncheckreq", data)
            socket.emit('sessioncheckres', socket.handshake.session.userdata);
        });


        /***************************************/
        socket.on('logincheck', function (data) {
            console.log('logincheck... ' + data);
            var sockets = io.sockets.sockets;
            var keys = Object.keys(sockets);
            //console.log(keys)
            console.log("userdata... ", data);
            var login = data.trim();
            if (0 < login.length) {
                var sql = "select * from users where login ='" + login + "'  ; ";
                db_pg.query(sql, (e, r)=> {
                    console.log("login..onlogin e.", e);
                    console.log("login..onlogin r.", r);
                    console.log("login..onlogin r.", r.rows);
                    var rowCount = r.rowCount;
                    if (0 < rowCount) {
                        var row = r.rows[0];
                        io.to(socket.handshake.sessionID).emit('lchkres', false);
                    } else {
                        io.to(socket.handshake.sessionID).emit('lchkres', true);
                    }
                });
            }
        });


        socket.on('reboot', function (data) {
            console.log(data);
            // Destroy all open sockets
            /*for (var socketId in serversockets) {
             console.log('socket', socketId, 'destroyed');
             serversockets[socketId].destroy();
             }*/
            //require('reboot').reboot();
        });

        socket.on('ServerClose', function (data) {
            console.log(data);
            execute('killall ffmpeg', function (callback) {
                console.log(callback);
            });
            connectionHandler = function () {
            }
            nsp.removeListener('connection', connectionHandler);

            // Close the server
            server.close(function () {
                console.log('Server closed!');
            });
            process.exit();
        });

        socket.on('disconnect', function () {
            console.log('disconnect: ' + socket.id + " at: " + Date());
            //mainLog('mainlog', 'disconnect: ' + socket.id + " at: " + Date());
        });


        //-------RTD-------------


    });


}() )




