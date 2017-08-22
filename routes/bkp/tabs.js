'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var Q = require('q');
var apiService = require('../services/ApiService');
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

router.use(apiAuthCheck);


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