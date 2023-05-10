//'use strict';
var os = require("os");
var fs = require('fs');
var child_process = require('child_process');
var moment = require('moment-timezone');//http://momentjs.com/docs
var ontime = require('ontime');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
//var pako = require('pako');
var server = require('./server.js')

// var app = server.app
// var io = server.io
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');

process.on('uncaughtException', function(err){
    console.error(err.stack);
    // process.exit();
});
process.on('warning', function(err){
    console.error(err.stack);
    // process.exit();
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var db_pg = require('./db_pg');

// console.log("...:", db_pg)

db_pg.connect(err=> {
    console.log("db_pg.connect err...", err)
    // console.log("db_pg.get()...:\n", db_pg.get())
    db_pg.Users();
    db_pg.Flat();
    db_pg.Olx();
    db_pg.Olx1();
    db_pg.Wish();
    db_pg.Buyer();
    db_pg.Hudud();
});

require('./api_get.js')
require('./api_post.js')
require('./api_put.js')
require('./api_delete.js')
require('./api_socketio.js')

//require('buyersearchschema.js')
//eval(fs.readFileSync('buyersearchschema.js').toString());
//console.log('schem ' ,  /*JSON.stringify*/(schem)    );














//=========================

function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}

//---------------------


var exec = child_process.exec;

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}


// Maintain a hash of all connected sockets
// http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately



process.on('uncaughtException', function (err) {
    //https://stackoverflow.com/questions/19909904/how-to-handle-all-exceptions-in-node-js
    console.log('uncaughtException: ' + err);
    //mainLog('errorlog', err);
    //mainLog('mainlog', err);
    //mainLog_('mainlog_', err.message);
    //mainLog_('mainlog__', err.stack);
    //process.exit(1);
});

function compressToGzipBase64(object) {
    "use strict";
    //https://stackoverflow.com/questions/16569042/send-socket-io-response-data-to-client-from-node-js-server-in-gzip-format
    var jsonData = JSON.stringify(object);
    var buffer = zlib.gzipSync(jsonData);
    //console.log('err  ', err);
    //console.log('buffer  ', buffer);
    //console.log('buffer L', Buffer.byteLength(buffer, 'utf8'));
    //console.log('buffer  base64', buffer.toString('base64'));
    //console.log('buffer  base64 L', Buffer.byteLength(buffer.toString('base64'), 'utf8'));
    var base64 = buffer.toString('base64');
    //console.log('   base64', base64);
    //console.log('   base64 L', Buffer.byteLength(base64, 'utf8'));
    return base64;
}


