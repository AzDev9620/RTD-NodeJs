// https://www.olx.uz/obyavlenie/yunusabad-5-svoya-2h-komnatnaya-kvartira-ID1OcrT.html

var fs = require('fs');
const utf8 = require('utf8');
var moment = require('moment-timezone');//http://momentjs.com/docs
var houses = (fs.readFileSync("houses.txt")).toString('utf8').split("\n");
var pages = [];
/*for (var i in houses) {
 //if (1 < i)break;
 var page = houses[i];
 //console.log(page)
 pages.push(page)
 }*/

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
    //db_pg.Users();
    //db_pg.Flat();
    //initdb_pg();

    var offset, pagess
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
        /*if (index == 2) {
         offset = val
         }
         if (index == 3) {
         pagess = val
         }*/
    });
    var sql = "select  elon, types, link, n, t  from  olx1 order by t " +
        ";";
    //console.log(sql);
    model_pg.query(sql, (e, r)=> {
        console.log("login..onlogin e.", e);
        console.log("login..onlogin r.", r);
        var rows = r.rows;


        rows.forEach(row => {

            var n = row.n;
            model_pg.query("select    n  from  olx  where n="+n , (e, r)=> {
                console.log("  e.", e);
                console.log("  r.", r.rows.length/*, r.rows*/);
                if(r.rows.length==0){
                    var sql = "insert into olx (elon, types, link, n, t)  values  " +
                        " (" +
                        "'" + JSON.stringify(row.elon) + "'::json" +
                        ",'" + JSON.stringify(row.types) + "'::json" +
                        ",'" + row.link + "'" +
                        "," + row.n +
                        "," + row.t +
                        ")" +
                        ";";
                    console.log(sql);

                    model_pg.query(sql, (e, r)=> {
                        console.log("  e.", e);
                        console.log("  r.", r);
                    });
                }


            });


        });

    });


});





