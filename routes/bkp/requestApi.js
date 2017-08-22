'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var Q = require('q');
var apiService = require('../services/ApiService');
var requestApiService = require('../services/RequestApiService');
var userService = require('../services/UserService');
var helperService = require('../services/HelperService');
var natsClient = require('../services/NatsClient');
var formService = require('../services/FormCRUDService');
var config = require('config');

var mailer = require("nodemailer");
// Server connection
var nats = require('nats');

// Globals
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];
var servers = config.get('nats');
var router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Middleware
// router.use(apiAuthCheck);

router.get('/list', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.query;
  // var user = JSON.parse(req.session.user);
  var result = requestApiService.listRequests(input);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/comment', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.addComment(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/create', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.createRequest(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/cancel', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.cancelRequest(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/approval/list', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.query;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.listApprovalRequests(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/approval/count', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.approvalRequestCount(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/approve', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.approveRequest(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/reject', function(req, res) {
  var nc = nats.connect({'servers': servers});
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = requestApiService.rejectRequest(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

function apiAuthCheck(req, res, next) {
  if (!req.session.user) {
    res.json({status: "fail", statusMessage: "auth failed"});
    res.end();
  } else {
    next();
  }
}

// Exports
module.exports = router;