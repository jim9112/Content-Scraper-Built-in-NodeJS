var Crawler = require("crawler");

var shirtPages = [];

var grabShirtLinks = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            for (i=0; i<$("ul.products li a").length; i++){
                shirtPages.push('http://shirts4mike.com/' + $("ul.products li a")[i].attribs.href);
            }
            console.log(shirtPages);
        }
        done();
    }
});
grabShirtLinks.queue('http://shirts4mike.com/shirts.php');
