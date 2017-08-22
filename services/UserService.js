'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var models = require('../models/index');
var natsClient = require('./NatsClient')

module.exports.getUserAuthKey = function() {
	//read user auth key from mongo
	return 12345;
}

module.exports.authenticate = function(uid, password, name) {
	return natsClient.authenticate(uid, password, name);
}

module.exports.addUserToken = function(userId, token, ip, customerName) {
	models.User.create({
    	user_id: userId,
    	token: token,
    	ip: ip,
    	customer_name: customerName
	}).then(function(user) {
    	return user;
  	});
}

module.exports.getUserFromHash = function(hash) {
	return models.User.find({
		where: {
			token: hash
		}
	})
}

module.exports.checkUserToken = function() {
	models.User.findAll({}).then(function(users) {
	    return users;
	});
}

module.exports.removeUserToken = function(userId, token) {
	models.User.delete({
		where: {
			user_id: userId,
			token: token
		}
	})
}

module.exports.intervalRemoveUserToken = function() {

}
