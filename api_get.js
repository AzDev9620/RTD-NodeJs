var fs = require('fs');
var moment = require('moment-timezone');//http://momentjs.com/docs
moment.tz.setDefault("Asia/Tashkent");
moment.locale('ru');
var server = require('./server.js')
var Functions = require('./Functions.js')
var Conf = require('./Conf.js')

var app = server.app
const hostip = Conf.hostip
const port = Conf.ports;
const rtdimagesurl = Conf.rtdimagesurl;
var db_pg = require('./db_pg');

module.exports = (function () {

    app.get('/isurlreachable', function (req, res) {
//    var route = req.params.route;
//         console.log(req.params,req.query, req.body );
        res.sendStatus(200)
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
        console.log('-------------------------');

        const u = req.session.userdata
        // console.log(u);
        // console.log('cookie```', req.headers.cookie);
        // let sock = req.headers.cookie.split(';')[1].split('=')[1];
        // let io = req.app.io;
        // let sockets = io.sockets.sockets;
        // let keys = Object.keys(sockets);
        // console.log('keys```', keys);
        // console.log( sockets);
        // console.log('sock```', sock);

        const id = Number(req.params.id)
            , uid = u.id
            , rol = u.rol
        const whereclause = rol === 4 ? ` WHERE uid=${uid} ` : ``

        const sql = `SELECT elon, images FROM olx
         WHERE id=${id}
--           order by link asc 
         LIMIT 1;
         SELECT  hudud FROM hudud ${whereclause} LIMIT 1;`;
        console.log("sql", sql);
        db_pg.query(sql, (e, r) => {
            // console.log("e", e);
            console.log("r", r);
            const flat = r[0].rows[0];
            // console.log("flat...", flat);
            const hududrows = r[1].rows;
            const hudud = hududrows.length > 0 ? hududrows[0].hudud : [];
            // console.log("hudud...", hudud);
            let elon = {}, d;
            if (r[0].rowCount > 0) {
                let temp = flat.elon;
                // console.log("temp...", temp);

                let section = temp.maininfo.address.section !== undefined ? temp.maininfo.address.section : undefined;
                d = hudud.find(item => item === section)
                // console.log("section...", section, d);

                if (rol !== 1 && d === undefined) {
                    temp.maininfo.address.house = "";
                    temp.maininfo.address.porch = "";
                    temp.maininfo.address.doorcode = "";
                    temp.maininfo.address.apartment = "";
                    temp.maininfo.ownerdatafull = [];
                    temp.maininfo.ownertel = [];
                }
                elon = temp
            }
            const pre_images = r[0].rowCount > 0 && flat.images !== null ? flat.images : [];
            let images = [];
            if (pre_images !== undefined) {
                pre_images.forEach(url => {
                    //images.push(getfname(url));
                    images.push(
                        Functions.getfname(url)
                    );
                });
            }
            if (id !== 0) {
                elon.maininfo.images = images
            }

            // var access = rol == 1 ? true : d === undefined ? false : true;
            const access = rol === 1 || rol === 4
                ? true : d !== undefined

            const json = {
                elon,
                url: rtdimagesurl,
                access
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
            " elon ,images   " +
            " FROM olx " +
            " WHERE id=" + id + " " +
            //" order by link asc " +
            ";";
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            console.log("rows...", rows);
            var elon = rows.length > 0 ? rows[0].elon : {};
            var pre_images = rows.length > 0 ? rows[0].images : [];
            var images = []
            if (pre_images != undefined) {
                pre_images.forEach(url => {
                    images.push(Functions.getfname(url));
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

    app.get('/buyersearch/:uid/:rol/:id', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        var p = req.params;
        console.log(req.params);
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````', userdata);

        var id = p.id
            , uid = p.uid
            , rol = p.rol;
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````',userdata);
        // var id = req.params.id;

        var sql = "SELECT " +
            " w.id    " +
            " ,w.elon    " +
            " ,w.result " +
            " ,w.buyerid " +
            " ,b.uid " +
            " FROM wish w " +
            " LEFT JOIN buyer b ON b.id=w.buyerid " +
            " WHERE w.id=" + id + " " +
            ";";
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            var rows = r.rows;
            console.log("rows...", rows.length);
            let row = rows[0]
            let access = true;
            if (r.rowCount > 0 && id != 0 && uid != row.uid) {

                if (rol === 1 || rol === 6) {
                    access = true;
                } else {
                    // row.personaldata.maininfo.customertel = [];
                    access = false;
                }
            }
            if (r.rowCount > 0 && rol != 1 && uid != row.uid) {
                // access = false;
            }
            var json = {
                data: rows.length > 0 ? row : {},
                access: access
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
        db_pg.query(sql, (e, r) => {
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
        const u = req.session.userdata

        // var p = req.params;
        // console.log(req.params);
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````', userdata);

        const id = Number(req.params.id)
            , uid = req.session.userdata.id
            , rol = req.session.userdata.rol;


        const sql =
            `SELECT personaldata,uid FROM buyer  WHERE id=${id};
SELECT id,elon AS wish,result FROM wish WHERE buyerid=${id} ORDER BY id;
SELECT id,name,surname FROM users WHERE rol=4 ORDER BY id;`


        // var sql = "SELECT " +
        //     " personaldata    " +
        //     " ,uid    " +
        //     " FROM buyer " +
        //     " WHERE id=" + id + " " +
        //     // uid_clause +
        //     " ;" +
        //     "SELECT id" +
        //     ",elon AS wish " +
        //     " ,result " +
        //     "FROM wish " +
        //     " WHERE buyerid=" + id + " order by id" +
        //     ";" +
        //     " SELECT id, name, surname FROM users WHERE rol=4 ORDER BY id ASC;";


        console.log(sql)
        db_pg.query(sql, (e, r) => {
            console.log("e", e)
            console.log("r", r)
            let buyer = id !== 0 ? r[0].rows[0] : {}
            const wishes = r[1].rows.length > 0 ? r[1].rows : []
            let rieltors = (rol === 1 || rol === 6) ? r[2].rows : []
            // console.log("buyer[0]...", buyer)
            let access = true
            if (id !== 0 && uid !== buyer.uid) {
                if (rol === 1 || rol === 6) {
                    access = true
                } else {
                    buyer.personaldata.maininfo.customertel = []
                    access = false//false edi
                }
            }

            const json = {
                buyer,
                wishes,
                access,
                rieltors,
                uid,
                rol
            }
            // console.log("buyerprofile.json..", JSON.stringify(json)  );
            res.send(json)
        });
    });

    app.get('/buyerlistfull/:id', function (req, res) {///:offset/:pages

        //console.log(req,res);
        // console.log(req.params);
        const id = Number(req.params.id)

        const whereclause = id !== 0 ? `WHERE uid=${id} ` : ` `;
        const sql = `SELECT b.id ,b.uid 
,personaldata -> 'maininfo' -> 'customerdata' as customerdata 
,personaldata -> 'maininfo' -> 'customertel' as customertel 
,personaldata -> 'customerpersonalinformation' ->> 'remark' as remark 
,u.name, u.surname FROM buyer b 
left join users u ON u.id=b.uid 
${whereclause} 
ORDER BY b.id ASC`

        // "SELECT " +
        // "b.id " +
        // ",b.uid " +
        // ",personaldata -> 'maininfo' -> 'customerdata' as customerdata  " +
        // ",personaldata -> 'maininfo' -> 'customertel' as customertel" +
        // ",personaldata -> 'customerpersonalinformation' ->> 'remark' as remark" +
        // " , u.name, u.surname  " +
        // "  FROM buyer b " +
        // " left join users u ON u.id=b.uid " +
        // whereclause +
        // " ORDER BY b.id ASC "
        /* +
         "  OFFSET " + offset +
         "  LIMIT " + pages + ";";*/
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            const rows = r.rows;
            // console.log("rows", rows);
            // const ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            const json = {
                data: rows,
                // next_page_url: 'https://' + hostip + ':' + port + '/buyerlistfull/' + p.id // + ofs.id + '/' + pages
                next_page_url: `https://${hostip}:${port}/buyerlistfull/${id}`
            };
            res.send(json);
        });
    });

    app.get('/rieltorlistfull', function (req, res) {///:offset/:pages

        //console.log(req,res);
        //console.log(req.params);
        const pages = req.params.pages;
        const offset = req.params.offset;
        const sql =
            `SELECT u.id, u.name, u.surname, (COUNT(b.id)::int) c  FROM users u  
LEFT JOIN buyer b ON b.uid=u.id
WHERE rol=4  GROUP BY u.id  ORDER BY name ASC
-- OFFSET ${offset} LIMIT ${pages}`;
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            var rows = r.rows;
            console.log("rows", rows);
            var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var json = {
                users: rows,
                userdata: req.session.userdata,
                rol: req.session.userdata.rol,
                next_page_url: 'https://' + hostip + ':' + port + '/rieltorlistfull' // + ofs.id + '/' + pages
            }
            res.send(json);
        });
    });

    app.get('/list/landmark/:offset/:pages', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        const uid = req.session.userdata.id
        const pages = req.params.pages;
        const offset = req.params.offset;
        const sql = `SELECT 
 id    
 ,link    
 ,elon 
 ,elon->'maininfo'->>'importance' AS importance  
 ,(elon->'maininfo'->'address' -> 'section') AS section 
 ,CASE WHEN elon->'maininfo'->'address' -> 'section' <@ hudud THEN elon->'maininfo'->'ownertel'  ELSE  null  end AS ownertel 
 , h.hudud 
 FROM olx o  
 LEFT OUTER  JOIN hudud h ON h.uid=${uid}
 AND   elon->'maininfo'->'address' -> 'section' <@ hudud
 ORDER BY importance, t ASC   
 OFFSET ${offset} LIMIT ${pages}`
        console.log(sql)
        let tb = +new Date()
        db_pg.query(sql, (e, r) => {
            console.log('dur.....1', (+new Date()) - tb);
            console.log("e", e);
            // console.log("r", r);
            let rows = r.rows;
            // console.log("rows", rows);
            if (rows.length === 0) return
            let ofs = rows[rows.length - 1]
            console.log("ofs....", ofs.id)
            let flats = []
            for (let r of rows) {
                let mi = r.elon.maininfo;
                // var section = r.elon.maininfo.address != undefined
                //     ? r.elon.maininfo.address.section != undefined
                //         ? r.elon.maininfo.address.section : 0 : 0;
                flats.push({
                    id: r.id,
                    landmark: mi.landmark,
                    tel: r.ownertel !== null ? r.ownertel : null,
                    link: r.link,
                    msgstatus: mi.msgstatus,
                    section: r.section,
                    hudud: r.hudud
                })
                // console.log('dur.....2', (+new Date())-tb);
            }


            console.log('dur.....2', (+new Date()) - tb);

            let json = {
                flats,
                next_page_url: `https://${hostip}:${port}/list/landmark/${ofs.id}/${pages}`
            };
            res.send(json);
        });
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
        db_pg.query(sql, (e, r) => {
            console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            console.log("rows", rows);
            console.log("length", rows.length);
            var ofs = rows[rows.length - 1]
            if (ofs == undefined) {
                res.sendStatus(200);
                return
            }
            console.log("ofs....", ofs.id)
            var rw = []

            //
            rows.forEach(r => {
                let mi = r.elon.maininfo;
                //i++;
                let lm =
                    //i + ". " +
                    (mi.address !== undefined && mi.address.district !== undefined ? mi.address.district : '~') + " " +
                    (mi.rooms !== undefined ? mi.rooms : '~') + "/" +
                    (mi.floor !== undefined ? mi.floor : '~') + "/" +
                    (mi.storeys !== undefined ? mi.storeys : '~') + " " +
                    //"цена: с " + (mi.pricestart != undefined ? mi.pricestart : '~') + " " +
                    //"до " + (mi.priceend != undefined ? mi.priceend : '~') + " | " +
                    "цена: " + (mi.pricestart !== undefined ? mi.pricestart : '~') + " | " +
                    server.eachRecursive2(mi);
                //(mi.landmark != undefined ? mi.landmark : '~') + " | " +
                //mi.landmark + " :: " + mi.remarks
                ;
                //console.log("ofs....", )
                ;
                rw.push({
                    id: r.id,
                    //remarks: r.elon.maininfo.landmark,
                    landmark: lm,
                    tel: mi.ownertel !== undefined ? mi.ownertel[0] : "",
                    link: r.link,
                    msgstatus: mi.msgstatus
                })
                //console.log('dur.....', (+new Date())-tb);
            })
            rows = rw
            console.log('dur.....', (+new Date()) - tb);

            var json = {
                data: rows,
                next_page_url: 'https://' + hostip + ':' + port + '/textsearch/' + text + '/' + ofs.id + '/' + pages
            };

            // console.log('json``````',json)

            res.send(json);
        });
        //console.log(json)

    });

    app.get('/wishresultlist/:uid/:id/:pages', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        var p = req.params;
        console.log(req.params);
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````', userdata);

        var uid = p.uid;

        //var pages = req.params.pages;
        //var offset = req.params.offset;
        // var userdata = server.userdata(req);
        // console.log('userdata````', userdata);
        var id = req.params.id;
        var sql = "SELECT\n" +
            "  o.id\n" +
            "   ,o.elon\n" +
            "   ,o.images\n" +
            "   ,o.link\n" +
            "   ,o.t\n" +
            "   ,o.u\n" +
            "   ,o.elon->'maininfo'->>'importance' AS importance\n" +
            "   ,o.elon->'maininfo'->'address'->'section' AS section\n" +
            "   ,CASE WHEN elon->'maininfo'->'address'->'section' <@ hudud THEN elon->'maininfo'->'ownertel'  ELSE  NULL  END AS ownertel\n" +
            " FROM olx o\n" +
            "   ,(SELECT result FROM wish w1 WHERE w1.id=" + id + ") w\n" +
            " LEFT OUTER  JOIN hudud h ON h.uid=" + uid + "\n" +
            "--AND   o.elon->'maininfo'->'address' -> 'section' <@ hudud\n" +
            "  WHERE  ( o.id::text)::jsonb <@ w.result\n" +
            "  ORDER BY o.id ASC;";
        var tb = +new Date()
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            console.log("e", e);
            //console.log("r", r);
            //console.log("r0", r.rows);
            var rows = r.rows;
            //var resname = r[1].rows[0].elon.maininfo;
            // console.log("rows", rows);
            //var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var rw = [], i = 0;
            rows.forEach(r => {
                var mi = r.elon.maininfo;
                //var images = ;
                mi['images'] = r.images;
                //console.log("mi['images']", mi['images']);
                i++;
                var lm = i + ". " +
                    (mi.address.district != undefined ? mi.address.district : '~') + " " +
                    (mi.rooms != undefined ? mi.rooms : '~') + "/" +
                    (mi.floor != undefined ? mi.floor : '~') + "/" +
                    (mi.storeys != undefined ? mi.storeys : '~') + " " +
                    //"цена: с " + (mi.pricestart != undefined ? mi.pricestart : '~') + " " +
                    //"до " + (mi.priceend != undefined ? mi.priceend : '~') + " | " +
                    "цена: " + (mi.pricestart != undefined ? mi.pricestart : '~') + " | " +
                    (mi.landmark != undefined ? mi.landmark : '~');
                rw.push({
                    id: r.id,
                    landmark: lm,
                    // tel: mi.ownertel[0] != undefined ? mi.ownertel[0] : "",
                    tel: r.ownertel != null ? r.ownertel : null,
                    link: r.link,
                    t: moment(Number(r.t)).format("DD.MM"),
                    u: r.u != null
                        ? moment(Number(r.u)).format("DD.MM HH:mm")
                        : "~"/*moment(Number(r.t)).format("DD.MM")*/,
                    msgstatus: mi.msgstatus,
                    im: mi.images != undefined ? mi.images.length : 0

                })
                //console.log('dur.....', (+new Date())-tb);
            })
            // rows = rw
            console.log('dur.....', (+new Date()) - tb);

            var json = {
                data: rw
                //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
            }
            res.send(json);
        });


    });

    app.get('/wishresultlistext/:id/:pages', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        //var pages = req.params.pages;
        //var offset = req.params.offset;
        var id = req.params.id;

        db_pg.query("(SELECT  replace(replace(result::text,'[','' ),']','') as ids  from wish where id=" + id + ") ", (e, r) => {
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
                ",images    " +
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
            db_pg.query(sql, (e, r) => {
                console.log("e", e);
                //console.log("r", r);
                console.log("r0", r.rows);
                var rows = r.rows;
                //var resname = r[1].rows[0].elon.maininfo;
                //console.log("rows", rows);
                //var ofs = rows[rows.length - 1]
                //console.log("ofs....", ofs.id)
                var rw = [], i = 0;
                rows.forEach(r => {
                    var mi = r.elon.maininfo;
                    mi['images'] = r.images;
                    i++;
                    var lm = i + ". " +
                        (mi.address.district != undefined ? mi.address.district : '~') + " " +
                        (mi.rooms != undefined ? mi.rooms : '~') + "/" +
                        (mi.floor != undefined ? mi.floor : '~') + "/" +
                        (mi.storeys != undefined ? mi.storeys : '~') + " " +
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


                var json = {
                    data: rows
                    //,next_page_url: 'https://' + adr + ':'+port+'/list/landmark/' + ofs.id + '/' + pages
                }
                res.send(json);
            });


        })


    });

    app.get('/hudud/list', (req, res) => {
        console.log(req.params);

        var sql = "SELECT u.* " +
            // ",  h.hudud   " +
            ", coalesce ( h.hudud , null, '[]' ) as hudud  " +
            " FROM users u    full join   hudud h on  u.id=h.uid " +
            // " where u.rol=4 and u.rol=1 " +
            " ORDER BY u.id" +
            "";
        console.log(sql);

        db_pg.query(sql, (e, r) => {
            // console.log("r", r);
            var data = r.rows
            res.send(data)

        })

    });

    app.get('/users/list', (req, res) => {
        console.log(req.params);

        var sql = "SELECT * FROM users  " +
            " ORDER BY id" +
            "";
        console.log(sql);

        db_pg.query(sql, (e, r) => {
            // console.log("r", r);
            var data = r.rows;
            res.send(data)// =>>brauserga ketti>>

        })

    });

    app.get('/wishsearch/schema', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        var p = req.params;
        console.log(req.params);
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````', userdata);

        // var id = p.id
        //     , uid = p.uid
        //     , rol = p.rol;
        //var table = req.params.table;
        // var userdata = server.userdata(req)
        // console.log('userdata````',userdata);
        // var id = req.params.id;

        /*var sql = "SELECT " +
            " w.id    " +
            " ,w.elon    " +
            " ,w.result " +
            " ,w.buyerid " +
            " ,b.uid " +
            " FROM wish w " +
            " LEFT JOIN buyer b ON b.id=w.buyerid " +
            " WHERE w.id=" + id + " " +
            ";";
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            var rows = r.rows;
            console.log("rows...", rows.length);
            let row = rows[0]
            let access = true;
            if (r.rowCount > 0 && id != 0 && uid != row.uid) {

                if (rol === 1 || rol === 6) {
                    access = true;
                } else {
                    // row.personaldata.maininfo.customertel = [];
                    access = false;
                }
            }
            if (r.rowCount > 0 && rol != 1 && uid != row.uid) {
                // access = false;
            }
            var json = {
                data: rows.length > 0 ? row : {},
                access: access
            };
            res.send(json);
        });*/
        var json = {
            data: {},
            access: true
        };
        res.send(json);
    });

    app.get('/wishsearchreq', function (req, res) {
        //console.log(req,res);
        console.log(req.params, req.body, req.query);
        var p = req.params;
        var q = req.query;

        let s = JSON.stringify(JSON.parse(q.s).maininfo)
        console.log(s)

        var sql = " SELECT\n" +
            "    w.id\n" +
            "  , w.buyerid\n" +
            "  , b.personaldata -> 'maininfo' ->> 'customerdata' oluvchi\n" +
            "  , u.id uid\n" +
            "  , u.name rname\n" +
            "  , u.surname rsname\n" +
            "  , w.elon\n" +
            "   FROM wish w\n" +
            "  left join buyer b on b.id=w.buyerid\n" +
            "  left join users u on u.id=b.uid\n" +
            "  WHERE  (elon -> 'maininfo' ) @> " +
            " '" + s + "'  " +
            // "  AND  CAST(elon -> 'maininfo' ->> 'pricestart' as numeric)  BETWEEN 0  AND 900000000  " +
            " ORDER BY id ASC ;" +
            ";";
        console.log(sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            // console.log("r", r);
            var rows = r.rows;
            console.log("rows...", rows);

            var json = {
                data: rows.length > 0 ? rows : {}
            };
            res.send(json);
        });
    });


    //-----mobile--------

    app.get('/buyersearchschema', function (req, res) {
        eval(fs.readFileSync('buyersearchschema.js').toString());
        var json = schem.flat.schema.properties
        //console.log(json)
        res.send(json);
    });
    app.get('/buyerprofileschema', function (req, res) {
        eval(fs.readFileSync('buyerprofileschema.js').toString());
        var json = schem.buyer.schema.properties
        //console.log(json)
        res.send(json);
    });


    app.get('/molx/:offset', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        //var table = req.params.table;
        //var id = req.params.id;
        var pages = 10;
        var offset = Number(req.params.offset);

        var sql = "SELECT " +
            " id ,elon ,types ,link ,n ,t    " +
            " FROM olx " +
            //" WHERE id=" + id + " " +
            " WHERE n!=0 " +
            " order by id " +
            "  OFFSET " + offset +
            "  LIMIT " + pages +
            ";";
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            //console.log("rows...", rows);
            var json = {
                data: rows.length > 0 ? rows : {},
                offset: offset + pages
            };
            res.send(json);
        });
    });

    app.get('/mbuyer', function (req, res) {///:offset/:pages

        //console.log(req,res);
        //console.log(req.params);
        //var pages = req.params.pages;
        //var offset = req.params.offset;
        var sql = "SELECT " +
            "id " +
            ",personaldata    " +
            //",personaldata -> 'maininfo' -> 'customertel' as customertel  " +
            "  FROM buyer " +
            " ORDER BY id ASC "
        /* +
         "  OFFSET " + offset +
         "  LIMIT " + pages + ";";*/
        //console.log('sql..',sql);
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            //console.log("rows", rows);
            var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var json = {
                data: rows,
                next_page_url: 'https://' + hostip + ':' + port + '/buyerlistfull' // + ofs.id + '/' + pages
            }
            res.send(json);
        });
    });

    app.get('/mwish', function (req, res) {
        //console.log(req,res);
        //console.log(req.params);
        //var table = req.params.table;
        //var id = req.params.id;

        var sql = "SELECT " +
            " id ,buyerid ,elon ,result    " +
            " FROM wish " +
            //" WHERE id=" + id + " " +
            ";";
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            //console.log("rows...", rows);
            var json = {
                data: rows.length > 0 ? rows : {}
            };
            res.send(json);
        });
    });

    //---sunnatillo------------

    app.get('/m/list/landmark/:offset/:pages', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        var pages = req.params.pages;
        var offset = req.params.offset;


        var sql = "SELECT " +
            "id " +
            ",elon    " +
            //",link    " +
            //    ",elon -> 'maininfo' -> 'landmark' as landmark  " +
            //",elon -> 'maininfo' -> 'pricestart' as pricestart  " +
            //",elon -> 'maininfo' as maininfo  " +
            //",elon->'maininfo'->>'importance' as importance  " +
            ",images->0 as image   " +

            "  FROM olx " +
            " ORDER BY id ASC " +// importance,
            "  OFFSET " + offset +
            "  LIMIT " + pages + ";";
        //console.log("sql", sql);
        var tb = +new Date()
        db_pg.query(sql, (e, r) => {
            console.log("e", e);
            console.log("r", r);
            var rows = r.rows;
            //console.log("rows", rows);
            var ofs = rows[rows.length - 1]
            //console.log("ofs....", ofs.id)
            var rw = []

            //
            if (rows.length > 0) {
                rows.forEach(r => {
                    var mi = r.elon.maininfo;
                    //console.log(mi)
                    let img = r.image != null ? r.image.replace(/https:\/\/static\.olx\.uz\/img-olxuz\//g, "http://140.82.7.5:4056/") : null;
                    rw.push({
                        id: r.id,
                        landmark: mi.landmark,
                        //tel: mi.ownertel != undefined ? mi.ownertel[0] : "",
                        pricestart: mi.pricestart,

                        currency: mi.currency,
                        address: mi.address,
                        date: mi.date,
                        //link: r.link,
                        //msgstatus: mi.msgstatus,
                        image: img,
                    })
                    //console.log('dur.....', (+new Date())-tb);
                })
                rows = rw;
                console.log('dur.....', (+new Date()) - tb);

                var json = {
                    data: rows,
                    next_page_url: 'https://' + hostip + ':' + port + '/m/list/landmark/' + ofs.id + '/' + pages,
                    //url: "http://140.82.7.5:4056"
                }
                res.send(json);
            } else {
                var json = {
                    data: [],
                    next_page_url: 'https://' + hostip + ':' + port + '/m/list/landmark/' + '0' + '/' + pages,
                    //url: "http://140.82.7.5:4056"
                }
                res.send(json);
            }


        });
        //console.log(json)

        return;//----------------------

        var row = JSON.parse(fs.readFileSync("flat.json"));
        var flat3 = fs.readFileSync("flat3.json");
        var data = flat3.length != 0 ? JSON.parse(flat3) : {};

        var json = {
            schema: row.flat.schema,
            data: data
        };
    });


    app.get('/m/flatext/:id', function (req, res) {
        //console.log(req,res);
        console.log(req.params);
        //var table = req.params.table;
        var id = req.params.id;

        var sql = "SELECT " +
            " elon ,images   " +
            " FROM olx " +
            " WHERE id=" + id + " " +
            //" order by link asc " +
            ";";
        db_pg.query(sql, (e, r) => {
            //console.log("e", e);
            //console.log("r", r);
            var rows = r.rows;
            console.log("rows...", rows);
            var elon = rows.length > 0 ? rows[0].elon : {};
            var pre_images = rows.length > 0 ? rows[0].images : [];
            var images = []
            if (pre_images != undefined) {
                pre_images.forEach(url => {
                    images.push(Functions.getfname(url));
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


    //------------------

    // app.get('/:route', function (req, res) {
    //     console.log('req.params>>>')
    //     console.log(req.params)
    //     console.log('<<<req.params')
    //     console.log(req.params.route)
    //     console.log(req.session.username)
    //     const route = req.params.route
    //     const file = req.session.username !== undefined ? `${__dirname}/${route}.html` : `${__dirname}/signin.html`
    //     // console.log(file)
    //     res.sendFile(file);
    // });
    app.get('/:route', function (req, res) {
        console.log(req.params)
        console.log(req.params.route)
        console.log(req.session.username)
        const route = req.params.route
        if (req.session.userdata !== undefined && req.session.userdata.rol != 1) {
            if (route === 'users' || route === 'hudud') {
                res.sendFile(`${__dirname}/index.html`);
                return
            }
        }

        const file = req.session.username !== undefined ? `${__dirname}/common/${route}.html` : `${__dirname}/common/signin.html`
        // console.log(file)
        res.sendFile(file);


    });
    app.get('/', function (req, res) {
        console.log('req.params>>>')
        console.log(req.session)
        console.log('<<<req.params')
        console.log(req.params.route)
        console.log(req.session.username)
        const file = req.session.username !== undefined ? `${__dirname}/index.html` : `${__dirname}/common/signin.html`
        // console.log(file)
        res.sendFile(file);
    });


}())



