const scrape = require("./core/scrape");
const readlineSync = require("readline-sync");
const fs = require('fs');

var writeStream = "";

async function main(){
    var filename = readlineSync.question("Enter file name ~ ");
    var options = readlineSync.question("Type Number : \n [1] For BoxNovel \n [2] For VipNovel \n");
    writeStream = fs.createWriteStream(`${filename}.xls`);
    
    if(parseInt(options) === 1){
        await coreAction("https://boxnovel.com/novel/");
    }

    if(parseInt(options) === 2){
        await coreAction("https://vipnovel.com/vipnovel/");
    }
}

async function coreAction(url, pagenum = 1){

    const scrapeOBJ = new scrape();
    var list = await scrapeOBJ.getLinks(url);
    console.warn('Start Scraping, Page Number ~ ',pagenum);
    
    for (let index = 0; index < list.list.length; index++) {
        var status = await scrapeOBJ.getStatus(list.list[index]);
        await updateOnFile(list.list[index], status);
    }

    if(list?.prev_url != undefined){
        await coreAction(list?.prev_url, pagenum + 1);
    }else{
        console.info('Scarping Completed !!!');
    }

}

async function updateOnFile(url, status){
    writeStream.write(url + '\t' + status + '\n');
}

main();