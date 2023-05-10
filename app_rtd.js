'use strict';
var os = require("os");
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
//var pako = require('pako');

//var rtsp = require('rtsp-ffmpeg');
var hostip = getHostIP();
const port = 4056;
const rtdimagesurl = "http://140.82.7.5:4056";
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');

var app = express();

var server = https.createServer({
    ca: fs.readFileSync('certs/fullchain.pem'),
    key: fs.readFileSync('certs/privkey.pem'),
    cert: fs.readFileSync('certs/cert.pem')
}, app);
const requestHandler = (request, response) => {
    console.log(request.url)
    var host = request.headers.host;
    console.log("host", host);
    var hostarr = host.split(":")
    console.log("hostarr", hostarr);
    var domain = hostarr[0];

    response.end('<script>window.location.href = "https://' + domain + ':' + port + '"</script>')
}
var server_ = http.createServer(requestHandler);
var port_ = 4057;
server_.listen(port_, function () {
    console.log('server_ listening on port ', port_);
});
server.listen(port, /*"127.0.0.1",*/ function () {
    console.log('server listening on port ' + port);
    //server.close();
}).on('error', function (err) {
    console.log('something bad happened...' + err)
});


var io = soketio(server, {wsEngine: 'ws', 'pingInterval': 5000, 'pingTimeout': 3600000});
var bodyParser = require('body-parser');
//var mysql = require('mysql');
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
io.use(sharedsession(session));

//app.use(nodeadmin(app));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// GET /style.css etc
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/images'));
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>


var db_pg = require('./db_pg');
var config_pg = {
    user: 'postgres',
    host: 'localhost',
    database: 'rtd',
    password: 'zzxxcc99',
    port: 5432
};
let model_pg;
db_pg.connect(config_pg, err=> {
    //console.log("...:", err)
    //console.log("db_pg.get()...:\n", db_pg.get())
    model_pg = require('./models/model_pg.js');
    db_pg.Users();
    db_pg.Flat();
    db_pg.Olx();
    db_pg.Olx1();
    db_pg.Wish();
    db_pg.Buyer();
    initdb_pg();
});


//=========================

var d = new Date();
console.log('Date.now()...', Date.now());
console.log('Date()...', Date());

// https://libraries.io/github/Fourdee/DietPi

app.get('/', function (req, res) {
    //console.log("req--------", req )
    var t = +new Date()
    //console.log("params", req.params)
    //console.log("query", req.query)
    //console.log("sessionID", req.sessionID)
    //console.log("session", req.session)
    //console.log("body", req.body)
    var a = req.query.a;
    res.send(a);
    //console.log("t-a:", t - a)
    //var sql = "select * from users where login ='" + "a" + "'; ";
    //model_pg.query(sql, (e, r)=> {
    //    //console.log("login..onlogin e.", e);
    //    //console.log("login..onlogin r.", r);
    //    console.log("login..onlogin r.", r.rows);
    //
    //    var rowCount = r.rowCount;
    //
    //    res.send(r.rows);
    //});

    //res.sendFile(__dirname + '/index1.html');
});
app.post('/', function (req, res) {
    //console.log("params", req.params)
    //console.log("query", req.query)
    //console.log("sessionID", req.sessionID)
    //console.log("session", req.session)
    //console.log("body", req.body)
    const payload = req.body;
    console.log(`Processing:`, payload);
    res.end()
    //res.sendStatus(200);
});
app.get('/main', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/flat', function (req, res) {
    res.sendFile(__dirname + '/flat.html');
});

app.get('/mainpage', function (req, res) {
    res.sendFile(__dirname + '/mainpage.html');
});

app.get('/:route', function (req, res) {
    var route = req.params.route;
    res.sendFile(__dirname + '/' + route + '.html');
});

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
app.post('/regpage', function (req, res) {
    console.log("req.body..", req.body);
    var data = req.body;
    console.log("userdata... ", data);
    var login = data.login.trim();
    var pass = data.pass.trim();
    var name = data.name.trim();
    var surname = data.surname.trim();
    if (0 < login.length && 0 < pass.length) {
        var sql = "select * from users where login ='" + login + "'; ";
        model_pg.query(sql, (e, r)=> {
            //console.log("login..onlogin e.", e);
            //console.log("login..onlogin r.", r);
            console.log("login..onlogin r.", r.rows);

            var rowCount = r.rowCount;

            if (0 == rowCount) {
                var sql = "INSERT INTO users (login,pass,name,surname) VALUES ('" + login + "','" + pass + "','" + name + "','" + surname + "');";
                model_pg.query(sql, (e, r) => {
                    console.log(e, r);
                    if (e == undefined) {
                        res.sendFile(__dirname + '/success.html');
                    } else {
                        res.sendFile(__dirname + '/error.html');
                    }
                });
            } else {
                res.sendFile(__dirname + '/error.html');
            }
        });
    }
});


//--------D-SHOP-------------

app.get('/slaves/:parent_id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    var parent_id = req.params.parent_id;

    var sql = "select * from users where parent_id=" + parent_id + "; ";
    model_pg_clients.query(sql, (e, r)=> {
        //console.log("login..onlogin e.", e);
        //console.log("/slaves/:parent_id", r);
        //console.log("/slaves/:parent_id", r.rows);

        var rowCount = r.rowCount;
        res.send(r.rows);

    });
});


app.post('/savenewslave', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    console.log(req.body);
    var parent_id = req.body.parent_id;
    var name = req.body.name;
    var surname = req.body.surname;
    var login = req.body.login;
    var pass = req.body.pass;
    var address = req.body.address;
    var country = req.body.country;
    var city = req.body.city;
    var email = req.body.email;
    var telefon = req.body.telefon;

    var sql = "INSERT INTO users (parent_id,name,surname,login,pass,address,country,city,email,telefon) VALUES " +
        "(" + parent_id +
        ",E'" + name.addSlashes() + "'" +
        ",E'" + surname.addSlashes() + "'" +
        ",E'" + login.addSlashes() + "'" +
        ",E'" + pass.addSlashes() + "'" +
        ",E'" + address.addSlashes() + "'" +
        ",E'" + country.addSlashes() + "'" +
        ",E'" + city.addSlashes() + "'" +
        ",E'" + email.addSlashes() + "'" +
        ",E'" + telefon.addSlashes() + "'" +
        ")  RETURNING id ;";
    console.log(sql);

    model_pg_clients.query(sql, (err, result) => {
        //console.log(err, result);
        console.log(result.rows[0].id);
        res.send(result.rows[0]);
    });

});

app.post('/updateslave', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    console.log(req.body);
    var id = req.body.id;
    var name = req.body.name;
    var surname = req.body.surname;
    var login = req.body.login;
    var pass = req.body.pass;
    var address = req.body.address;
    var country = req.body.country;
    var city = req.body.city;
    var email = req.body.email;
    var telefon = req.body.telefon;

    var sql = "UPDATE users SET (name,surname,login,pass,address,country,city,email,telefon) = " +
        "(E'" + name.addSlashes() + "'" +
        ",E'" + surname.addSlashes() + "'" +
        ",E'" + login.addSlashes() + "'" +
        ",E'" + pass.addSlashes() + "'" +
        ",E'" + address.addSlashes() + "'" +
        ",E'" + country.addSlashes() + "'" +
        ",E'" + city.addSlashes() + "'" +
        ",E'" + email.addSlashes() + "'" +
        ",E'" + telefon.addSlashes() + "'" +
        ") where id=" + id + " ;";
    console.log(sql);

    model_pg_clients.query(sql, (e, r) => {
        //console.log(e, r);
        //console.log(result.rows[0].id);
        //res.send(result.rows[0]);
        if (e == undefined && r.rowCount > 0) {
            res.send({bool: true});
        } else {
            res.send({bool: false});
        }
    });

});

app.get('/deleteslave/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    var id = req.params.id;

    var sql = "delete from users where id=" + id + "; ";
    model_pg_clients.query(sql, (e, r)=> {
            //console.log(e, r);
            if (e == undefined && r.rowCount > 0) {
                res.send({bool: true});
            } else {
                res.send({bool: false});
            }
        }
    );
});

app.post('/updateprivilege', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    console.log(req.body);
    var id = req.body.id;
    var see_pr_prc = req.body.see_pr_prc;
    var upd_pr_prc = req.body.upd_pr_prc;
    var upd_del_pr = req.body.upd_del_pr;
    var upd_ret_prc = req.body.upd_ret_prc;
    var acs_db = req.body.acs_db;

    var sql = "UPDATE users SET (see_pr_prc,upd_pr_prc,upd_del_pr,upd_ret_prc,acs_db) = " +
        "(" + see_pr_prc + "" +
        "," + upd_pr_prc + "" +
        "," + upd_del_pr + "" +
        "," + upd_ret_prc + "" +
        "," + acs_db + "" +
        ") where id=" + id + " ;";
    //console.log(sql);
    model_pg_clients.query(sql, (e, r) => {
        //console.log(e, r);
        //console.log(result.rows[0].id);
        //res.send(result.rows[0]);
        if (e == undefined && r.rowCount > 0) {
            res.send({bool: true});
        } else {
            res.send({bool: false});
        }
    });

});


//-----D-SHOP-----sync-----
app.post('/synccls/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var name = o.name;
            var surname = o.surname;
            var login = o.login;
            var pass = o.pass;
            var address = o.address;
            var country = o.country;
            var city = o.city;
            var email = o.email;
            var telefon = o.telefon;
            var modified = o.modified;
            var sql = "INSERT INTO cls (master_id,id,name,surname,login,pass,address,country,city,email,telefon,modified) values  (" +
                "" + master_id + " " +
                "," + id + " " +
                ",E'" + name.addSlashes() + "' " +
                ",E'" + surname.addSlashes() + "' " +
                ",E'" + login.addSlashes() + "' " +
                ",E'" + pass.addSlashes() + "' " +
                ",E'" + address.addSlashes() + "' " +
                ",E'" + country.addSlashes() + "' " +
                ",E'" + city.addSlashes() + "' " +
                ",E'" + email.addSlashes() + "' " +
                ",E'" + telefon.addSlashes() + "' " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,name,surname,login,pass,address,country,city,email,telefon,modified) = (" +
                "" + master_id + " " +
                "," + id + " " +
                ",E'" + name.addSlashes() + "' " +
                ",E'" + surname.addSlashes() + "' " +
                ",E'" + login.addSlashes() + "' " +
                ",E'" + pass.addSlashes() + "' " +
                ",E'" + address.addSlashes() + "' " +
                ",E'" + country.addSlashes() + "' " +
                ",E'" + city.addSlashes() + "' " +
                ",E'" + email.addSlashes() + "' " +
                ",E'" + telefon.addSlashes() + "' " +
                "," + modified + " " +
                ") WHERE cls.modified < " + modified + " and cls.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from cls where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncmybarcode/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var upcean = o.upcean;
            var name = o.name;
            var categoryid = o.categoryid;
            var categoryname = o.categoryname;
            var brandid = o.brandid;
            var brandname = o.brandname;
            var folder_id = o.folder_id;
            var modified = o.modified;
            var sql = "INSERT INTO mybarcode (master_id,id,upcean,name,categoryid,categoryname,brandid,brandname,folder_id,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                ",E'" + upcean.addSlashes() + "' " +
                ",E'" + name.addSlashes() + "' " +
                "," + categoryid + " " +
                ",E'" + categoryname.addSlashes() + "' " +
                "," + brandid + " " +
                ",E'" + brandname.addSlashes() + "' " +
                "," + folder_id + " " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,upcean,name,categoryid,categoryname,brandid,brandname,folder_id,modified) = (" +
                "" + master_id + " " +
                "," + id + " " +
                ",E'" + upcean.addSlashes() + "' " +
                ",E'" + name.addSlashes() + "' " +
                "," + categoryid + " " +
                ",E'" + categoryname.addSlashes() + "' " +
                "," + brandid + " " +
                ",E'" + brandname.addSlashes() + "' " +
                "," + folder_id + " " +
                "," + modified +
                ") WHERE mybarcode.modified < " + modified + " and mybarcode.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from mybarcode where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncprc/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var t = o.t;
            var upcean = o.upcean;
            var p = o.p;
            var modified = o.modified;
            var sql = "INSERT INTO prc (master_id,id,t,upcean,p,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + p + " " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,t,upcean,p,modified) = (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + p + " " +
                "," + modified + " " +
                ") WHERE prc.modified < " + modified + " and prc.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from prc where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncprcout/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var t = o.t;
            var upcean = o.upcean;
            var p = o.p;
            var modified = o.modified;
            var sql = "INSERT INTO prcout (master_id,id,t,upcean,p,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + p + " " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,t,upcean,p,modified) = (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + p + " " +
                "," + modified + " " +
                ") WHERE prcout.modified < " + modified + " and prcout.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from prcout where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncprihod/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var t = o.t;
            var upcean = o.upcean;
            var qty = o.qty;
            var pv = o.pv;
            var p = o.p;
            var c = o.c;
            var modified = o.modified;
            var sql = "INSERT INTO prihod (master_id,id,t,upcean,qty,pv,p,c,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + qty + " " +
                "," + pv + " " +
                "," + p + " " +
                "," + c + " " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,t,upcean,qty,pv,p,c,modified) = (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + qty + " " +
                "," + pv + " " +
                "," + p + " " +
                "," + c + " " +
                "," + modified +
                ") WHERE prihod.modified < " + modified + " and prihod.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from prihod where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncrct/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var b = o.b;
            if (b == 0)continue;
            var id = o.id;
            var t = o.t;
            var c = o.c;
            var s = o.s;
            var o2 = o.o;
            var q = o.q;
            var modified = o.modified;
            var sql = "INSERT INTO rct (master_id,id,t,c,s,o,q,b,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                "," + c + " " +
                "," + s + " " +
                "," + o2 + " " +
                "," + q + " " +
                "," + b + " " +
                "," + modified + " ) " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,t,c,s,o,q,b,modified) = (" +
                " " + master_id + " " +
                "," + id + " " +
                "," + t + " " +
                "," + c + " " +
                "," + s + " " +
                "," + o2 + " " +
                "," + q + " " +
                "," + b + " " +
                "," + modified +
                ") WHERE rct.modified < " + modified + " and rct.master_id =" + master_id +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sql = "DELETE FROM rasxod WHERE r IN (SELECT id FROM rct WHERE b=2);";

            var sqlres = sql + "select * from rct where master_id=" + master_id + ";";

            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e,r);
                //console.log(r.rows);
                if (e == undefined && r[1].rowCount > 0) {
                    var o = {bool: true, rows: r[1].rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

app.post('/syncrasxod/:id', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    var master_id = req.params.id;
    var inarray = req.body;

    var p = new Promise((resolve, reject)=> {
        for (var i in inarray) {
            var o = inarray[i];
            var id = o.id;
            var upcean = o.upcean;
            var qty = o.qty;
            var pv = o.pv;
            var p = o.p;
            var r = o.r;
            var modified = o.modified;
            var sql = "INSERT INTO rasxod (master_id,id,upcean,qty,pv,p,r,modified) values  (" +
                " " + master_id + " " +
                "," + id + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + qty + " " +
                "," + pv + " " +
                "," + p + " " +
                "," + r + " " +
                "," + modified + " )   " +
                "ON CONFLICT (id) DO UPDATE SET (master_id,id,upcean,qty,pv,p,r,modified) = (" +
                " " + master_id + " " +
                "," + id + " " +
                ",E'" + upcean.addSlashes() + "' " +
                "," + qty + " " +
                "," + pv + " " +
                "," + p + " " +
                "," + r + " " +
                "," + modified +
                ") WHERE rasxod.modified < " + modified + " AND rasxod.master_id =" + master_id +
                " AND rasxod.r NOT IN (SELECT id FROM rct WHERE b=2)  " +
                ";";//
            //console.log(sql);
            model_pg_clients.query(sql, (e, r) => {
                //console.log(e );
                //console.log(e, r);
            });
            //console.log(i, inarray.length);
            if (i == inarray.length - 1) {
                resolve(true);
            }
        }
        if (inarray.length == 0) {

            resolve(true);
        }
    }).then(r=> {
            //console.log('r',r);
            //res.send({bool: false});
            var sqlres = "select * from rasxod where master_id=" + master_id;
            model_pg_clients.query(sqlres, (e, r) => {
                //console.log(e);
                //console.log( r.rows);
                if (e == undefined && r.rowCount > 0) {
                    var o = {bool: true, rows: r.rows};
                    //console.log("o",o);
                    res.send(o);
                } else {
                    res.send({bool: false});
                }
            });
        });
});

//----------RTD---------------

app.get('/fields/:table', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    var table = req.params.table;
    //var row = JSON.parse(fs.readFileSync("flat.json"));
    var flat3 = fs.readFileSync("flat3.json");
    var data = flat3.length != 0 ? JSON.parse(flat3) : {};
    var json = {
        //schema: row.flat.schema,
        data: data
    };
    //console.log(json)
    res.send(json);
});

app.get('/flat/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var table = req.params.table;
    var id = req.params.id;

    var sql = "SELECT " +
        " elon    " +
        " FROM olx " +
        " WHERE id=" + id + " " +
            //" order by link asc " +
        ";";
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows...", rows);
        var elon = rows.length > 0 ? rows[0].elon : {};
        var pre_images = elon.maininfo.images;
        var images = []
        if (pre_images != undefined) {
            pre_images.forEach(url=> {
                images.push(getfname(url));
            });
        }
        elon.maininfo.images = images
        var json = {
            data: elon,
            url: rtdimagesurl
        };
        res.send(json);
    });
});

app.get('/flatext/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var table = req.params.table;
    var id = req.params.id;

    var sql = "SELECT " +
        " elon    " +
        " FROM olx " +
        " WHERE id=" + id + " " +
            //" order by link asc " +
        ";";
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows...", rows);
        var elon = rows.length > 0 ? rows[0].elon : {};
        var pre_images = elon.maininfo.images;
        var images = []
        if (pre_images != undefined) {
            pre_images.forEach(url=> {
                images.push(getfname(url));
            });
        }
        elon.maininfo.images = images
        delete elon.maininfo.link;
        delete elon.maininfo.ownerdatafull;
        delete elon.maininfo.ownertel;
        delete elon.maininfo.landmark;
        delete elon.maininfo.no;
        delete elon.maininfo.priceend;
        delete elon.maininfo.address.geolocation;
        delete elon.maininfo.remarks;
        delete elon.maininfo.infoorigin;
        var json = {
            data: elon,
            url: rtdimagesurl
        };
        res.send(json);
    });
});

app.get('/buyersearch/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var table = req.params.table;
    var id = req.params.id;

    var sql = "SELECT " +
        " elon    " +
        " ,result    " +
        " FROM wish " +
        " WHERE id=" + id + " " +
        ";";
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows...", rows.length);
        var json = {
            data: rows.length > 0 ? rows[0] : {}
        };
        res.send(json);
    });
});

app.get('/wish/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var table = req.params.table;
    var id = req.params.id;

    var sql = "SELECT " +
        " elon    " +
        " FROM wish " +
        " WHERE id=" + id + " " +
        ";";
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows...", rows);
        var json = {
            data: rows.length > 0 ? rows[0].elon : {}
        };
        res.send(json);
    });
});

app.get('/buyerprofile/:id', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var table = req.params.table;
    var id = req.params.id;

    var sql = "SELECT " +
        " personaldata    " +
        " FROM buyer " +
        " WHERE id=" + id + " " +
        ";" +
        "select id" +
        ",elon as wish " +
        " ,result " +
        "from wish " +
        " where buyerid=" + id + " order by id";
    console.log(sql);
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r[0].rows;
        var rows1 = r[1].rows;
        console.log("rows...", rows);
        //console.log("rows1...", rows1);
        var json = {
            data: rows.length > 0 ? rows[0] : {},
            wishes: rows1.length > 0 ? rows1 : []
        };
        res.send(json);
    });
});


app.get('/buyerlist/:offset/:pages', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    var pages = req.params.pages;
    var offset = req.params.offset;
    var sql = "SELECT " +
        "id " +
        ",personaldata -> 'maininfo' -> 'customerdata' as customerdata  " +
        ",personaldata -> 'maininfo' -> 'customertel' as customertel  " +
        "  FROM buyer " +
        " ORDER BY id ASC " +
        "  OFFSET " + offset +
        "  LIMIT " + pages + ";";
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows", rows);
        var ofs = rows[rows.length - 1]
        //console.log("ofs....", ofs.id)

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        //console.log('addresses.....', addresses);
        var adr = addresses[0];

        var json = {
            data: rows,
            next_page_url: 'https://' + hostip + ':' + port + '/buyerlist/' + ofs.id + '/' + pages
        }
        res.send(json);
    });
    //console.log(json)

    return;

    var row = JSON.parse(fs.readFileSync("flat.json"));
    var flat3 = fs.readFileSync("flat3.json");
    var data = flat3.length != 0 ? JSON.parse(flat3) : {};

    var json = {
        schema: row.flat.schema,
        data: data
    };
});


app.get('/list/landmark/:offset/:pages', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    var pages = req.params.pages;
    var offset = req.params.offset;


    var sql = "SELECT " +
        "id " +
        ",elon    " +
        ",link    " +
            //    ",elon -> 'maininfo' -> 'landmark' as landmark  " +
            //",elon -> 'maininfo' -> 'pricestart' as pricestart  " +
            //",elon -> 'maininfo' as maininfo  " +
        ",elon->'maininfo'->>'importance' as importance  " +
        "  FROM olx " +
        " ORDER BY importance, t ASC " +
        "  OFFSET " + offset +
        "  LIMIT " + pages + ";";
    var tb = +new Date()
    model_pg.query(sql, (e, r)=> {
        console.log("e", e);
        console.log("r", r);
        var rows = r.rows;
        //console.log("rows", rows);
        var ofs = rows[rows.length - 1]
        //console.log("ofs....", ofs.id)
        var rw = []

        //
        rows.forEach(r=> {
            var mi = r.elon.maininfo;
            rw.push({
                id: r.id,
                landmark: mi.landmark,
                tel: mi.ownertel != undefined ? mi.ownertel[0] : "",
                link: r.link,
                msgstatus: mi.msgstatus
            })
            //console.log('dur.....', (+new Date())-tb);
        })
        rows = rw
        console.log('dur.....', (+new Date()) - tb);

        var json = {
            data: rows,
            next_page_url: 'https://' + hostip + ':' + port + '/list/landmark/' + ofs.id + '/' + pages
        }
        res.send(json);
    });
    //console.log(json)

    return;

    var row = JSON.parse(fs.readFileSync("flat.json"));
    var flat3 = fs.readFileSync("flat3.json");
    var data = flat3.length != 0 ? JSON.parse(flat3) : {};

    var json = {
        schema: row.flat.schema,
        data: data
    };
});

app.get('/textsearch/:text/:offset/:pages', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    var text = req.params.text;
    var pages = req.params.pages;
    var offset = req.params.offset;

    var sql = "SELECT " +
        "id " +
        ",elon " +
        " ,link " +
        ",elon->'maininfo'->>'importance' as importance  " +
        " from olx where " +
            //" elon->'maininfo'->>'remarks' ~*'.*" + text + ".*' " +
        " elon->>'maininfo' ~*'.*" + text + ".*' " +

            //" OR " +
            //" elon->'maininfo'->>'landmark' ~*'.*" + text + ".*' " +
        " ORDER BY importance, t ASC " +
        "  OFFSET " + offset +
        "  LIMIT " + pages + ";";
    console.log("sql", sql);
    var tb = +new Date()
    model_pg.query(sql, (e, r)=> {
        console.log("e", e);
        //console.log("r", r);
        var rows = r.rows;
        console.log("rows", rows);
        console.log("length", rows.length);
        var ofs = rows[rows.length - 1]
        if (ofs == undefined) {
            res.send(200);
            return
        }
        console.log("ofs....", ofs.id)
        var rw = []

        //
        rows.forEach(r=> {
            var mi = r.elon.maininfo;
            //i++;
            var lm =
                //i + ". " +
                (  mi.address.district != undefined ? mi.address.district : '~') + " " +
                (  mi.rooms != undefined ? mi.rooms : '~') + "/" +
                (  mi.floor != undefined ? mi.floor : '~') + "/" +
                (   mi.storeys != undefined ? mi.storeys : '~') + " " +
                    //"цена: с " + (mi.pricestart != undefined ? mi.pricestart : '~') + " " +
                    //"до " + (mi.priceend != undefined ? mi.priceend : '~') + " | " +
                "цена: " + (mi.pricestart != undefined ? mi.pricestart : '~') + " | " +
                eachRecursive2(mi);
            //(mi.landmark != undefined ? mi.landmark : '~') + " | " +
            //mi.landmark + " :: " + mi.remarks
            ;
            //console.log("ofs....", )
            ;
            rw.push({
                id: r.id,
                //remarks: r.elon.maininfo.landmark,
                landmark: lm,
                tel: mi.ownertel != undefined ? mi.ownertel[0] : "",
                link: r.link,
                msgstatus: mi.msgstatus
            })
            //console.log('dur.....', (+new Date())-tb);
        })
        rows = rw
        console.log('dur.....', (+new Date()) - tb);
        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        //console.log('addresses.....', addresses);
        var adr = addresses[0];

        var json = {
            data: rows,
            next_page_url: 'https://' + adr + ':' + port + '/textsearch/' + text + '/' + ofs.id + '/' + pages
        }
        res.send(json);
    });
    //console.log(json)

});

app.get('/wishresultlist/:id/:pages', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var pages = req.params.pages;
    //var offset = req.params.offset;
    var id = req.params.id;

    model_pg.query("(SELECT  replace(replace(result::text,'[','' ),']','') as ids  from wish where id=" + id + ") ", (e, r)=> {
        console.log("e", e);
        //console.log("r", r);
        var ids = r.rows[0].ids;
        console.log("ids..", ids);
        if (ids == "") {
            var json = {
                data: []
                //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
            }
            res.send(json);
            return
        }

        var sql = "SELECT " +
            "id " +
            ",elon    " +
            ",link    " +
            ",t    " +
            ",elon->'maininfo'->>'importance' as importance  " +
            "  FROM olx ol " +
            " WHERE  " +
            " id in  (" + ids + ") " +
            " ORDER BY importance, t ASC " +
                //"  OFFSET " + offset +
                //"  LIMIT " + 1 + " " +
            ";" +
                //"select elon from wish where id="+id+";" +
            "";
        var tb = +new Date()
        console.log("sqll", sql);
        model_pg.query(sql, (e, r)=> {
            console.log("e", e);
            //console.log("r", r);
            console.log("r0", r.rows);
            var rows = r.rows;
            //var resname = r[1].rows[0].elon.maininfo;
            //console.log("rows", rows);
            //var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var rw = [], i = 0;
            rows.forEach(r=> {
                var mi = r.elon.maininfo;
                i++;
                var lm = i + ". " +
                    (  mi.address.district != undefined ? mi.address.district : '~') + " " +
                    (  mi.rooms != undefined ? mi.rooms : '~') + "/" +
                    (  mi.floor != undefined ? mi.floor : '~') + "/" +
                    (   mi.storeys != undefined ? mi.storeys : '~') + " " +
                        //"цена: с " + (mi.pricestart != undefined ? mi.pricestart : '~') + " " +
                        //"до " + (mi.priceend != undefined ? mi.priceend : '~') + " | " +
                    "цена: " + (mi.pricestart != undefined ? mi.pricestart : '~') + " | " +
                    (mi.landmark != undefined ? mi.landmark : '~');
                rw.push({
                    id: r.id,
                    landmark: lm,
                    tel: mi.ownertel[0] != undefined ? mi.ownertel[0] : "",
                    link: r.link,
                    t: moment(Number(r.t)).format( "DD.MM" ),
                    msgstatus: mi.msgstatus,
                    im: mi.images != undefined ? mi.images.length : 0

                })
                //console.log('dur.....', (+new Date())-tb);
            })
            rows = rw
            console.log('dur.....', (+new Date()) - tb);
            var interfaces = os.networkInterfaces();
            var addresses = [];
            for (var k in interfaces) {
                for (var k2 in interfaces[k]) {
                    var address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
            //console.log('addresses.....', addresses);
            var adr = addresses[0];

            var json = {
                data: rows
                //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
            }
            res.send(json);
        });


    })


});

app.get('/wishresultlistext/:id/:pages', function (req, res) {
    //console.log(req,res);
    console.log(req.params);
    //var pages = req.params.pages;
    //var offset = req.params.offset;
    var id = req.params.id;

    model_pg.query("(SELECT  replace(replace(result::text,'[','' ),']','') as ids  from wish where id=" + id + ") ", (e, r)=> {
        console.log("e", e);
        //console.log("r", r);
        var ids = r.rows[0].ids;
        console.log("ids..", ids);
        if (ids == "") {
            var json = {
                data: []
                //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
            }
            res.send(json);
            return
        }

        var sql = "SELECT " +
            "id " +
            ",elon    " +
            ",link    " +
            ",elon->'maininfo'->>'importance' as importance  " +
            "  FROM olx ol " +
            " WHERE  " +
            " id in  (" + ids + ") " +
            " ORDER BY importance, t ASC " +
                //"  OFFSET " + offset +
                //"  LIMIT " + 1 + " " +
            ";" +
                //"select elon from wish where id="+id+";" +
            "";
        var tb = +new Date()
        console.log("sqll", sql);
        model_pg.query(sql, (e, r)=> {
            console.log("e", e);
            //console.log("r", r);
            console.log("r0", r.rows);
            var rows = r.rows;
            //var resname = r[1].rows[0].elon.maininfo;
            //console.log("rows", rows);
            //var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var rw = [], i = 0;
            rows.forEach(r=> {
                var mi = r.elon.maininfo;
                i++;
                var lm = i + ". " +
                    (  mi.address.district != undefined ? mi.address.district : '~') + " " +
                    (  mi.rooms != undefined ? mi.rooms : '~') + "/" +
                    (  mi.floor != undefined ? mi.floor : '~') + "/" +
                    (   mi.storeys != undefined ? mi.storeys : '~') + " " +
                        //"цена: с " + (mi.pricestart != undefined ? mi.pricestart : '~') + " " +
                        //"до " + (mi.priceend != undefined ? mi.priceend : '~') + " | " +
                    "цена: " + (mi.pricestart != undefined ? mi.pricestart : '~') + " | " +
                        //(mi.landmark != undefined ? mi.landmark : '~')+
                    "";
                rw.push({
                    id: r.id,
                    landmark: lm,
                    //tel: mi.ownertel[0]!=undefined ? mi.ownertel[0] : "",
                    //link: r.link,
                    msgstatus: mi.msgstatus,
                    im: mi.images != undefined ? mi.images.length : 0

                })
                //console.log('dur.....', (+new Date())-tb);
            })
            rows = rw
            console.log('dur.....', (+new Date()) - tb);
            var interfaces = os.networkInterfaces();
            var addresses = [];
            for (var k in interfaces) {
                for (var k2 in interfaces[k]) {
                    var address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
            //console.log('addresses.....', addresses);
            var adr = addresses[0];

            var json = {
                data: rows
                //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
            }
            res.send(json);
        });


    })


});

function getHostIP() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    //console.log('addresses.....', addresses);
    var adr = addresses[0];
    return adr;
}

function getfname(url) {
    var nmar = url.split("/")
    var fname = nmar[nmar.length - 1]
    //console.log(fname)
    return fname
}

function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}

// This function handles arrays and objects
function eachRecursive(obj) {
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

function eachRecursive2(obj) {
    var str = "";
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
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

app.post('/buyer', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = /*JSON.stringify*/(req.body.s );
    console.log(s)
    fs.writeFileSync("flat3.json", s);

    var o = JSON.parse(s);
    var sql = "INSERT INTO buyer (personaldata)" +
        "VALUES (" +
        "'" + JSON.stringify(o) + "'::json" +
        ") RETURNING id;";
    console.log(sql);
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        console.log("id", r.rows[0].id);
        res.send(r.rows[0]);
    });


});
app.post('/wish', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = req.body.s;
    var b = Number(req.body.b);
    //console.log(s)
    //fs.writeFileSync("flat3.json", s);

    var o = JSON.parse(s);
    var sql = "INSERT INTO wish (buyerid,elon)" +
        "VALUES (" +
        b +
        ", '" + JSON.stringify(o) + "'::json" +
        ") RETURNING id;";
    console.log(sql);
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        console.log("id", r.rows[0].id);

        var id = r.rows[0].id;
        var obj = JSON.parse(s);
        var o = JSON.parse(s);
        console.log("o...", o);
        var mi = o.maininfo
        var pricestart = mi.pricestart == undefined ? 0 : mi.pricestart;
        console.log("pricestart...", pricestart);
        var priceend = mi.priceend == undefined ? 100000000000000 : mi.priceend;
        console.log("priceend...", priceend);

        delete mi.pricestart;
        delete mi.priceend;
        console.log("mi...", mi);
        var sql2 = "SELECT " +
            "id " +
            ",elon " +
            "  FROM olx " +
            " WHERE " +
            " (elon -> 'maininfo' ) @> '" + JSON.stringify(mi) + "'  " +
            " AND " +
            " CAST(elon -> 'maininfo' ->> 'pricestart' as numeric)  BETWEEN " + pricestart +
            "  AND " + priceend +
            " ORDER BY id ASC " +
                //"  OFFSET " + offset +
                //"  LIMIT " + pages + "" +
                //"  LIMIT " + 1000000 + "" +
            ";";
        //console.log("sql2", sql2);
        var tb = +new Date()
        model_pg.query(sql2, (e, r)=> {
            console.log("e", e);
            //console.log("r", r.rows);
            console.log("r", r.rows.length);
            var rslt = []
            r.rows.forEach(row=> {
                //if (row.has) {  }
                //    console.log("row", row.elon.maininfo);
                //    console.log("pricestart...", row.elon.maininfo.pricestart);
                //    console.log("id...", row.id);
                rslt.push(Number(row.id))
            });
            //console.log("rslt", rslt);
            console.log("rslt.length", rslt.length);
            console.log('dur1.....', (+new Date()) - tb);
            var sql3 = "UPDATE wish SET " +
                " elon='" + JSON.stringify(obj) + "'::json " +
                " ,result='" + JSON.stringify(rslt) + "'::json " +
                " WHERE id=" + id + " RETURNING id;";
            //console.log(sql)
            model_pg.query(sql3, (e, r)=> {
                //console.log("e", e);
                //console.log("r", r);
                //console.log("id", r.rows[0].id);
                //res.send(r.rows[0]);
                console.log('dur2.....', (+new Date()) - tb);
            });
        });

        res.send(r.rows[0]);
    });


});
app.post('/olx', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = req.body.s;
    var b = Number(req.body.b);
    //console.log(s)
    //fs.writeFileSync("flat3.json", s);

    var o = JSON.parse(s);
    var sql = "INSERT INTO olx ( elon,t)" +
        "VALUES (" +
        " '" + JSON.stringify(o) + "'::json" +
        ", " + (+new Date()) +
        ") RETURNING id;";
    console.log(sql);
    model_pg.query(sql, (e, r)=> {
        console.log("e", e);
        console.log("r", r);
        console.log("id", r.rows[0].id);
        res.send(r.rows[0]);
    });


});


app.put('/buyer', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = req.body.s;
    var id = req.body.id;
    //console.log(req.body )
    //fs.writeFileSync("flat3.json", s);

    var o = JSON.parse(s);
    var sql = "update buyer set personaldata='" + JSON.stringify(o) + "'::json where id=" + id + " RETURNING id;";
    console.log(sql)
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        console.log("id", r.rows[0].id);
        res.send(r.rows[0]);
    });
});
app.put('/wish', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = req.body.s;
    var id = req.body.id;
    //console.log(req.body )
    //fs.writeFileSync("flat3.json", s);

    var obj = JSON.parse(s);
    var o = JSON.parse(s);
    console.log("o...", o);
    var mi = o.maininfo
    var pricestart = mi.pricestart == undefined ? 0 : mi.pricestart;
    console.log("pricestart...", pricestart);
    var priceend = mi.priceend == undefined ? 100000000000000 : mi.priceend;
    console.log("priceend...", priceend);

    delete mi.pricestart;
    delete mi.priceend;
    console.log("mi...", mi);
    var sql2 = "SELECT " +
        "id " +
        ",elon " +
        "  FROM olx " +
        " WHERE " +
        " (elon -> 'maininfo' ) @> '" + JSON.stringify(mi) + "'  " +
        " AND " +
        " CAST(elon -> 'maininfo' ->> 'pricestart' as numeric)  BETWEEN " + pricestart +
        "  AND " + priceend +
        " ORDER BY id ASC " +
            //"  OFFSET " + offset +
            //"  LIMIT " + pages + "" +
            //"  LIMIT " + 1000000 + "" +
        ";";
    console.log("sql2", sql2);
    var tb = +new Date()
    model_pg.query(sql2, (e, r)=> {
        console.log("e", e);
        //console.log("r", r.rows);
        console.log("r", r.rows.length);
        var rslt = []
        r.rows.forEach(row=> {
            //if (row.has) {  }
            //    console.log("row", row.elon.maininfo);
            //    console.log("pricestart...", row.elon.maininfo.pricestart);
            //console.log("id...", typeof  row.id);
            rslt.push(Number(row.id))
        });
        //console.log("rslt", rslt);
        console.log("rslt.length", rslt.length);
        console.log('dur1.....', (+new Date()) - tb);
        var sql = "UPDATE wish SET " +
            " elon='" + JSON.stringify(obj) + "'::json " +
            " ,result='" + JSON.stringify(rslt) + "'::json " +
            " WHERE id=" + id + " RETURNING id;" +
            "";
        //console.log(sql)
        model_pg.query(sql, (e, r)=> {
            //console.log("e", e);
            //console.log("r", r);
            //console.log("id", r.rows[0].id);
            var sql = "SELECT " +
                " elon    " +
                " ,result    " +
                " FROM wish " +
                " WHERE id=" + id + " " +
                ";";
            model_pg.query(sql, (e, r)=> {
                //console.log("e", e);
                //console.log("r", r);
                var rows = r.rows;
                //console.log("rows...", rows);
                var json = {
                    data: rows.length > 0 ? rows[0] : {},
                    id: id
                };
                res.send(json);
            });


            //res.send(r.rows[0]);
            //console.log('dur2.....', (+new Date()) - tb);
        });
    });


});
app.put('/olx', function (req, res) {
    //console.log(req,res);
    //console.log(req.params);
    //console.log(req.body);
    //console.log(JSON.parse(req.body.s));
    var s = req.body.s;
    var id = req.body.id;
    //console.log(req.body )
    fs.writeFileSync("flat3.json", s);

    var o = JSON.parse(s);
    var sql = "update olx set elon='" + JSON.stringify(o) + "'::json where id=" + id + " RETURNING id;";
    //console.log(sql)
    model_pg.query(sql, (e, r)=> {
        //console.log("e", e);
        //console.log("r", r);
        console.log("id", r.rows[0].id);
        res.send(r.rows[0]);
    });
});


app.delete('/:table/:id', function (req, res) {
    var table = req.params.table;
    var id = req.params.id;

    var sql = "delete from " + table + " where id=" + id + ";";
    //console.log(sql)
    model_pg.query(sql, (e, r)=> {
        console.log("e", e);
        console.log("r", r);
        //console.log("id", r.rows[0].id);
        var st = e == undefined ? 200 : 500;
        res.sendStatus(st);
    });

});

//---------------------


var exec = child_process.exec;

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}


// Maintain a hash of all connected sockets
// http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
var serversockets = {}, nextSocketId = 0;


var globalkeys = [];
var keys;
var nsp = io.of('/');


process.on('uncaughtException', function (err) {
    //https://stackoverflow.com/questions/19909904/how-to-handle-all-exceptions-in-node-js
    console.log('uncaughtException: ' + err);
    //mainLog('errorlog', err);
    //mainLog('mainlog', err);
    //mainLog_('mainlog_', err.message);
    //mainLog_('mainlog__', err.stack);
    //process.exit(1);
});


function initdb_pg() {
    // savebarcode_pg()
    // addindex_pg()
    // createFolders_pg()
    //addFolders_pg()
    // addCats_pg()
    // savebarcode_pg_uz()
    // appendFolderuzToBarcode();
    //exportToCSV();
}


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

            model_pg.query(sql, (e, r)=> {
                //console.log("login..onlogin e.", e, r.rows);
                //console.log("login..onlogin r.", r);
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
            model_pg.query(sql, (e, r)=> {
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
        mainLog('mainlog', 'disconnect: ' + socket.id + " at: " + Date());
    });


    //-------RTD-------------


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


if (!String.prototype.addSlashes) {
    String.prototype.addSlashes = function () {
        //no need to do (str+'') anymore because 'this' can only be a string
        return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }
}
else
    alert("Warning: String.addSlashes has already been declared elsewhere.");



