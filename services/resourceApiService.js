'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var config = require('config');
var servers = config.get('nats');
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];
// Server connection
var nats = require('nats');
var nc = nats.connect({'servers': servers});
var Q = require('q');

module.exports.listResourceCount = function(customerName) {

		// console.log(customerName);
		var def = Q.defer();
		nc.request('countApi','{"action":"read", "parameters":[{"customerName":'+JSON.stringify(customerName)+'}]}', function(response) {
			def.resolve(response);
		});

		return def.promise; 
}
module.exports.resourceCount = function(resourceName,customerName) {

		var def = Q.defer();
		nc.request(resourceName, '{"action":"count", "parameters":['+JSON.stringify({query: {customerName:customerName}})+']}' , function(response) {
			def.resolve(response);
		});
		return def.promise; 
}

module.exports.listResources = function(resourceName) {

		var def = Q.defer();
		nc.request(resourceName, '{"action":"list", "parameters":[{"query": {}}, {"sortOrder": "DESC", "sortField": "memory", "skip": 0, "pageSize": 50, "pagination": true}]}', function(response) {
			def.resolve(response);
		});
		return def.promise; 
}

module.exports.getUnTaggedProjects = function(customerName , UuId,resourceName, instanceId) {
	console.log(customerName , UuId,resourceName, instanceId);
		var def = Q.defer();
		nc.request('user', '{"action":"list_projects", "parameters":[{"customerName":'+JSON.stringify(customerName)+',"uid": '+JSON.stringify(UuId)+',"resourceType": '+JSON.stringify(resourceName)+',"resourceId": '+JSON.stringify(instanceId)+'}]}' , function(response) {
			def.resolve(response);
		});
		return def.promise; 
}


module.exports.tagResourceToProject = function(resourceName, customerName, projectName, instanceId) {
		var def = Q.defer();
		nc.request(resourceName, '{"action":"tagProjectToResource", "parameters":[{"customerName":'+JSON.stringify(customerName)+',"projectName": '+JSON.stringify(projectName)+',"instanceId": '+JSON.stringify(instanceId)+'}]}' , function(response) {
			def.resolve(response);
		});
		return def.promise; 
}

module.exports.unTagProjectToResource = function(resourceName, customerName, projectName, instanceId) {
		var def = Q.defer();
		nc.request(resourceName, '{"action":"unTagProjectToResource", "parameters":[{"customerName":'+JSON.stringify(customerName)+',"projectName": '+JSON.stringify(projectName)+',"instanceId": '+JSON.stringify(instanceId)+'}]}' , function(response) {
			def.resolve(response);
		});
		return def.promise; 
}


module.exports.getResourceTaggedProject = function(resourceName, customerName, key, value) {

		var def = Q.defer();
		nc.request(resourceName, '{"action":"read", "parameters":[{'+JSON.stringify(key)+':'+JSON.stringify(value)+'}]}' , function(response) {
			def.resolve(response);
		});
		return def.promise; 
}

module.exports.searchResources = function(resourceName,filter) {

		var def = Q.defer();
		nc.request(resourceName, '{"action":"list", "parameters":[{"query": {}, "text":"'+filter+'"}, {"sortOrder": "ASC", "sortField": "instanceId", "skip": 0, "pageSize": 50, "pagination": true}]}', function(response) {
			def.resolve(response);

		});

		return def.promise; 
}

module.exports.sortResources = function(resourceName,sortField,sortType) {

		var def = Q.defer();
		// var
		nc.request(resourceName, '{"action":"list", "parameters":[{"query": {}}, {"sortOrder": "'+sortType+'", "sortField":"'+sortField+'", "skip": 0, "pageSize": 50, "pagination": true}]}', function(response) {
			def.resolve(response);

		});		
		return def.promise; 
}



