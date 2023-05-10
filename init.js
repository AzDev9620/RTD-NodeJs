const os = require('os');
var express = require('express');
var fs = require('fs');
var http = require('http');
var child_process = require('child_process');
var soketio = require('socket.io');
var moment = require('moment');//http://momentjs.com/docs
var ontime = require('ontime');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var pako = require('pako');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var rtsp = require('rtsp-ffmpeg');
const port = 3014;

var app = express();
var server = http.createServer(app);


var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");
//server.maxConnections = 4;

// Attach session
app.use(session);
// Share session with io sockets


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(__dirname + '/public'));

var io = soketio(server, {wsEngine: 'ws', 'pingInterval': 5000, 'pingTimeout': 3600000});
io.use(sharedsession(session));

var exec = child_process.exec;

var execute = function (command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}
exports.Server = server;
exports.Io = io;
exports.App = app;


function myPort() {
    //var port = 3062;
    //var os = require('os');
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                switch (iface.address) {
                    case '192.168.0.102':
                        //port = 3030;
                        break;
                    case '192.168.1.5':
                        //port = 3030;
                        break;

                    //case '104.131.101.131':
                    //    port = 80;
                    //    break;
                    case '45.63.116.235':
                        //port = 3030;
                        break;

                }
                console.log('ifname, iface.address, port...', ifname, iface.address, port);
                console.log("http://" + iface.address + ":" + port);
            }
            ++alias;
        });
    });
    return port;
}