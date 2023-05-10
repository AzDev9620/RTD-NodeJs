var fs = require('fs');
const utf8 = require('utf8');
var moment = require('moment-timezone');//http://momentjs.com/docs
const download = require('image-downloader')

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
var j = 0,
    imar = [],
    chala = 0;
var tb = +new Date()
var dir = "images4"


var dirarr = fs.readdirSync(dir)

console.log('td', +new Date() - tb);

db_pg.connect(config_pg, err=> {
    model_pg = require('./models/model_pg.js');


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

    var sql = "select  elon->'maininfo'->'images' as im  from  olx1  order by t " +
        "  OFFSET " + offset +
        "  LIMIT " + pagess +
        ";";
    //console.log(sql);
    model_pg.query(sql, (e, r)=> {
        //console.log("login..onlogin e.", e);
        //console.log("login..onlogin r.", r);
        var rows = r.rows;

        /*rows.forEach(row=> {
         if (row.im != null) {
         row.im.forEach(url=> {
         downloadIMG(url)
         });
         }

         });*/

        for (var i in rows) {
            var row = rows[i]
            if (row.im != null) {
                var ims = row.im;
                for (var ii in ims) {
                    imar.push(ims[ii])
                }
            }
        }
        console.log(rows.length, imar.length);

        downloadIMG(imar[0])


    });
});

function dircount() {
    return fs.readdirSync(dir).length
}

function ress(url) {
    if (url == undefined)return 0;
    var nmar = url.split("/")
    var fname = nmar[nmar.length - 1]
    //console.log(fname)
    //var dirarr = fs.readdirSync(dir)
    var res = dirarr.indexOf(fname);
    //console.log('res', res)
    //chala = res==-1?0:1;
    return res
}
function getfname(url) {
    var nmar = url.split("/")
    var fname = nmar[nmar.length - 1]
    //console.log(fname)
    return fname
}
//async
function downloadIMG(url) {
    //console.log('j > imar.length',j > imar.length)
    if (j > imar.length) {
        j = 0;
        chala = 0;
        dirarr = fs.readdirSync(dir)
        //imar.forEach(l=> {
        //    //console.log(getfname(l))
        //    var f = getfname(l)
        //    chala += dirarr.indexOf(f) > -1 ? 0 : 1
        //    console.log("chala", chala, f)
        //})

        for(var i in imar){
            var l=imar[i]
            var f = getfname(l)
            chala += dirarr.indexOf(f) > -1 ? 0 : 1
            console.log( (chala > 0) )
            console.log("chala",  chala, f)

            if (chala > 0) {

                break;
                downloadIMG(imar[0])
            }
        }
        if (chala == 0)  {
            process.exit();
            return;
        }



    }
    console.log('j', imar.length, j, chala)
    if (/*res*/ ress(url) == -1) {
        const options = {
            url: url,
            dest: dir
        }
        //await
        download.image(options)
            .then(({ filename, image }) => {
                console.log(j, chala)
                console.log('Saved to', filename)

                downloadIMG(imar[j])


            })
            .catch((err) => {
                console.error(err)
                downloadIMG(imar[j])
            })

    } else {
        //chala++;

        downloadIMG(imar[j++])
    }
    j++;
    //sleep(2000)
}

function sleep(ms) {
    return new Promise(resolve=> {
        setTimeout(resolve, ms)
    })
}

//downloadIMG("https://static.olx.uz/img-olxuz/29181712_2_644x461_sdayotsya-v-arendu-skladskoe-pomeshhenie-fotosuratlar_rev020.jpg")
