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

module.exports.listRequests = function(formData) {
  var result;
  var def = Q.defer();

  nc.request('myrequest', '{"action":"list", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.addComment = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('myrequest', '{"action":"comment", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.cancelRequest = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('myrequest', '{"action":"cancel", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createRequest = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('myrequest', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.listApprovalRequests = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('forapprovals', '{"action":"list", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}


module.exports.approvalRequestCount = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('forapprovals', '{"action":"count", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.approveRequest = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('forapprovals', '{"action":"approve", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.rejectRequest = function(formData, user) {
  var result;
  var def = Q.defer();

  nc.request('forapprovals', '{"action":"reject", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}