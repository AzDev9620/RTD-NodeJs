var Crawler = require("crawler");
var fs = require('fs');
const utf8 = require('utf8');
var moment = require('moment-timezone');//http://momentjs.com/docs
var escape = require('sql-escape');
// var getphone = require('./getphone.js');


//var result = escape('my sweet "string"'); // my sweet \\"string\\"

moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
var cities = JSON.parse(fs.readFileSync("cities.json"));
var houses = (fs.readFileSync("houses.txt")).toString('utf8').split("\n");
var starttime = +new Date();
var soni = houses.length
var incr = 0;
console.log()


var db_pg = require('./db_pg');

db_pg.connect(err => {
    console.log("...:", err)
    // console.log("db_pg.get()...:\n", db_pg.get())

    // var sql = "select 1;";
    var sql = "TRUNCATE olx1  RESTART IDENTITY CASCADE;";
    // var sql = "select * from olx limit 1;";
    db_pg.rawquery(sql, false, false, (e, r) => {
        // console.log("e.", e);
        // console.log("r.", r);
    });


});
// return


var c = new Crawler({
    //rateLimit: 10000,
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            //console.log(res.options.uri);


            var landmark = $(".offer-titlebox h1").text().trim().replace(/\'/g, "-");
            ;
            //console.log(landmark)
            var pre_pricestart = $("#offeractions .price-label strong").text().trim();
            var pricestart_arr = pre_pricestart.split(" ");
            var currency = pricestart_arr[pricestart_arr.length - 1];
            pricestart_arr[pricestart_arr.length - 1] = "";
            var pricestart = Number(pricestart_arr.join(""));
            //console.log(pricestart)

            var priceend = pricestart;
            //console.log(priceend)
            var adres = $(".offer-titlebox__details>.show-map-link>strong").text();
            //console.log(adres)
            var city = (adres.split(","))[0] != undefined ? (adres.split(","))[0].trim() : null;
            var region = (adres.split(","))[1] != undefined ? (adres.split(","))[1].trim() : null;
            var district = (adres.split(","))[2] != undefined ? (adres.split(","))[2].trim() : null;
            //console.log(city, region, district);

            var data_zoom = Number($("#mapcontainer").attr("data-zoom"));
            var data_lat = Number($("#mapcontainer").attr("data-lat"));
            var data_lon = Number($("#mapcontainer").attr("data-lon"));
            var data_rad = Number($("#mapcontainer").attr("data-rad"));
            //console.log(data_zoom);
            //console.log(data_lat);
            //console.log(data_lon);
            //console.log(data_rad);

            var pre_date = $(".offer-titlebox__details>em").text().split(",")[1];
            var date = pre_date != undefined ? datenorm(pre_date.trim()) : moment().format("YYYY.MM.DDTHH:mm");
            //console.log(date)
            var rooms = Number($("table.item th:contains('Количество комнат')").next("td").text().trim());
            //console.log(rooms)
            var floor = Number(($("table.item th:contains('Этаж')").next("td").text().trim().split("\n")[0]).trim());
            //console.log(floor)
            var storeys = Number($("table.item th:contains('Этажность дома')").next("td").text().trim());
            //console.log(storeys)

            var pre_role = $("table.item th:contains('Объявление от')").next("td").text().trim();
            var role = pre_role == "Агентства" ? "агентсвто" : pre_role == "Вторичный рынок" ? "вторичный рынок" : pre_role == "Частного лица" ? "частное лицо" : "";
            //console.log(role)
            var pre_sellername = $(".offer-user__details h4").text().trim();
            var sellername = pre_sellername.replace("'", " ").trim();
            //console.log(sellername)
            var pre_spoilerHidden = $("#textContent .spoilerHidden").attr("data-phone");
            var sellertel = pre_spoilerHidden != undefined ? $("#textContent .spoilerHidden").attr("data-phone").trim() : null;
            //console.log(sellertel)
            var area = Number(($("table.item th:contains('Общая площадь')").next("td").text().trim()).split(" ")[0]);
            //console.log(area)
            var area100 = Number(($("table.item th:contains('Площадь')").next("td").text().trim()).split(" ")[0]);
            //console.log(area100)

            var roomslayout = $("table.item th:contains('Планировка')").next("td").text().trim();
            //console.log(roomslayout)
            var material = $("table.item th:contains('Тип строения')").next("td").text().trim();
            //console.log(material)

            var ceilingheight = $("table.item th:contains('Высота потолков')").next("td").text().trim();
            //console.log(ceilingheight)
            var yearofconstruction = $("table.item th:contains('Год постройки')").next("td").text().trim();
            //console.log(yearofconstruction)
            var parking = $("table.item th:contains('Наличие парковки')").next("td").text().trim();
            //console.log(parking)

            var pre_ryadomyest = ($("table.item th:contains('Рядом есть')").next("td").find("a").text().trim()).split("\n");
            var infrastructure = [];
            pre_ryadomyest.forEach(el => {
                infrastructure.push(el.trim());
            });
            //console.log(infrastructure)

            var pre_communications = ($("table.item th:contains('Коммуникации')").next("td").find("a").text().trim()).split("\n");
            var communications = [];
            pre_communications.forEach(el => {
                communications.push(el.trim());
            });
            //console.log(communications)
            var pre_tipnedvij = ($("table.item th:contains('Тип недвижимости')").next("td").find("a").text().trim()).split("\n");
            var tipnedvij = [];
            pre_tipnedvij.forEach(el => {
                tipnedvij.push(el.trim());
            });
            //console.log(tipnedvij)
            var pre_vpomew = ($("table.item th:contains('В помещении есть')").next("td").find("a").text().trim()).split("\n");
            var vpomew = [];
            pre_vpomew.forEach(el => {
                vpomew.push(el.trim());
            });
            //console.log(vpomew)

            var pre_remarks = $("#textContent").text().trim();
            var remarks = pre_remarks.replace(/\'/g, "-");
            //console.log(remarks)
//--------------------------------------


            var tipjilya = $("table.item th:contains('Тип жилья')").next("td").text().trim();
            //console.log(tipjilya)
            var tipdoma = $("table.item th:contains('Тип дома')").next("td").text().trim();
            //console.log(tipdoma)
            var sanuzel = $("table.item th:contains('Санузел')").next("td").text().trim();
            //console.log(sanuzel)


            var livarea = Number(($("table.item th:contains('Жилая площадь')").next("td").text().trim()).split(" ")[0]);
            //console.log(livarea)
            var kitchenarea = Number(($("table.item th:contains('Площадь кухни')").next("td").text().trim()).split(" ")[0]);
            //console.log(kitchenarea)
            var polezarea = Number(($("table.item th:contains('Полезная площадь')").next("td").text().trim()).split(" ")[0]);
            //console.log(polezarea)
            var uchasarea = Number(($("table.item th:contains('Площадь участка')").next("td").text().trim()).split(" ")[0]);
            //console.log(uchasarea)


            var spalnihmest = Number($("table.item th:contains('Спальных мест')").next("td").text().trim());
            //console.log(spalnihmest)

            var pre_vkvartireyest = ($("table.item th:contains('В квартире есть')").next("td").find("a").text().trim()).split("\n");
            var vkvartireyest = [];
            pre_vkvartireyest.forEach(el => {
                vkvartireyest.push(el.trim());
            });
            //console.log(vkvartireyest)


            var mebelirovana = $("table.item th:contains('Меблирована')").next("td").text().trim();
            //console.log(mebelirovana)
            var remont = $("table.item th:contains('Ремонт')").next("td").text().trim();
            //console.log(remont)
            var komission = $("table.item th:contains('Комиссионные')").next("td").text().trim();
            //console.log(komission)
            var naznachenie = $("table.item th:contains('Назначение')").next("td").text().trim();
            //console.log(naznachenie)
            var raspolojenie = $("table.item th:contains('Расположение')").next("td").text().trim();
            //console.log(raspolojenie)

            var pre_no = $(".offer-titlebox__details>em>small").text().split(":")[1];
            var no = pre_no != undefined ? Number(pre_no.trim()) : 0
            //console.log("no....", no)

            var license = $("table.item th:contains('Номер лицензии')").next("td").text().trim();
            //console.log(license)
            var link = $("link[rel=canonical]").attr("href");
            //console.log("link.....", link)


            var pre_retype = $("#breadcrumbTop td.middle ul li:nth-child(3) a").text().trim();
            var retypes = ['Квартиры',
                'Дома',
                'Земля',
                'Гаражи / стоянки',
                'Коммерческие помещения'];
            var retype;
            retypes.forEach(re => {
                //console.log(re);
                if (pre_retype.match(re) != null) {
                    //var newstr = pre_retype.replace(re, "").trim()
                    //console.log(newstr);
                    //filtered2.push(newstr)
                    retype = re
                }
            })
            //console.log("retype.....", retype)


            var pre_dealtype = $("#breadcrumbTop td.middle ul li:nth-child(4) a").text();
            var dealtypes = [
                'Аренда',
                'Аренда долгосрочная',
                'Аренда посуточно',
                'Продажа',
                'Обмен'
            ];
            var dealtype;
            dealtypes.forEach(re => {
                //console.log(re);
                if (pre_dealtype.match(re) != null) {
                    //var newstr = pre_retype.replace(re, "").trim()
                    //console.log(newstr);
                    //filtered2.push(newstr)
                    dealtype = re
                }
            })
            //console.log("dealtype.....", dealtype)
            var pre_martkettype = $("#breadcrumbTop td.middle ul li:nth-child(5) a").text();
            var markettype
            dealtypes.forEach(re => {
                //console.log(re);
                if (pre_martkettype.match(re) != null) {
                    var newstr = pre_martkettype.replace(re, "").trim()
                    //console.log(newstr);
                    cities.forEach(c => {
                        if (newstr.match(c) != null) {
                            markettype = newstr.replace(c, "").trim();
                        }
                    })
                }
            })
            //console.log("markettype.....", markettype)
            var bigimage = $(".tcenter.img-item .bigImage");
            //console.log("bigimage.....", bigimage)
            var images = []
            Object.keys(bigimage).forEach(key => {
                if (bigimage[key].attribs != undefined) {
                    //console.log("bigimage.....", bigimage[key].attribs.src)
                    images.push(bigimage[key].attribs.src)
                }
            });
            //console.log("images.....", images)
            if (res.options.uri != undefined) {
                //sellertel = getphone.getPhone(res.options.uri)
            }


            var obj = {
                "maininfo": {
                    "date": date,
                    "address": {
                        "city": city,
                        "region": region,
                        "district": district,
                        "geolocation": {
                            lat: data_lat,
                            lon: data_lon,
                            acc: data_rad,
                            zoom: data_zoom
                        }
                    },
                    "rooms": [
                        rooms
                    ],
                    "floor": floor,
                    "storeys": storeys,
                    "ownerdatafull": [
                        {
                            "role": role,
                            "sellerdata": {
                                "sellername": sellername,
                                "sellertel": [
                                    sellertel
                                    //phone
                                ]
                            }
                        }
                    ],
                    "ownertel": [
                        //sellertel
                        null
                    ],
                    "area": area,
                    "area100": area100,
                    "propertytype": "квартира",
                    "pricestart": pricestart,
                    "priceend": priceend,
                    "currency": currency,
                    "material": material,
                    "roomslayout": roomslayout,
                    "yearofconstruction": yearofconstruction,
                    "ceilingheight": ceilingheight,
                    "infoorigin": "olx.uz",
                    "infrastructure": infrastructure,
                    "communications": communications,
                    "tipnedvij": tipnedvij,
                    "vpomew": vpomew,
                    "remarks": remarks,
                    "landmark": landmark,

                    "tipjilya": tipjilya,
                    "tipdoma": tipdoma,
                    "sanuzel": sanuzel,
                    "livarea": (livarea),
                    "kitchenarea": (kitchenarea),
                    "polezarea": (polezarea),
                    "uchasarea": (uchasarea),
                    "spalnihmest": (spalnihmest),
                    "vkvartireyest": vkvartireyest,
                    "mebelirovana": mebelirovana,
                    "remont": remont,
                    "komission": komission,
                    "naznachenie": naznachenie,
                    "raspolojenie": raspolojenie,
                    "parking": parking,


                    "license": license,
                    "no": no,


                    "link": link,
                    "retype": retype,
                    "dealtype": dealtype,
                    "markettype": markettype,

                    "images": images
                }
            };
            var types = {
                "retype": retype,
                "dealtype": dealtype,
                "markettype": markettype
            }

            //console.log(sellertel);
            var repl = function (str) {
                var str1 = str.replace("'", " ");
                return str1.replace('"', " ");
            };

            //var keys = Object.keys(obj);
            //console.log(obj);
            //for (var key in keys) {
            //    obj[key] = typeof obj[key] === "string" ? repl(obj[key]) : obj[key];
            //}

            if (sellertel != null) {
                fs.appendFileSync("sellertel.txt", sellertel + "\n");
            }
            //var t = 1
            //date1 = new Date(date);
            //console.log(date)

            var myDate = new Date(date.split("T")[0]);
            var t = myDate.getTime();

            if (t > 1583780400000)//1583107200000//1583262000000//1583348400000
            {
                return;

                let sql = "select n from olx where n=" + no
                db_pg.rawquery(sql, false, false, (e, r) => {
                    // console.log("e.", e);
                    // console.log("r.", r);
                    console.log("rowCount:", r.rowCount);
                    //console.log("eee...", e);

                    if (r.rowCount == 0) {
//console.log( t );
                        var sql = "INSERT INTO olx1 ( elon,types,link,n,t )"
                            + "VALUES (" +
                            "'" + JSON.stringify(obj) + "'::json" +
                            ",'" + JSON.stringify(types) + "'::json" +
                            ",'" + link + "'" +
                            "," + no + "" +
                            "," + t + "" +
                            ")  ;";//ON CONFLICT(n) DO NOTHING
                        //console.log(sql);
                        db_pg.rawquery(sql, false, false, (e, r) => {
                            //console.log("login..onlogin e.", e);
                            //console.log("login..onlogin r.", r);
                            //console.log("eee...", e);
                            incr++;
                            var now = +new Date();
                            var dif = Math.round((now - starttime) / 1000);
                            var min = Math.round(dif / 60)
                            var tezliksek = Math.round((incr / dif))
                            var tezlikmin = Math.round((incr / min))
                            console.log('dif:', dif, 'min:', min, 'h/s', tezliksek, 'h/m', tezlikmin)

                            if (e != undefined) {
                                fs.appendFileSync("pgerror.txt", JSON.stringify(e) + "\n");
                            }
                        });
                    }

                });

            }


        }
        done();
    }
});

var pages = [];
for (var i = 1; i < houses.length; i++) {
    //if (1 < i)break;
    var page = houses[i];
    //console.log(page)
    pages.push(page)
}


// Queue just one URL, with default callback
//c.queue('https://www.olx.uz/obyavlenie/yunusabad-5-svoya-2h-komnatnaya-kvartira-ID1OcrT.html');

// Queue a list of URLs
//c.queue(['http://www.google.com/','http://www.yahoo.com']);
c.queue(pages);


// Queue some HTML code directly without grabbing (mostly for tests)
//c.queue([{
//    html: '<p>This is a <strong>test</strong></p>'
//}]);

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