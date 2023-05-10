module.exports = class Functions {
    static  getfname(url) {
        var nmar = url.split("/")
        var fname = nmar[nmar.length - 1]
        //console.log(fname)
        return fname
    }


     isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }
}