const moment = require('moment-timezone');//http://momentjs.com/docs
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
const server = require('./server.js');
// const Functions = require('./Functions.js');
// const Conf = require('./Conf.js');

const app = server.app;
const db_pg = require('./db_pg');
module.exports = (function () {


    app.post('/signin', (req, res) => {
        console.log(req.session)
        console.log(req.session.username)
        console.log(req.body)
        const sql = `SELECT * FROM users`
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            const users = r.rows
            let foundUser
            let userdata
            for (var i = 0; i < users.length; i++) {
                var u = users[i]
                if (u.login === req.body.username && u.pass === req.body.password) {
                    foundUser = u.login
                    userdata = u
                    break
                }
            }

            console.log(foundUser)

            if (foundUser !== undefined) {
                req.session.username = foundUser
                req.session.userdata = userdata
                // req.session.userdata.devices = []
                req.session.save()


                // const txt = `Login success, ID:  ${req.session.id}, user ${req.session.username}`
                const o = {id: req.session.id, username: req.session.username};
                console.log(o)
                // res.sendFile(__dirname + '/main.html');
                res.send(o)
            } else {
                const txt = `Login failed, ${req.body.username}`
                console.log(txt)
                res.status(401).send(false)
            }
        });
    })

    app.post('/logout', (req, res) => {
        console.log(req.body)
        // req.session.username = undefined
        delete req.session['username']
        console.log(req.session)
        res.send(true)
    });


    app.post('/buyer', function (req, res) {
        //console.log(req,res);
        //console.log(req.params);
        //console.log(req.body);
        //console.log(JSON.parse(req.body.s));


        // var userdata = server.userdata(req)
        // console.log('userdata````', userdata);
        // var uid = userdata.rol === 4 ? userdata.id : (userdata.rol === 1 || userdata.rol === 6) ? req.body.uid : 0;


        var s = req.body.s;
        console.log(s)
        var uid = req.body.uid;


        //fs.writeFileSync("flat3.json", s);

        var o = JSON.parse(s);
        var sql = "INSERT INTO buyer (personaldata, uid)" +
            "VALUES (" +
            "'" + JSON.stringify(o) + "'::json" +
            "," + uid +
            " ) RETURNING id;";
        console.log(sql);
        db_pg.query(sql, (e, r) => {
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
        db_pg.query(sql, (e, r) => {
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
            db_pg.query(sql2, (e, r) => {
                console.log("e", e);
                //console.log("r", r.rows);
                console.log("r", r.rows.length);
                var rslt = []
                r.rows.forEach(row => {
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
                db_pg.query(sql3, (e, r) => {
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
        db_pg.query(sql, (e, r) => {
            console.log("e", e);
            console.log("r", r);
            console.log("id", r.rows[0].id);
            res.send(r.rows[0]);
        });


    });

    app.post('/hudud', (req, res) => {
        console.log(req.body);
        let uid = req.body.id;
        let h = req.body.hudud
        let hududstr = h != undefined ? JSON.stringify(req.body.hudud) : '[]';
        let sql = "INSERT INTO hudud (uid, hudud) " +
            " VALUES " +
            " (" +
            uid +
            ",'" + hududstr + "'::jsonb " +
            "" +
            ") " +
            " ON CONFLICT (uid) DO " +
            " UPDATE SET hudud='" + hududstr + "'::jsonb" +
            " RETURNING uid;  ";
        // console.log(sql)
        db_pg.query(sql, (e, r) => {
            // console.log(r)
            if (r.rowCount == 1) {
                res.send(true)
            } else {
                res.send(false)
            }
        })
    });

    app.post('/users', (req, res) => {
        console.log(req.body);

        let o = req.body;
        let sql = "INSERT INTO users ( " +
            "  name" +
            "  ,surname" +
            "  ,login" +
            "  ,pass" +
            "  ,rol" +
            "  ,address" +
            "  ,country" +
            "  ,city" +
            "  ,email" +
            "  ,telefon" +
            " ) " +
            " VALUES " +
            " (" +
            " '" + o.name + "'" +
            ",'" + o.surname + "'" +
            ",'" + o.login.toLowerCase() + "'" +
            ",'" + o.pass.toLowerCase() + "'" +
            "," + o.rol + "" +
            ",'" + o.address + "'" +
            ",'" + o.country + "'" +
            ",'" + o.city + "'" +
            ",'" + o.email + "'" +
            ",'" + o.telefon + "'" +
            ") " +
            " RETURNING id;  ";
        console.log(sql)
        db_pg.query(sql, (e, r) => {
            console.log(r)
            if (r != undefined && r.rowCount == 1) {
                res.send(true)
            } else {
                res.send(false)
            }
        })
    });

    /*app.post('/', function (req, res) {
        //console.log("params", req.params)
        //console.log("query", req.query)
        //console.log("sessionID", req.sessionID)
        //console.log("session", req.session)
        //console.log("body", req.body)
        const payload = req.body;
        console.log(`Processing:`, payload);
        res.end()
        //res.sendStatus(200);
    });*/
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
            db_pg.query(sql, (e, r) => {
                //console.log("login..onlogin e.", e);
                //console.log("login..onlogin r.", r);
                console.log("login..onlogin r.", r.rows);

                var rowCount = r.rowCount;

                if (0 == rowCount) {
                    var sql = "INSERT INTO users (login,pass,name,surname) VALUES ('" + login + "','" + pass + "','" + name + "','" + surname + "');";
                    db_pg.query(sql, (e, r) => {
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

}())



