const axios = require('axios');

module.exports.scrapeURL = function (url){
    return axios.get(url);
}