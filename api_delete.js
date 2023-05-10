var moment = require('moment-timezone');//http://momentjs.com/docs
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
var server = require('./server.js')
var Functions = require('./Functions.js')
var Conf = require('./Conf.js')

var app = server.app
var db_pg = require('./db_pg');
module.exports= (function(){

    app.delete('/delwish/:buyerid', function (req, res) {
        const table = req.params.table;
        const buyerid = req.params.buyerid;

        const sql = `DELETE FROM wish WHERE buyerid=${buyerid}`
        console.log(sql)
        db_pg.query(sql, (e, r)=> {
            console.log("e", e);
            console.log("r", r);
            //console.log("id", r.rows[0].id);
            const st = e === undefined ? 200 : 500;
            res.sendStatus(st);
        });

    });



//=============
    app.delete('/:table/:id', function (req, res) {
        const table = req.params.table;
        const id = req.params.id;

        const sql = `DELETE FROM ${table} WHERE id=${id}`;

        console.log(sql)
        db_pg.query(sql, (e, r)=> {
            console.log("e", e);
            console.log("r", r);
            //console.log("id", r.rows[0].id);
            const st = e === undefined ? 200 : 500;
            res.sendStatus(st);
        });

    });




} () )



