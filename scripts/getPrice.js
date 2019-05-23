/* eslint-disable no-unused-vars */
const https = require('https');
const cron = require('node-cron');
const logToSplunk = require('./sendToSplunk');

const app = require('http')
	.createServer(handler);
const statusCode = 200;

app.listen(9001);

//Server and Trading Bot API handler for recieved API requests.
function handler(req, res) {
	var data = '';

	if (req.method == 'POST') {
		req.on('data', function(chunk) {
			data += chunk;
		});

		req.on('end', function() {
			console.log('Received body data:', data.toString());
			//data parsing to run commands let data = JSON.parse(data);
			let data2 = { 'command': 'add', 'market': 'BTC-LTC', 'token': 'LTC', 'schedule': '*/5 * * * *' }; // this line is for testing/example only and will be removed.
			tokenCommand(data2.command, data2.market, data2.token, data2.schedule);
		});
	}

	res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
	res.end();
}

//Method to log to splunk via.
const logMode = 'HTTP'; //Options are HTTP or File.
const splunkLogDestination = 'crypto';

//DOCS: https://support.bittrex.com/hc/en-us/articles/115003723911-Developer-s-Guide-API
//Public APIs
var getmarkets = site('/api/v1.1/public/getmarkets'); //no args
var getcurrencies = site('/api/v1.1/public/getcurrencies'); //no args
var getticker = site('/api/v1.1/public/getticker', 'Yes', 'BTC-LTC');
var getmarketsummaries = site('/api/v1.1/public/getmarketsummaries'); //no args
var getmarketsummary = site('/api/v1.1/public/getmarketsummary?market=BTC-LTC');
var getorderbook = site('/api/v1.1/public/getorderbook', 'Yes', 'BTC-LTC', '', '', 'both'); //could be buy, sell or both
var getmarkethistory = site('/api/v1.1/public/getmarkethistory?market=BTC-DOGE');

//Market APIs
var buylimit = site('/api/v1.1/market/buylimit?apikey=API_KEY&market=BTC-LTC&quantity=1.2&rate=1.3');
var selllimit = site('/api/v1.1/market/selllimit?apikey=API_KEY&market=BTC-LTC&quantity=1.2&rate=1.3');
var cancel = site('/api/v1.1/market/cancel?apikey=API_KEY&uuid=ORDER_UUID');
var getopenorders = site('/api/v1.1/market/getopenorders?apikey=API_KEY&market=BTC-LTC');

//Account APIs
var getbalances = site('/api/v1.1/account/getbalances?apikey=API_KEY');
var getbalance = site('/api/v1.1/account/getbalance?apikey=API_KEY&currency=BTC');
var getorder = site('/api/v1.1/account/getorder&uuid=0cb4c4e4-bdc7-4e13-8c13-430e587d2cc1');
var getorderhistory = site('/api/v1.1/account/getorderhistory?market=BTC-LTC');

var tokenCollection = [];

//Trading Bot API request parser/processor.
function tokenCommand(command, market, token, schedule) {
	if (command === 'add') {
		let newToken = '{ "' + market + '": { "schedule": "' + schedule + '", "token": "' + token + '" } }';
		tokenCollection.push(newToken);
		console.log(tokenCollection);
	} else if (command === 'remove') {
		for (let i = 0; i < tokenCollection.length; i++) {
			if (typeof tokenCollection[i][token] != 'undefined') {
				if (i > -1)
					tokenCollection.splice(i, 1);
			}
		}
		console.log(tokenCollection);
	} else if (command === 'buy') {
		//some magic sauce
		//check BTC and ETC balance
		//determine how much should be bought either min default 5% or specified amount in dollars
		//  - future feature should be to check if price movement is too fast or if buy/ sell wall on the order book is being manipulated. if so cancel buy and log to splunk.
		//check price of new token
		//calc amount to be bought
		//buy new token
	} else if (command === 'sell') {
		//more magic sauce
		//check the balance of the coin to be sold
		//determine how much should be sold either min default 5% or specified amount in dollars
		//  - future feature should be to check if price movement is too fast or if buy/ sell wall on the order book is being manipulated. if so cancel sell and log to splunk.
		//check price of new token
		//calc amount to be sold
		//buy new token
	}
}

//Formatter to consume BITTREX API.
function site(uri, hasOptions, market, apiKey, uuid, type, quantity, rate, currency) {
	let data = {};
	data.api = uri.split('/')
		.slice(-1)
		.toString();
	data.site = uri;

	if (hasOptions === 'Yes') {
		data.site += '?';
		if (market) {
			data.market = market; //"BTC-LTC"
			data.currency = market.split('-')
				.slice(-1)
				.toString();
			data.site += `market=${market}&`;
		}

		if (currency) {
			data.currency = currency; //"LTC"
			data.site += `currency=${currency}&`;
		}

		if (apiKey) {
			data.apikey = apiKey; //"API_KEY"
			data.site += `apikey=${apiKey}&`;
		}

		if (uuid) {
			data.uuid = uuid; //"0cb4c4e4-bdc7-4e13-8c13-430e587d2cc1"
			data.site += `uuid=${uuid}&`;
		}

		if (type) {
			data.type = 'both'; //ie "both"|"sell"|"buy"
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
		host: 'bittrex.com',
		port: 443,
		path: data.site,
		method: 'GET'
	};
	delete data.site;
	return data;
}

//Consume BITTREX API response and log to Splunk.
function fetchAPIAndLogData(apiRequest) {
	https.request(apiRequest.options, function(res) {
		let body = '';

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			let JSONData = JSON.parse(body);
			JSONData.params = apiRequest;
			console.log(JSONData);
			logToSplunk(JSONData, logMode, splunkLogDestination);
		});
	})
		.end();
}

// cron.schedule("*/5 * * * *", function() { //Every 5 mins
//     fetchAPIAndLogData(getticker);
// });

fetchAPIAndLogData(getticker);

//To-Do (in order by priority):
// 1-add token to monitor
// 2-web hook listener to receive commands. such as buy, sell, add, increase monitoring tempo
// 3-remove token from monitor
// 4-tempo maintainer per token
// 5-add check to see if token is already being monitored or has already been removed when using add/remove respectively
// 6-buy handler
// 7-sell handler
// 8-add slack intergration. but when should it trigger a slack notification for large price movement?
// done 0-map out the usable Bittrex APIs for the purposes of this project
// done 0.5-interject meta such as which token is the price data for into the json before its sent to splunk