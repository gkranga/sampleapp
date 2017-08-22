// var servers = ['nats://54.169.220.163:4222'];
var config = require('config');
var servers = config.get('nats');
// Server connection
var nats = require('nats');

module.exports.authenticate = function (uid, password, name) {
	var credentials = { uid: uid, password: password };
	var nc = nats.connect({'servers': servers});
	// console.log('{"action":"authenticate", "parameters":[{ "uid": "'+uid+'", "password": "'+password+'", "customername": "'+name+'" }]}');
	// Requests
	nc.request('user', '{"action":"authenticate", "parameters":[{ "uid": "'+uid+'", "password": "'+password+'", "customername": "'+name+'" }]}', function(response) {
	 	// console.log('Got a response: ' + response);
	 	return response;
	})
	nc.on('error', function(exception) {
 		console.log("sender Can't connect to the nats-server [" + nc.options.url + "] is it running?");
		return false;
	});
}

module.exports.getCustomer = function (customerId, callback) {
	var nc = nats.connect({'servers': servers});
	// console.log('{"action":"authenticate", "parameters":[{ "uid": "'+uid+'", "password": "'+password+'", "customername": "'+name+'" }]}');
	// Requests
	nc.request('customer', '{"action":"read", "parameters":[{"customerName":"'+customerId+'", "limit":10, "skip":0}]}', function(response) {
	    // console.log(response);
	});
}

// Close connection
// nats.close();
