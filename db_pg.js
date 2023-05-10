const { Pool, Client } = require('pg');
var Conf = require('./Conf.js')
const config_pg = Conf.config_pg;

var state = {
    db: null
};


exports.connect = function (/*config_pg,*/ done) {
    if (state.db) {
        return done();
    }

    const pool = new Pool(config_pg);

    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client...', err);
        console.error('client...:', client);
        //process.exit(-1);
        return done(err);
    });
    pool.connect((err, client, release) => {
        if (err) {
            /*return*/
            console.error('Error acquiring client', err.stack)
            return done(err);
        }
        client.query('SELECT NOW()', (err, result) => {
            release()
            if (err) {
                /*return*/
                console.error('Error executing query', err.stack)
                return done(err);
            }
            //console.log('result.rows...:',result.rows)
        })
        state.db = pool;
        done();
        //console.log('pool...: ', pool);
    });

};

exports.query = function (sql, callback) {
    return state.db.query(sql, (err, res) => {
        //const duration = Date.now() - start
        //console.log('executed query', {sql, duration, rows: res});
        callback(err, res)
    })
}

exports.get = function () {
    return state.db;
};


exports.Flat = function () {
    var sql = "CREATE TABLE IF NOT EXISTS flat(" +
        "id integer" +
        ",rooms jsonb " +
        ",floor jsonb  " +
        ",storeys jsonb  " +
        ",address jsonb  " +
        ",landmark jsonb  " +
        ",layout jsonb  " +
        ",yearofconstruction jsonb  " +
        ",material jsonb  " +
        ",location jsonb  " +
        ",roomslayout jsonb  " +
        ",area jsonb  " +
        ",smell jsonb  " +
        ",ceilingheight jsonb  " +
        ",butt jsonb  " +
        ",bathroom jsonb  " +
        ",balcony jsonb  " +
        ",securitysystem jsonb  " +
        ",roof jsonb  " +
        ",roofcondition jsonb  " +
        ",roofmaterial jsonb  " +
        ",infrastructure jsonb  " +
        ",subway jsonb  " +
        ",parking jsonb  " +
        ",porch jsonb  " +
        ",garden jsonb  " +
        ",lift jsonb  " +
        ",liftcondition jsonb  " +
        ",neighbors jsonb  " +
        ",famousneighbors jsonb  " +
        ",PRIMARY KEY(id)" +
        ");";
    sql += 'INSERT INTO "flat" ("id")'
        + "VALUES (" +
        "1" +
        ") ON CONFLICT DO NOTHING;";

    //var sql = "CREATE TABLE IF NOT EXISTS flat(" +
    //    "id integer" +
    //    ",rooms jsonb DEFAULT '{}'::json" +
    //    ",floor jsonb DEFAULT '{}'::json" +
    //    ",storeys jsonb DEFAULT '{}'::json" +
    //    ",address jsonb DEFAULT '{}'::json" +
    //    ",landmark jsonb DEFAULT '{}'::json" +
    //    ",layout jsonb DEFAULT '{}'::json" +
    //    ",yearofconstruction jsonb DEFAULT '{}'::json" +
    //    ",material jsonb DEFAULT '{}'::json" +
    //    ",location jsonb DEFAULT '{}'::json" +
    //    ",roomslayout jsonb DEFAULT '{}'::json" +
    //    ",area jsonb DEFAULT '{}'::json" +
    //    ",smell jsonb DEFAULT '{}'::json" +
    //    ",ceilingheight jsonb DEFAULT '{}'::json" +
    //    ",butt jsonb DEFAULT '{}'::json" +
    //    ",bathroom jsonb DEFAULT '{}'::json" +
    //    ",balcony jsonb DEFAULT '{}'::json" +
    //    ",securitysystem jsonb DEFAULT '{}'::json" +
    //    ",roof jsonb DEFAULT '{}'::json" +
    //    ",roofcondition jsonb DEFAULT '{}'::json" +
    //    ",roofmaterial jsonb DEFAULT '{}'::json" +
    //    ",infrastructure jsonb DEFAULT '{}'::json" +
    //    ",subway jsonb DEFAULT '{}'::json" +
    //    ",parking jsonb DEFAULT '{}'::json" +
    //    ",porch jsonb DEFAULT '{}'::json" +
    //    ",garden jsonb DEFAULT '{}'::json" +
    //    ",lift jsonb DEFAULT '{}'::json" +
    //    ",liftcondition jsonb DEFAULT '{}'::json" +
    //    ",neighbors jsonb DEFAULT '{}'::json" +
    //    ",famousneighbors jsonb DEFAULT '{}'::json" +
    //    ",PRIMARY KEY(id)" +
    //    ");";
    sql += "";
    //sql += 'INSERT INTO "flat" ("id","rooms","floor","storeys","address","landmark","layout","yearofconstruction","material","location","roomslayout","area","smell","ceilingheight","butt","bathroom","balcony","securitysystem","roof","roofcondition","roofmaterial","infrastructure","subway","parking","porch","garden","lift","liftcondition","neighbors","famousneighbors")'
    //    + "VALUES (" +
    //    "1" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ",'{}'::json" +
    //    ") ON CONFLICT DO NOTHING;";
    //console.log(sql);

    state.db.query(sql, (err, res) => {
        //console.log(err, res);
        // pool.end();
    });
};


exports.Users = function () {
    var sql = "CREATE TABLE IF NOT EXISTS  users  (" +
        "id SERIAL  primary key" +
        ",parent_id BIGINT  DEFAULT 0" +
        ",name TEXT  DEFAULT cast( random() * 10000 + 1 as int ) " +
        ",surname TEXT   DEFAULT cast( random() * 100000 + 1 as int ) " +
        ",login TEXT  DEFAULT cast( (date_part('epoch'::text, CURRENT_TIMESTAMP) * 1000::double precision + date_part('milliseconds'::text, CURRENT_TIMESTAMP)) as bigint )  UNIQUE" +
        ",pass TEXT default 1 " +
        ",rol integer default 9 " + // 1-admin, 2---, 3-callcenter, 4-rieltor, 5-sms_sender, 6-koordinator

        ",address TEXT " +
        ",country TEXT " +
        ",city TEXT " +
        ",email TEXT " +
        ",telefon TEXT " +
            //",see_pr_prc integer DEFAULT 0" +//see prihod price
            //",upd_pr_prc integer DEFAULT 0" +//update prihod price
            //",upd_del_pr integer DEFAULT 0" +//update or delete prihod
            //",upd_ret_prc integer DEFAULT 0" +//update retail price
            //",acs_db integer DEFAULT 0" +//access to db
        ");";
    //console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};


exports.Olx = function () {
    var sql = "CREATE TABLE IF NOT EXISTS olx  (" +//
        "id BIGSERIAL " +
        ",elon jsonb " +
        ",types jsonb " +
        ",link text " +
        ",n integer " + // elon nomeri
        ",t bigint " + //time created
        ",images jsonb " +
        ",u bigint " + //updated
        ", PRIMARY KEY (id) " +
        ");";
    // console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};

exports.Olx1 = function () {
    var sql = "CREATE TABLE IF NOT EXISTS olx1  (" +//
        "id BIGSERIAL " +
        ",elon jsonb " +
        ",types jsonb " +
        ",link text " +
        ",n integer " + // elon nomeri
        ",t bigint " + //time created
        ",images jsonb " +
        ",u bigint " + //updated
        ", PRIMARY KEY (id) " +
        ");";
    //console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};

exports.Wish = function () {
    var sql = "CREATE TABLE IF NOT EXISTS wish  (" +//
        "id SERIAL " +
        ",buyerid integer " +
        ",elon jsonb " +
        ",result jsonb " +
        ",types jsonb " +
        ",t bigint " +
        ");";
    //console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};

exports.Buyer = function () {
    var sql = "CREATE TABLE IF NOT EXISTS buyer  (" +//
        "id SERIAL " +
        ",personaldata JSONB " +
        ",wishes JSONB " +
        ",uid INTEGER " +
        ");";
    //console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};


exports.Hudud = function () {
    var sql = "CREATE TABLE IF NOT EXISTS hudud  (" +//
        // "id SERIAL " +
        "uid INTEGER " +
        ",hudud jsonb DEFAULT '[]'::jsonb" +
        ", CONSTRAINT uni_hudud UNIQUE (uid)" +

        ");";
    //console.log(sql);
    state.db.query(sql, function (error, results, fields) {
        //console.log(results);
        if (error) throw error;
    });
};


exports.rawquery = function(sql,showresults, stringify ,callback ){
    var start = Date.now();
    return state.db.query(sql, (err, res) => {
        const duration = Date.now() - start;
        let o = {
            sql,
            duration,
            rowCount : res.rowCount,
            rows: showresults ?stringify ? JSON.stringify(res.rows) : res.rows : undefined
        }
        console.log('executed query',o );
        callback(err, res)
    })
};











