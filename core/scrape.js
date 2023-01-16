const config = require('./config');
const cheerio = require('cheerio');

module.exports = class scrape {

    getLinks = async (url) => {
        return await config.scrapeURL(url).then(async (res) => {
            var list = await this.filterLinks(res);
            var prev_url = await this.getprev_url(res);
            return { list: list, prev_url: prev_url };
        }).catch(e => {
            console.log(e);
        });
    }

    filterLinks = (res) => {
        var list = [];
        const $ = cheerio.load(res.data);
        $('.item-summary > div > h3 > a').each((index, ele) => {
            list.push($(ele).attr('href'));
        });

        return list;
    }

    getprev_url = (res) => {
        const $ = cheerio.load(res.data);
        return $('[class="nav-previous float-left"] > a').attr('href');
    }

    getStatus = async (url) => {
        return await config.scrapeURL(url).then((res) => {

            const $ = cheerio.load(res.data);
            var rawData = $('[class="post-content_item"]').text();
            rawData = rawData.trim();
            rawData = rawData.split("\n");
            rawData = rawData.map(function (el) {
                return el.trim();
            });
            rawData = rawData.filter(function (el) {
                return el != '';
            });

            var status = "";
            for (let index = 0; index < rawData.length; index++) {
                if (rawData[index].includes('Status')) {
                    status = (rawData[index + 1]);
                }
            }

            return status;

        }).catch(e => {
            console.log(e);
        });
    }

}