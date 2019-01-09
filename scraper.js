var Crawler = require("crawler");
var fs = require("fs");
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

// array to contain links to shirt pages
const shirtPages = [];

// array to contain objects to be printed to csv
const records = [];

// create new date to be used later
var currentDate = new Date();

// creates title for csv file with current date YYYY-MM-DD.csv
var dateNameCSV = currentDate.toISOString().slice(0,10);

// check for data directory and create if missing
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
    path: `data/${dateNameCSV}.csv`,
    header: [
        {id: 'title', title: 'TITLE'},
        {id: 'price', title: 'PRICE'},
        {id: 'imageURL', title: 'IMAGE URL'},
        {id: 'url', title: 'URL'},
        {id: 'time', title: 'TIME'}
    ]
});
 
// crawler scrapes shirts4mike hompage
var grabShirtLinks = new Crawler({
    maxConnections : 10,
    retries : 0,
    callback : function (error, res, done) {
        if(error){
            console.log(`I'm sorry ${error.hostname} is not available at the moment, please check your internet connection or try again later`);
        }else{
            var $ = res.$;
            // scrapes links to individual shirt pages and puts them in the shirtPages array
            for (i=0; i<$("ul.products li a").length; i++){
                shirtPages.push('http://shirts4mike.com/' + $("ul.products li a")[i].attribs.href);
            }
            // trigger crawler for individual shirt pages
            grabShirtDetails.queue(shirtPages);
        }
        done();
    }
});

// crawler scrapes individual tshirt pages
var grabShirtDetails = new Crawler({
    maxConnections : 10,
    retries : 0,
    callback : function (error, res, done) {
        if(error){
            console.log(`I'm sorry ${error.hostname} is not available at the moment, please check your internet connection or try again later`);
        }else{
            var $ = res.$;
            var pageAddr = this.uri; 
            // pushes scraped data to records array
            records.push({
                title: $("div.shirt-picture span img")[0].attribs.alt,
                price: $("span.price").text(),
                imageURL: 'http://shirts4mike.com/' + $("div.shirt-picture span img")[0].attribs.src,
                url: pageAddr,
                time: currentDate.toLocaleTimeString()
            });
        }
        // writes csv file once all shirt pages have been scraped
        if (shirtPages.length === records.length){
            csvWriter.writeRecords(records)   
    .then(() => {
        console.log('Scraping complete, results can be found in the data folder.');
    });
        }
        done();
    }
});


// initiates crawlers
grabShirtLinks.queue('http://shirts4mike.com/shirts.php');