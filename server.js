//var os = require("os");
const logger = require('morgan');

var express = require('express');

var fs = require('fs');
var http = require('http');
var https = require('https');
var child_process = require('child_process');
var soketio = require('socket.io');
var moment = require('moment-timezone');//http://momentjs.com/docs
var ontime = require('ontime');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var Conf = require('./Conf.js')
const ports = Conf.ports;
const port = Conf.port;
const ip = Conf.hostip;


moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
module.exports = (function () {

    var app = express();


    var server = https.createServer({
        ca: fs.readFileSync('certs/fullchain.pem'),
        key: fs.readFileSync('certs/privkey.pem'),
        cert: fs.readFileSync('certs/cert.pem')
    }, app);
    const requestHandler = (request, response) => {
        console.log(request.url)
        let host = request.headers.host;
        console.log("host", host);
        let hostarr = host.split(":")
        console.log("hostarr", hostarr);
        let domain = hostarr[0];

        response.end('<script>window.location.href = "https://' + domain + ':' + port + '/mainpage"</script>')
    }
    var server_ = http.createServer(requestHandler);
    server_.listen(port, function () {
        console.log('server_ listening on port ', port, 'http://' + ip + ':' + port);
    });
    server.listen(ports, /*"127.0.0.1",*/ function () {
        console.log('server listening on port ' + ports, 'https://' + ip + ':' + ports);
        console.log('https://' + ip + ':' + ports + '/signin77');
        console.log(ip);
        console.log(ports);
        //server.close();
    }).on('error', function (err) {
        console.log('something bad happened...' + err)
    });


    var io = soketio(server, {wsEngine: 'ws', 'pingInterval': 5000, 'pingTimeout': 3600000 * 24});
    var bodyParser = require('body-parser');
//var mysql = require('mysql');
    var session = require("express-session")({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
    });
    var sharedsession = require("express-socket.io-session");
//server.maxConnections = 4;

    app.use(logger('dev'));

// Attach session
    app.use(session);
// Share session with io sockets
    io.use(sharedsession(session));
    app.io = io;

//app.use(nodeadmin(app));
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

// GET /style.css etc
//     app.use(express.static(__dirname + '/'));
    app.use(express.static(__dirname + '/node_modules'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/utils'));
    app.use(express.static(__dirname + '/bower_components'));
    app.use(express.static(__dirname + '/images'));
    app.use(express.static(__dirname + '/common'));

    //app.use(favicon(__dirname + '/public/favicon.ico'));


    let userdata = function (req) {

        console.log('cookie```', req.headers.cookie);
        let sock = req.headers.cookie.split(';')[1].split('=')[1];
        // let io = req.app.io;
        let sockets = io.sockets.sockets;
        let keys = Object.keys(sockets);
        // console.log('keys```', keys);
        // console.log( sockets);
        // console.log('sock```', sock);
        for (let key of keys) {
            let oldkey = sockets[key].handshake.headers.cookie.split(';')[1].split('=')[1];
            // console.log('oldkey```', oldkey);
            // console.log('sock```', key, sock);
            // console.log('sockets[key]```', sockets[key].handshake.session.userdata);

            if (oldkey === sock || key === sock) {
                let ud = sockets[key] !== undefined ? sockets[key].handshake.session.userdata : undefined;
                // console.log('ud````', ud);
                return ud
            }
        }
    };


// This function handles arrays and objects
    let eachRecursive = function (obj) {
        for (var k in obj) {
            if (typeof obj[k] == "object" && obj[k] !== null) {
                console.log(k, "::", obj[k])
                eachRecursive(obj[k]);
            } else {
                // do something...
                console.log(k, "==", obj[k])
            }
        }
    }

    let eachRecursive2 = function (obj) {
        var str = "";
        for (let k in obj) {
            if (typeof obj[k] === "object" && obj[k] !== null) {
                //console.log(k, "::", obj[k])
                eachRecursive2(obj[k]);
            } else {
                // do something...
                //console.log(k, "==", obj[k])
                str += " " + obj[k]
            }
        }
        return str;
    }


    return {server, app, io, userdata, eachRecursive2}

}());




