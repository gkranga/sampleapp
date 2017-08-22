'use strict';

// Globals
var express = require('express');
var bodyParser = require('body-parser');
var apiService = require('../services/ApiService');
var helperService = require('../services/HelperService');
var userService = require('../services/UserService');
var router = express.Router();
var models = require('../models/index');
var Q = require('q');
var config = require('config');
var servers = config.get('nats');
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];
// Server connection
var nats = require('nats');
var multer = require('multer');
var upload = multer({
  dest: __dirname + '/../static/uploads/',
});
var fs = require('fs');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

// auth before filter
router.post('/auth', function(req, res) {
  var uid = req.body.uid;
  var password = req.body.password;
  var name = req.body.name;
  var user, authCheck, authKey, authService, authResponse;
  var credentials = { uid: uid, password: password };
  
  var nc = nats.connect({'servers': servers});

  nc.request('user', '{"action":"authenticate", "parameters":[{ "uid": "'+uid.toLowerCase()+'", "password": "'+password+'", "customername": "'+name+'" }]}', function(response) {
    // console.log('Nats auth response: ' + response);
    try {
      authResponse = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+authResponse+ ' \n Error: '+e);
    }
    if (authResponse.status === "success") {
      authKey = userService.getUserAuthKey();
      // user = userService.addUserToken(uid, authKey, req.ip);
      // console.log('created user');
      req.session.user = JSON.stringify(authResponse);
      var def = apiService.getAuthService();
      def.then(function(response) {
      
        try {
          authService = JSON.parse(response)['statusMessage'];
        } catch (e) {
          console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
        req.session.authService = authService;
        res.json(authResponse);
        res.end();
      });
    //# resource count to session 
      // var user = JSON.parse(req.session.user)['statusMessage'];
      // var authService = req.session.authService;
      // var parsedSidebar = helperService.getSidebarServiceList(user, authService);
      // var Customername  = (parsedSidebar[0].name)?parsedSidebar[0].name:"Cust1";
      // var proceedToRender = Q.defer();
      // var resourceCount =  resourceApiService.listResourceCount(Customername);
      //   console.log(Customername);
      // resourceCount.then(function(response) {
      //   try {
      //     console.log(response);
      //     authService = JSON.parse(response)['statusMessage'];
      //   } catch (e) {
      //     console.error('Invalid json: '+response+ ' \n Error: '+e);
      //   }
      //   req.session.resourceCount = authService;
      //   res.json(authResponse);
      //   res.end();
      // });
    } else {
      res.json({status: "fail"});
      res.end();
    }
  });
});

router.get('/verify/:key', function(req, res) {
  var moment = require('moment');
  var key = req.params.key;
  var user = userService.getUserFromHash(key);
  var partials = {
                scripts : 'scripts.html',
                head: 'head.html',
                login: 'login.html'
             };
  user.then(function(result) {
    if (result) {
      var lastUpdate = moment(new Date(result.updatedAt));
      var diff = moment().diff(lastUpdate, 'hours');
      if (diff <= 3) {
        res.render('verify', { partials: partials, title: 'ServiceWire - Login', success: true, hash: key});
      } else {
        res.render('verify', { partials: partials, title: 'ServiceWire - Login', success: false});
      }
    } else {
      res.render('verify', { partials: partials, title: 'ServiceWire - Login', success: false});
    }
  })
  // res.end();
})

// Middleware
router.use(apiAuthCheck);

// Routes

// post form to nats
router.post('/forms/:action', function(req, res) {
  var formAction = req.params.action;
  var formData = req.body;
  var result = apiService.sendFormData(formAction, formData);
  res.json(result);
  res.end();
});

// get actions allowed for user
router.get('/user-actions/:service/:role', function(req, res) {
  var role = req.params.role || '';
  var user = JSON.parse(req.session.user)['statusMessage'];
  var authService = req.session.authService;
  var isSwa = user.isSwa || user.isSWA || '';
  if (isSwa.toLowerCase() == 'yes') {
    role = 'swa';
  }
  res.json(helperService.getUserActions(authService, req.params.service, role));
  res.end();
});

router.get('/details/:customerName/:service', function(req, res) {
  try {
    var customerName = req.params.customerName;
    var service = req.params.service;
    var authService = req.session.authService;
    var user = JSON.parse(req.session.user)['statusMessage'];
    var isSWA = (user.isSWA == 'yes' || user.isSwa == 'yes') ? true : false;
    var data = helperService.getServiceDataForCustomer(customerName, service, authService, user);
    var dataWithActions = helperService.getDataServiceActionList(service, data, authService, isSWA);
    res.render('tablePartialNew', { 'data': dataWithActions, 'service':service, 'helper': helperService });
  } catch(e) {
    res.json({status: 'fail'});
    res.end()
  }
});

router.get('/data/:customerName/:service', function(req, res) {
  try {
    var customerName = req.params.customerName;
    var service = req.params.service;
    var authService = req.session.authService;
    var user = JSON.parse(req.session.user)['statusMessage'];
    var isSWA = (user.isSWA == 'yes' || user.isSwa == 'yes') ? true : false;
    var dataWithActionsAndCustomer, finalDataWithUser, dataWithActions;
    var adminFormat = helperService.getAdminFormat();
    var proceedToRender = Q.defer();
    var proceedToNext = Q.defer();

    // manage the data to be sent out to swa user
    if (isSWA) {
      // if the logged in user is swa and data for service asked is customer, then return him directly the customer listing
      if (service == 'customers') {
        var data = helperService.getServiceDataForCustomer(customerName, service, authService, user);
        data.then(function(response) {
          var custData = JSON.parse(response);
          // get all the actions for data
          dataWithActions = helperService.getDataServiceActionList(service, custData['statusMessage'], authService, isSWA);
          proceedToRender.resolve();
        })
      }

      // if the logged in user is swa and the data for service asked is user, then return directly the user listing
      if (service == 'users') {
        var def1 = apiService.userList(customerName, user['uid']);
        def1.then(function(response) {
          var userData = JSON.parse(response);
          // get all the actions for data
          dataWithActions = helperService.getDataServiceActionList(service, userData['statusMessage'], authService, isSWA);
          proceedToRender.resolve();
        })
      }

      // once we get all the required data, render the table
      proceedToRender.promise.then(function() {
        res.render('tablePartialNew', { 'data': dataWithActions, 'service':service, 'helper': helperService, adminFormat: adminFormat });
        res.end();
      }, function() {
        res.json({status: 'fail'});
        res.end();
      })
    // for non swa users
    } else {
      // get the customer detailed info from customer read
      // if the customer data is already available in session just resolve the promise else pull the data from customer read api
      var completeCustomerPromise = apiService.getJsonForCustomer(customerName);

      // once the customer data is resolved proceed further
      completeCustomerPromise.then(function(completeCustomerJson) {
        completeCustomerJson = JSON.parse(completeCustomerJson)['statusMessage'];
        if (service == 'users') {
          var def1 = apiService.userList(customerName, user['uid']);
          def1.then(function(response) {
            var userData = JSON.parse(response)['statusMessage'];
            var userRelatedActions = helperService.getUserActionList(user, authService);
            userData.forEach(function(userList) {
              // userList.role = user.customers[customerName].role;
              // if (user.customers[customerName].ifAcAdmin != undefined && user.customers[customerName].ifAcAdmin == 'yes') {
              //   userList.role = 'AA';
              // }
              userList['actions'] = userRelatedActions[0]['actionList'];
            });
            // dataWithActions = helperService.getDataServiceActionList(service, userData, authService, false);
            dataWithActions = userData;
            proceedToRender.resolve();
          })
        } else if (service == 'customers') {
          if (customerName != 'servicewire') {
            var custArray = [];
            completeCustomerJson.role = user.customers[customerName].role;
            if (user.customers[customerName].ifAcAdmin != undefined && user.customers[customerName].ifAcAdmin == 'yes') {
              completeCustomerJson.role = 'AA';
            }
            custArray.push(completeCustomerJson);
            // get all the actions for data
            dataWithActions = helperService.getDataServiceActionList(service, custArray, authService, false);
            proceedToRender.resolve();
          } else {
            dataWithActions = [];
            dataWithActionsAndCustomer = [];
            proceedToRender.resolve();
          }
        } else {
          var serviceListArray = [];
          var serviceListJson = user['customers'][customerName][service];
          // if user is a CA he should be able to see everything
          if (user['customers'][customerName]['role'] == 'CA') {
            serviceListArray = helperService.parseJsonToBuildOrg(completeCustomerJson, user['customers'][customerName], authService, service, true, false);
          } else {
            serviceListArray = helperService.parseJsonToBuildOrg(completeCustomerJson, user['customers'][customerName], authService, service, false, false);
          }
          dataWithActions = helperService.getDataServiceActionList(service, serviceListArray, authService, false);
          proceedToRender.resolve();
        }
      })

      proceedToRender.promise.then(function() {
        res.render('tablePartialNew', { 'data': dataWithActions, 'service':service, 'helper': helperService, adminFormat: adminFormat });
        res.end();
      }, function() {
        res.json({status: 'fail'});
        res.end();
      })
    }
  } catch(e) {
    res.render('tablePartialNew', { 'data': [], 'service':service, 'helper': helperService, adminFormat: adminFormat });
    res.end();
  }
})

router.get('/test', function(req, res) {
  res.send(req.headers.host);
})

router.get('/refresh', function(req, res) {
  var id = JSON.parse(req.session.user)['statusMessage']['uid'];
  var def = apiService.getJsonForUser(id);
  def.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req.session.user = JSON.stringify(response);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/image', upload.single('avatar'), function(req, res) {
  var id = JSON.parse(req.session.user)['statusMessage']['uid'];
  var image = req.file;
  fs.rename(image.path, image.destination+id, function (err) {
    if (err) throw err;
  });
  res.json({status: "success", statusMessage: "image saved", src: "/static/uploads/"+id});
  res.end();
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
