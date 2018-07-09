const https = require("https");
const cron = require("node-cron");
const logToSplunk = require('./sendToSplunk');

//Method to log to splunk via.
var logMode = "HTTP"; //Options are HTTP or File.
var splunkLogDestination = "crypto";

//https://support.bittrex.com/hc/en-us/articles/115003723911-Developer-s-Guide-API
//Public APIs
var getmarkets = site("/api/v1.1/public/getmarkets"); //no args
var getcurrencies = site("/api/v1.1/public/getcurrencies"); //no args
var getticker = site("/api/v1.1/public/getticker", "Yes", "BTC-LTC");
var getmarketsummaries = site("/api/v1.1/public/getmarketsummaries"); //no args
var getmarketsummary = site("/api/v1.1/public/getmarketsummary?market=BTC-LTC");
var getorderbook = site("/api/v1.1/public/getorderbook", "Yes", "BTC-LTC", "", "", "both"); //could be buy, sell or both
var getmarkethistory = site("/api/v1.1/public/getmarkethistory?market=BTC-DOGE");

//Market APIs
var buylimit = site("/api/v1.1/market/buylimit?apikey=API_KEY&market=BTC-LTC&quantity=1.2&rate=1.3");
var selllimit = site("/api/v1.1/market/selllimit?apikey=API_KEY&market=BTC-LTC&quantity=1.2&rate=1.3");
var cancel = site("/api/v1.1/market/cancel?apikey=API_KEY&uuid=ORDER_UUID");
var getopenorders = site("/api/v1.1/market/getopenorders?apikey=API_KEY&market=BTC-LTC");

//Account APIs
var getbalances = site("/api/v1.1/account/getbalances?apikey=API_KEY");
var getbalance = site("/api/v1.1/account/getbalance?apikey=API_KEY&currency=BTC");
var getorder = site("/api/v1.1/account/getorder&uuid=0cb4c4e4-bdc7-4e13-8c13-430e587d2cc1");
var getorderhistory = site("/api/v1.1/account/getorderhistory?market=BTC-LTC");

// var tokens = [];

// function handleToken(action, token, schedule) {
//     if (action == "add") {
//         let newToken = { token: { "schedule": schedule } };
//         tokens.push(newToken);
//     } else if (action == "remove") {
//         let newToken = { token: { "schedule": schedule } };
//         var index = tokens.indexOf(token);
//         if (index > -1) {
//             tokens.splice(index, 1);
//         }
//     }
// }

function site(uri, hasOptions, market, apiKey, uuid, type, quantity, rate, currency) {
    data = {};
    data.api = uri.split("/").slice(-1).toString();
    data.site = uri;

    if (hasOptions == "Yes") {
        data.site += "?";
        if (market) {
            data.market = market; //"BTC-LTC"
            data.currency = market.split("-").slice(-1).toString();
            data.site += `market=${market}&`;
        }

        if (currency) {
            data.currency = currency; //"LTC"
            data.site += `currency=${currency}&`;
        }

        if (apiKey) {
            data.apikey = apiKey; //"API_KEY"
            data.site += `apikey=${apkiKey}&`;
        }

        if (uuid) {
            data.uuid = uuid; //"0cb4c4e4-bdc7-4e13-8c13-430e587d2cc1"
            data.site += `uuid=${uuid}&`;
        }

        if (type) {
            data.type = "both"; //ie "both"|"sell"|"buy"
            data.site += `type=${type}&`;
        }

        if (quantity && rate) {
            data.quantity = quantity; //ie "1.2"
            data.rate = rate; //ie "1.3"
            data.site += `quantity=${quantity}&rate=${rate}&`;
        }

        data.site = data.site.slice(0, -1);
    }
    data.options = {
        host: "bittrex.com",
        port: 443,
        path: data.site,
        method: "GET"
    };
    delete data.site;
    return data;
}

function fetchAPIAndLogData(apiRequest) {
    https.request(apiRequest.options, function(res) {
        let body = "";

        res.on("data", function(data) {
            body += data;
        });

        res.on("end", function() {
            let JSONData = JSON.parse(body);
            JSONData.params = apiRequest;
            console.log(JSONData);
            logToSplunk(JSONData, logMode, splunkLogDestination);
        });
    }).end();
}

// cron.schedule("*/5 * * * *", function() { //Every 5 mins
//     fetchAPIAndLogData(getticker);
// });

fetchAPIAndLogData(getticker);

//To-Do:
// -web hook listener to receive commands on what to buy and sell and increase monitoring tempo
// -buy handler
// -sell handler
// -add token to monitor
// -remove token from monitor
// -tempo maintainer per token
// -add slack intergration.
// done-interject meta such as which token is the price data for into the json before its sent to splunk