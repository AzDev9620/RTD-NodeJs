var os = require("os");
module.exports = new (

    class Conf {
    constructor() {
        this.hostip = this.getHostIP();
        this.port = "4067";
        this.ports = "4066";
        this.rtdimagesurl = "http://140.82.7.5:4056";
        this.config_pg = {
            user: 'postgres',
            // host: 'localhost',
            host: '95.179.131.104',//6 RTD
            database: 'rtd2',
            password: 'zzxxcc99',
            port: 5432
        };
    }

    getHostIP() {
        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        //console.log('addresses.....', addresses);
        var adr = addresses[0];
        return adr;
    }
}



)()




