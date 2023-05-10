var moment = require('moment-timezone');//http://momentjs.com/docs
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
var server = require('./server.js')
var Functions = require('./Functions.js')
var Conf = require('./Conf.js')

var app = server.app
var db_pg = require('./db_pg');
module.exports = (function () {


    app.put('/buyer', function (req, res) {
        //console.log(req,res);
        //console.log(req.params);
        console.log(req.body);
        //console.log(JSON.parse(req.body.s));
        var s = req.body.s;
        var uid = req.body.uid;
        var id = req.body.id;
        //console.log(req.body )
        //fs.writeFileSync("flat3.json", s);

        var o = JSON.parse(s);
        var sql = "UPDATE buyer SET personaldata='" + JSON.stringify(o) + "'::json " +
            " ,uid=" + uid + "" +
            " WHERE id=" + id + " RETURNING id;";
        console.log(sql)
        db_pg.query(sql, (e, r) => {
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
        console.log(/*"sql2",*/ sql2);
        var tb = +new Date()
        db_pg.query(sql2, (e, r) => {
            console.log("e", e);
            console.log("r", r.rows);
            console.log("r", r.rows.length);
            var rslt = []
            r.rows.forEach(row => {
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
            db_pg.query(sql, (e, r) => {
                //console.log("e", e);
                //console.log("r", r);
                //console.log("id", r.rows[0].id);
                var sql = "SELECT " +
                    " elon    " +
                    " ,result    " +
                    " FROM wish " +
                    " WHERE id=" + id + " " +
                    ";";
                db_pg.query(sql, (e, r) => {
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
        //fs.writeFileSync("flat3.json", s);

        var o = JSON.parse(s);
        var sql = "update olx set elon='" + JSON.stringify(o) + "'::json  " +
            ",u=" + (+new Date()) +
            " where id=" + id + " RETURNING id;";
        //console.log(sql)
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            console.log("id", r.rows[0].id);
            res.send(r.rows[0]);
        });
    });
    app.put('/users', function (req, res) {
        let o = req.body;
        let sql = "update users set " +
            "name='" + o.name + "'" +
            ",surname='" + o.surname + "'" +
            ",login='" + o.login + "'" +
            ",pass='" + o.pass + "'" +
            ",rol=" + o.rol +
            ",address='" + o.address + "'" +
            ",country='" + o.country + "'" +
            ",city='" + o.city + "'" +
            ",email='" + o.email + "'" +
            ",telefon='" + o.telefon + "'" +
            " where id=" + o.id +
            " RETURNING id;";
        // console.log(sql)
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            res.send(r.rows[0]);
        });
    });


}())



