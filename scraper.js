var Crawler = require("crawler");
var fs = require("fs");
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var shirtPages = [];


// check for data directory and reate if missing
const checkDirectorySync = (directory) => {  
    try {
      fs.statSync(directory);
    } catch(e) {
      fs.mkdirSync(directory);
    }
  };
checkDirectorySync('data');

// Creates file structure and header for csv
const csvWriter = createCsvWriter({
    path: 'data/test.csv',
    header: [
        {id: 'title', title: 'TITLE'},
        {id: 'price', title: 'PRICE'},
        {id: 'imageURL', title: 'IMAGE URL'},
        {id: 'url', title: 'URL'},
        {id: 'time', title: 'TIME'}
    ]
});
 
const records = [
    {title: 'Bob',  price: 'French'},
    {title: 'Mary', price: 'English'}
];
 




var grabShirtLinks = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            for (i=0; i<$("ul.products li a").length; i++){
                shirtPages.push('http://shirts4mike.com/' + $("ul.products li a")[i].attribs.href);
            }
            grabShirtDetails.queue(shirtPages);
        }
        done();
    }
});


var grabShirtDetails = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            console.log($("div.shirt-details h1").text());
        }
        
        done();
    }
});



grabShirtLinks.queue('http://shirts4mike.com/shirts.php');

// writes csv file
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });