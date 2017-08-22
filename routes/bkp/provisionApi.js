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
var nc = nats.connect({'servers': servers});
var router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.get('/getRegions', function(req,res) {
  var def = Q.defer();

  var csp = req.query.csp;

  var formData = csp ? {csps: [csp]} : {};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'getcspregions';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(formData, JSON.stringify(finalJson));
  nc.request('cspregion', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      if (response.status == 'success') {
      	// console.log(response.statusMessage[0][csp]);
      	response.statusMessage[0][csp].forEach(function(data) {
      		temp.push({name: data, key: data})
      	})
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getOs', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;

  var parameters = region ? [{query: {nativeRegion: region}}] : [];
  parameters.push({pagination: false, distinct: "os"});
  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('pricingAwsEC2', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      if (response.status == 'success') {
      	response.statusMessage.forEach(function(data) {
      		temp.push({name: data, key: data})
      	})
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getImages', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;
  var os = req.query.os;

  var parameters = region ? [{query: {nativeRegion: region}}] : [];

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('awsMarketplaceImage', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
      	response.statusMessage.forEach(function(data) {
      		temp.push({name: data.name, key: data.imageId, extra: data})
      	})
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getInstanceType', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;
  var os = req.query.os;

  var parameters = (region && os) ? [{query: {os: os, nativeRegion: region}}] : [];
  parameters.push({pagination: false, distinct: "flavorName"});
  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('pricingAwsEC2', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
      	temp = response.statusMessage;
      } else {
        temp = [];
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getNetworks', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;
  var customerName = req.query.customerName;

  var parameters = (region && customerName) ? [{query: {customerName: customerName, nativeRegion: region}}] : [];
  parameters.push({pagination: false, distinct: 'vpcId'});

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('awsVPC', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
        temp = response.statusMessage;
      } else {
        temp = [];
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getSubnets', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;
  var customerName = req.query.customerName;

  var parameters = (region && customerName) ? [{query: {customerName: customerName, nativeRegion: region}}] : [];
  parameters.push({pagination: false, distinct: 'subnetId'});

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('awsSubnet', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
        temp = response.statusMessage;
      } else {
        temp = [];
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.get('/getSecurityGroups', function(req,res) {
  var def = Q.defer();

  var region = req.query.region;
  var customerName = req.query.customerName;

  var parameters = (region && customerName) ? [{query: {customerName: customerName, nativeRegion: region}}, {pagination: false}] : [{pagination: false}];

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list';
  finalJson['parameters'] = parameters;

  // console.log(JSON.stringify(finalJson));
  nc.request('awsSecurityGroup', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
        temp = response.statusMessage;
      } else {
        temp = [];
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

router.post('/virtualMachine/create', function(req,res) {
  var def = Q.defer();

  var input = req.body;
  var user = JSON.parse(req.session.user);
  var securityGroupIds = [];

  input = JSON.parse(input.reqData);

  input.blockDeviceMappings = input.imageId.blockDeviceMappings;
  input.imageId = input.imageId.imageId;

  if (input.security) {
    input.security.forEach(function(value) {
      securityGroupIds.push(value.securityGroup);
    })
  }

  input.networkInterfaces.forEach(function(value, key) {
    value.subnetId = input.subnetId;
    value.groups = securityGroupIds;
  })

  input.securityGroupIds = securityGroupIds;

  input = {nativeCsp: input.nativeCsp.toUpperCase(), resourceType: 'EC2', nativeRegion: input.region, EC2: input};
  var parameters = [{createdby: user.uid, customerName: input['EC2'].customerName, projectName: input['EC2'].projectName, accountName: input['EC2'].accountName, isActive: "yes", data: input}];
  var finalJson = {}, temp = {};
  finalJson['action'] = 'create';
  finalJson['parameters'] = parameters;

  console.log(JSON.stringify(finalJson));
  // res.json({status: "success", statusMessage: finalJson});
  // res.end();

  nc.request('myrequest', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    var temp = [];
    try {
      response = JSON.parse(response);
      // console.log(response)
      if (response.status == 'success') {
        temp = response.statusMessage;
      } else {
        temp = [];
      }
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json({status: "success", statusMessage: temp});
    res.end();
  })
})

module.exports = router;