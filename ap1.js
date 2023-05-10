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

const Nightmare = require('nightmare');
const nightmare = Nightmare({
    //show: true,
    executeTimeout: 2000,
    loadTimeout: 2000,
    gotoTimeout: 2000,
    waitTimeout: 100
})

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
        if (index == 2) {
            offset = val
        }
        if (index == 3) {
            pagess = val
        }
    });


    //var sql = "select  " +
    //    " id, link " +
    //    " from olx1 " +
    //    " order by id asc " +
    //    ";";
    var sql = "select   id,link  from olx1  where elon->'maininfo'->>'ownertel' ~ 'null'  order by id asc  " +
        "  OFFSET " + offset +
        "  LIMIT " + pagess + ";";
    //var sql = "select   id,link,  elon->'maininfo'->'ownertel' tel ,  elon->'maininfo'->'ownerdatafull'->0->'role' rol  from olx1  where elon->'maininfo'->'ownertel' = '[null]' and  elon->'maininfo'->'ownerdatafull'->0->>'role' = 'частное лицо'  order by id asc ;";
    //var sql = "select   id,link, elon->'maininfo'->'ownertel' as ownertel  from olx1  where elon->'maininfo'->'ownertel' = '[null]'  order by id asc ;";
    console.log(sql);
    model_pg.query(sql, (e, r)=> {
        console.log("login..onlogin e.", e);
        //console.log("login..onlogin r.", r);

        var rows = r.rows;
        rows.forEach(row => {
            pages.push(row)
        });

        //console.log(pages);
        console.log('pages.length', pages.length);
        gett(pages[0])

    });


});


const selector = '#contact_methods_below strong';
var document1, i = 0, tb = +new Date();
//gett(pages[0])
function gett(obj) {

    //console.log('obj....',obj);
    //console.log('obj.link....',obj.link);
    nightmare
        .goto(obj.link)

        //.type('#search_form_input_homepage', 'github nightmare')
        .click(selector/*'#contact_methodsBigImage .spoiler2 span'*/)
        //.wait('#contact_methodsBigImage strong')

        .cookies.clearAll()
        .evaluate((selector, done)  => {
            // now we're executing inside the browser scope.
            setTimeout(
                () => done(
                    null, document.querySelector(selector).innerText
                ),
                1000
            )

        }, selector)
        //.end()
        .then(text => {
            //i++;
            console.log(i, +new Date() - tb, obj)
            tb = +new Date()
            //console.log(text)
            //console.log('then->pages[i].link...', "i=" + i, pages[i].link, "tel=" + text)
            console.log('then->pages[i].link...', "i=" + i, "text:: " + text)
            gett(pages[i])

            //console.log(text)
            //var re = /(глава \d+(\.\d)*)/i;
            var re = /x/i;
            //text = '=+998 97 567 53 35'
            var found = text.match(re);
            console.log('found....', found)

            var sql = found == null
                ? "UPDATE olx1 SET elon = jsonb_set(\"elon\", '{\"maininfo\", \"ownertel\"}', \'[\"" + text.replace(/[\+]/g, "").trim().replace(/[\n\r]/g, " ") + "\"]\'::jsonb )  WHERE link='" + obj.link + "' RETURNING id ;"
                : "select 1;"

            console.log(sql)
            model_pg.query(sql, (e, r)=> {
                //console.log("e", e);
                //console.log("r", r);
                console.log("id....", r.rows[0].id);
                console.log("\n=================================================\n\n")

            });


            //resolve(text)

            /*if (i<10) */
        })
        .catch(error => {
            console.error('Search failed:', error )
            console.error('error.code:', error.code)
            console.log(i, +new Date() - tb, obj)

            if(error.code=="-1" ||error.code=="-300"   ){
                var sql = "delete from olx1 where id =" + obj.id + ";"

                 console.log(sql)
                 model_pg.query(sql, (e, r)=> {
                 //console.log("e", e);
                 //console.log("r", r);
                 //console.log("id....", r.rows[0].id);
                 console.log("\n=================================================\n\n")
                 });
            }


            gett(pages[i])

        });
    i++;

}


//getPhone ('https://www.olx.uz/obyavlenie/yunusabad-5-svoya-2h-komnatnaya-kvartira-ID1OcrT.html')
async function getPhone(page) {
    const nightmare = Nightmare({
        show: true,
        //executeTimeout: 10000,
        //loadTimeout: 10000,
        //gotoTimeout: 10000,
        //waitTimeout: 10000
    })
    try {
        await
            nightmare
                .goto(page)
                //.type('#search_form_input_homepage', 'github nightmare')
                .click('#contact_methodsBigImage .spoiler span')
                //.wait('#contact_methodsBigImage strong')


                /*.evaluate((selector, done)  => {
                 // now we're executing inside the browser scope.
                 setTimeout(
                 () => done(null, document.querySelector(selector).innerText),
                 2000
                 )
                 }, selector)*/
                .evaluate((selector) => (
                    new Promise((resolve, reject) => {
                        setTimeout(() => resolve(document.querySelector(selector).innerText), 2000);
                    }), selector)
            )
                //.end()
                .then(text => {
                    console.log(text)
                })
                .catch(error => {
                    console.error('Search failed:', error)
                });
    } catch (e) {
        console.error(e);
    }

}

function sleep(ms) {
    return new Promise(resolve=> {
        setTimeout(resolve, ms)
    })
}


/*var p;
 //sleep(2000)
 if(i>10)break

 //p= new Promise((resolve,reject)=>{
 const nightmare = Nightmare({
 //show: true,
 })
 nightmare
 .goto(page)
 //.type('#search_form_input_homepage', 'github nightmare')
 .click('#contact_methodsBigImage .spoiler span')
 //.wait('#contact_methodsBigImage strong')

 .evaluate((selector, done)  => {
 // now we're executing inside the browser scope.
 setTimeout(
 () => done(null, document.querySelector(selector).innerText),
 2000
 )
 }, selector)
 .end()
 .then(text => {
 console.log(text)
 //resolve(text)
 })
 .catch(error => {
 console.error('Search failed:', error)
 });

 //resolve(i)
 //})
 //p.then(res=>{
 //    console.log(res)
 //})*/



