var Crawler = require("crawler");
var fs = require('fs');
const utf8 = require('utf8');
var moment = require('moment-timezone');//http://momentjs.com/docs
var escape = require('sql-escape');

//var result = escape('my sweet "string"'); // my sweet \\"string\\"

moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');

var houses = (fs.readFileSync("houses.txt")).toString('utf8').split("\n");
var starttime = +new Date();
var soni = houses.length
var incr = 0;
console.log()


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

    //var sql = "pg_dump -d rtd -t flat >/home/vx/WebstormProjects/smartsurveillance/rtd/file.sql";
    //var sql = 'sudo pg_dump --host localhost --port 5432 --username postgres --format plain --verbose --file "/home/vx/WebstormProjects/smartsurveillance/rtd/file.sql" --table public.olx rtd;';
    //db_pg.get().query(sql, (e, r)=> {
    //    console.log("e.", e);
    //    console.log("r.", r);
    //});

    var sql = "select " +
        "types ->> 'retype' as retype" +
            //",elon -> maininfo -> dealtype" +
            //",elon -> maininfo -> dealtypefine" +
        " from olx" +
        ";";
    db_pg.get().query(sql, (e, r)=> {
        //console.log("e.", e);
        //console.log("r.", r);
        const listOfTags = r.rows,
            keys = ['retype'],
            filtered = listOfTags.filter(
                (s => o =>
                    (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|')))
                (new Set)
            );
        //console.log(filtered);

        var retypes = ['Квартиры',
            'Дома',
            'Земля',
            'Гаражи / стоянки',
            'Коммерческие помещения'];

        var dealtypes = [
            'Аренда долгосрочная',
            'Аренда посуточно',
            'Продажа',
            'Обмен'
        ];


        /*var filtered2 = []
        for (var i in filtered) {
            var str = filtered[i].retype
            retypes.forEach(re=> {
                //console.log(re);
                if (str.match(re) != null) {
                    var newstr = str.replace(re, "").trim()
                    //console.log(newstr);
                    filtered2.push(newstr)
                }
            })
        }
        array_unique(filtered2)
        filtered2.sort()
        console.log(filtered2);
        fs.writeFileSync("cities.json", JSON.stringify(filtered2));*/


    });


    db_pg.get().query(
        "select " +
        " elon -> 'maininfo' -> 'address' ->> 'region' as region" +
            //",elon -> maininfo -> dealtypefine" +
        " from olx" +
        ";"

        , (e, r)=> {
            //console.log("e.", e);
            console.log("r.", r);
            const listOfTags = r.rows,
                keys = ['region'],
                filtered = listOfTags.filter(
                    (s => o =>
                        (k => !s.has(k) && s.add(k))
                        (keys.map(k => o[k]).join('|')))
                    (new Set)
                );
            console.log(filtered);


        });

});


function array_unique(array) {
// Removes duplicate values from an array
    //
    // +   original by: Carlos R. L. Rodrigues
    var p, i, j;
    for (i = array.length; i;) {
        for (p = --i; p > 0;) {
            if (array[i] === array[--p]) {
                for (j = p; --p && array[i] === array[p];);
                i -= array.splice(p + 1, j - p).length;
            }
        }
    }
    return true;
}

function array_unique_objects(newarray) {
    var dups = [];
    var arr = newarray.filter(function (el) {
        // If it is not a duplicate, return true
        if (dups.indexOf(el.ID) == -1) {
            dups.push(el.ID);
            return true;
        }
        return false;
    });
    return arr;
}

// /home/vx/.ssh/id_rsa

//  sudo pg_dump --host localhost --port 5432 --username postgres --format plain --verbose --file "/home/vx/WebstormProjects/smartsurveillance/rtd/olx.sql" --table public.olx rtd;

//  sudo pg_dump --host localhost --port 5432 --username postgres --format plain --verbose --file "/home/vx/WebstormProjects/smartsurveillance/rtd/olx1.sql" --table public.olx1 rtd;

//  sudo pg_dump --host localhost --port 5432 --username postgres --format plain --verbose --file "/home/rtd/olx.sql" --table public.olx rtd;

//  psql rtd < /home/vx/WebstormProjects/smartsurveillance/rtd/olx.sql
//  psql rtd < /home/vx/WebstormProjects/smartsurveillance/rtd/olx07032020_0620.sql


//  psql rtd < /home/rtd/olx.sql
//  psql rtd < /home/rtd/olx1.sql


//vx@vx-pc:~/WebstormProjects/smartsurveillance/rtd$ sudo pg_dump --host localhost --port 5432 --username postgres --format plain --verbose --file "/home/vx/WebstormProjects/smartsurveillance/rtd/file.sql" --table public.olx rtd
//Пароль:
//    pg_dump: последний системный OID: 16383
//pg_dump: чтение расширений
//pg_dump: выявление членов расширений
//pg_dump: чтение схем
//pg_dump: чтение пользовательских таблиц
//pg_dump: чтение пользовательских функций
//pg_dump: чтение пользовательских типов
//pg_dump: чтение процедурных языков
//pg_dump: чтение пользовательских агрегатных функций
//pg_dump: чтение пользовательских операторов
//pg_dump: чтение пользовательских методов доступа
//pg_dump: чтение пользовательских классов операторов
//pg_dump: чтение пользовательских семейств операторов
//pg_dump: чтение пользовательских анализаторов текстового поиска
//pg_dump: чтение пользовательских шаблонов текстового поиска
//pg_dump: чтение пользовательских словарей текстового поиска
//pg_dump: чтение пользовательских конфигураций текстового поиска
//pg_dump: чтение пользовательских оболочек сторонних данных
//pg_dump: чтение пользовательских сторонних серверов
//pg_dump: чтение прав по умолчанию
//pg_dump: чтение пользовательских правил сортировки
//pg_dump: чтение пользовательских преобразований
//pg_dump: чтение приведений типов
//pg_dump: чтение преобразований
//pg_dump: чтение информации о наследовании таблиц
//pg_dump: чтение событийных триггеров
//pg_dump: поиск таблиц расширений
//pg_dump: поиск связей наследования
//pg_dump: чтение информации о столбцах интересующих таблиц
//pg_dump: поиск столбцов и типов таблицы "public.olx"
//pg_dump: поиск выражений по умолчанию для таблицы "public.olx"
//pg_dump: пометка наследованных столбцов в подтаблицах
//pg_dump: чтение индексов
//pg_dump: пометка индексов в секционированных таблицах
//pg_dump: чтение расширенной статистики
//pg_dump: чтение ограничений
//pg_dump: чтение триггеров
//pg_dump: чтение правил перезаписи
//pg_dump: чтение политик
//pg_dump: чтение информации о защите строк для таблицы "public.olx_id_seq"
//pg_dump: чтение политик таблицы "public.olx_id_seq"
//pg_dump: чтение информации о защите строк для таблицы "public.olx"
//pg_dump: чтение политик таблицы "public.olx"
//pg_dump: чтение публикаций
//pg_dump: чтение участников публикаций
//pg_dump: чтение подписок
//pg_dump: чтение информации о зависимостях
//pg_dump: сохранение кодировки (UTF8)
//pg_dump: сохранение standard_conforming_strings (on)
//pg_dump: сохранение search_path ()
//pg_dump: создаётся TABLE "public.olx"
//pg_dump: создаётся SEQUENCE "public.olx_id_seq"
//pg_dump: создаётся SEQUENCE OWNED BY "public.olx_id_seq"
//pg_dump: создаётся DEFAULT "public.olx id"
//pg_dump: обрабатываются данные таблицы "public.olx"
//pg_dump: выгрузка содержимого таблицы "public.olx"
//pg_dump: выполняется SEQUENCE SET olx_id_seq
//vx@vx-pc:~/WebstormProjects/smartsurveillance/rtd$


//select elon -> 'maininfo' -> 'images' as im , images from olx where id=100;
update olx set images = subquery.ims
from
(select   elon -> 'maininfo' -> 'images' ims   from olx  ) subquery


update olx set images = subquery.ims
from
(select  id, elon -> 'maininfo' -> 'images' ims   from olx  ) subquery

where subquery.id between 1 and 100


update olx set images = subquery.ims
from
(select  id, elon -> 'maininfo' -> 'images' ims   from olx  ) subquery

where  olx.id = subquery.id

and olx.id in(select  id from olx order by id asc limit 20 )



select elon->'maininfo'->'images'->0 ,
    images
from olx
order by id
limit 50


function datenorm(date) {

    var day = date.split(" ")[0];
    var month = date.split(" ")[1];
    var year = date.split(" ")[2];

    var ddate = new Date(
        year, monthtonum(month), day
    );
    var norm = moment(ddate).format("YYYY.MM.DDTHH:mm");
    return norm;
}
function monthtonum(month) {
    var mo = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    for (var i in mo) {
        var parser = mo[i];
        var match = month.match(parser);
        if (match != null) {
            return i;
        }
    }
};