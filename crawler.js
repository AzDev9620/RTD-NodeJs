var Crawler = require("crawler");
var fs = require('fs');

var file = "houses.txt"
fs.truncate(file, 0, function () {
    console.log('done')
})
var houses = [];
var n=0;
var c = new Crawler({
    //rateLimit: 10000,
    maxConnections: 2,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            //console.log($("title").text());
            //console.log($("a.thumb.detailsLink.linkWithHash").html()  );
            var o = $("a.thumb.detailsLink.linkWithHash");

            var i = 0

            Object.keys(o).forEach(key=> {
                //console.log( o[key].attribs )
                if (o[key].attribs !== undefined) {
                    //console.log(key);
                    console.log(i++, o[key].attribs.href);
                    //houses.push(o[key].attribs.href);
                    fs.appendFileSync(file, o[key].attribs.href + "\n")
                }
            });
            //console.log(houses)
        }
        done();
    }
});

var pages = [];
for (var i = 1; i < 500; i++) {
    // k+=
    var page = 'https://www.olx.uz/nedvizhimost/?page=' + i;
    console.log(page)
    pages.push(page)
}

// Queue just one URL, with default callback
//c.queue('https://www.olx.uz/nedvizhimost/kvartiry/?page=1');

// Queue a list of URLs
//c.queue(['http://www.google.com/','http://www.yahoo.com']);
c.queue(pages);


// Queue some HTML code directly without grabbing (mostly for tests)
//c.queue([{
//    html: '<p>This is a <strong>test</strong></p>'
//}]);