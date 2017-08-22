'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var config = require('config');
var servers = config.get('nats');
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];
// Server connection
var nats = require('nats');
var Q = require('q');
var nc = nats.connect({'servers': servers});

module.exports.getJsonForCustomer = function(id) {
	var result;
  var def = Q.defer();

  nc.request('customer', '{"action":"read", "parameters":[{"customerName":"'+id+'", "limit":10, "skip":0}]}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.getJsonForUser = function(id) {
  var result;
  var def = Q.defer();

  nc.request('user', '{"action":"read", "parameters":[{"uid":"'+id+'"}]}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.getAuthService = function() {
	var result;
  var def = Q.defer();

	nc.request('authService', '{"action":"read", "parameters":[{}]}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.userList = function(customerName, uid) {
  var def = Q.defer();

  var json = {};
  var formData = {};
  json['action'] = 'list';
  formData['customerName'] = customerName;
  formData['uid'] = uid;

  json['parameters'] = [];
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    // console.log(response)
    // response = JSON.parse(response);
    // response.customerName = customerName;
    def.resolve(response);
  });


  // console.log('{"action":"list", "parameters":[{"customerName": "'+customerName+'", "uid":"'+uid+'"}]}');
  // nc.request('user', '{"action":"list", "parameters":[{"customerName": "'+customerName+'", "uid":"'+uid+'"}]}', function(response) {
  // nc.request('user', '{"action":"list", "parameters":[{"uid": "'+uid+'", "limit":10, "skip":0}]}', function(response) {
    // def.resolve(response);
  // });

  return def.promise; 
}

module.exports.userListObject = function(customerName, uid) {
  var def = Q.defer();

  var json = {};
  var formData = {};
  json['action'] = 'list';
  formData['customerName'] = customerName;
  formData['uid'] = uid;

  json['parameters'] = [];
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    response = JSON.parse(response);
    response.customerName = customerName;
    // console.log('inside user', response);
    def.resolve(response);
  });


  // nc.request('user', '{"action":"list", "parameters":[{"customerName": "'+customerName+'", "uid":"'+uid+'"}]}', function(response) {
  // // nc.request('user', '{"action":"list", "parameters":[{"uid": "'+uid+'", "limit":10, "skip":0}]}', function(response) {
  //   response = JSON.parse(response);
  //   response.customerName = customerName;
  //   def.resolve(response);
  // });

  return def.promise; 
}

module.exports.customerList = function(customerName, uid) {
  var def = Q.defer();

  nc.request('customer', '{"action":"list", "parameters":[{"customerName": "'+customerName+'", "uid":"'+uid+'"}]}', function(response) {
    def.resolve(response);
  });

  return def.promise; 
}

module.exports.cspList = function(customerName) {
  var def = Q.defer();

  nc.request('cspregion', '{"action":"getcspregions", "parameters":[{"customername": "'+customerName+'"}]}', function(response) {
  // nc.request('user', '{"action":"list", "parameters":[{"uid": "'+uid+'", "limit":10, "skip":0}]}', function(response) {
    def.resolve(response);
  });

  return def.promise; 
}

module.exports.getCsp = function(csp) {
  var def = Q.defer();

  nc.request('displaycsp', '{"action":"read", "parameters":[{"cspName": "'+csp+'"}]}', function(response) {
  // nc.request('user', '{"action":"list", "parameters":[{"uid": "'+uid+'", "limit":10, "skip":0}]}', function(response) {
    def.resolve(response);
  });

  return def.promise; 
}

module.exports.getJsonForServiceName = function(service, serviceName, customerName) {
  var def = Q.defer();

  if (serviceName.slice(-1) == 's') {
    serviceName = serviceName.slice(0, -1);
  }
  // console.log(service, serviceName, customerName)
// console.log('{"action":"read", "parameters":[{"customerName":"'+customerName+'", "'+serviceName+'name": "'+service+'"}]}');
  nc.request(serviceName, '{"action":"read", "parameters":[{"customerName":"'+customerName+'", "'+serviceName+'Name": "'+service+'"}]}', function(response) {
    def.resolve(response);
  }, function(error) {
    def.reject(error);
    console.log(error);
  });

  return def.promise; 
}
