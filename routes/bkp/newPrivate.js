'use strict';

// Globals
var express = require('express');
var bodyParser = require('body-parser');
var apiService = require('../services/ApiService');
var helperService = require('../services/HelperService');
var userService = require('../services/UserService');
var resourceApiService = require('../services/resourceApiService');
var router = express.Router();
var models = require('../models/index');
var Q = require('q');
var config = require('config');
var servers = config.get('nats');
// Server connection
var nats = require('nats');
var multer = require('multer');
var upload = multer({
  dest: __dirname + '/../static/uploads/',
});
var fs = require('fs');
var ldap = require('ldapjs');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/ldap-user-login', function(req, res) {
  var resToSend = {};
  var resArray = [];
  var proceedToRender = Q.defer();

  var ldapUrl = req.body.hostname || '52.163.208.165';
  var ldapPort = req.body.port || '389';
  var ldapBasedn = req.body.basedn || 'cn=vignesh nallamad,cn=users,dc=testad,dc=com';
  var uid = req.body.uid || ldapBasedn;
  var ldapPassword = req.body.password || 'welcome!23';

  var client = ldap.createClient({
    url: 'ldap://'+ldapUrl+':'+ldapPort
  });
  
  client.bind(ldapBasedn, ldapPassword, function(err) {
    if (err) {
      console.log(err.dn, err.code, err.name, err.message);
      client.unbind();
      resToSend = {status: 'fail', statusMessage: 'failed ldap bind'};
      proceedToRender.resolve(resToSend);
    } else {
      var userPromise = apiService.getJsonForUser(uid);
      var authPromise = apiService.getAuthService();
      userPromise.then(function(userResp) {
        req.session.user = userResp;
        // console.log(req.session.user)
      })
      authPromise.then(function(authResp) {
        req.session.authService = JSON.parse(authResp)['statusMessage'];
        // console.log(req.session.authService);
      })
      Q.allSettled([userPromise, userPromise]).then(function() {
        resToSend = {status: 'success', statusMessage: 'ldap bind success'};
        proceedToRender.resolve(resToSend);
      })
    }
  });

  proceedToRender.promise.then(function(resToSend) {
    client.unbind();
    res.json(resToSend);
    res.end();
  })
})

router.get('/test', function(req, res) {
  var nc = nats.connect({'servers': servers});
  // nc.request('countApi', '{"action":"read", "parameters":[{"customerName": "test"}]}', function(response) {
    res.json({name: 'Raks', age: 22});
    res.end();
  // });
})

router.use(apiAuthCheck);

router.post('/ldap-user-search', function(req, res) {
  var resToSend = {};
  var resArray = [];
  var proceedToRender = Q.defer();

  var ldapUrl = req.body.hostname || '52.163.208.165';
  var ldapPort = req.body.port || '389';
  var ldapBasedn = req.body.basedn || 'cn=vignesh nallamad,cn=users,dc=testad,dc=com';
  var ldapPassword = req.body.password || 'welcome!23';

  var client = ldap.createClient({
    url: 'ldap://'+ldapUrl+':'+ldapPort
  });
  
  client.bind(ldapBasedn, ldapPassword, function(err) {
    if (err) {
      // console.log(err.dn, err.code, err.name, err.message);
      client.unbind();
      resToSend = {fail: 'failed ldap bind'};
      proceedToRender.resolve(resToSend);
    } else {
      var opts = {
        filter: '(|(objectclass=user)(objectclass=organizationalPerson)(objectclass=person))',
        scope: 'sub',
        attributes: ['name', 'countryCode', 'userPrincipalName', 'mail', 'cn', 'sn', 'l']
      };

      client.search('cn=Users,dc=testad,dc=com', opts, function(err, res) {
        res.on('searchEntry', function(entry) {
          // console.log('entry: ' + JSON.stringify(entry.object));
          resArray.push(entry.object);
          
        });
        res.on('searchReference', function(referral) {
          // console.log('referral: ' + referral.uris.join());
          resToSend = {
            referral: referral.uris.join()
          };
          proceedToRender.resolve(resToSend);
        });
        res.on('error', function(err) {
          // console.log('searchFailed') ;
          // console.error('error: ' + err.message);
          resToSend = {
            error: err.message
          }
          proceedToRender.resolve(resToSend);
        });
        res.on('end', function(result) {
          // console.log('End') ;
          // console.log('status: ' + result.status);
          proceedToRender.resolve(resArray);
        });
      });
    }
  });

  proceedToRender.promise.then(function(resToSend) {
    client.unbind();
    res.json(resToSend);
    res.end();
  })
})

router.get('/language', function(req, res) {
  var user = JSON.parse(req.session.user)['statusMessage'];
  var response = {};
  var lang = helperService.getLanguage();
  var userLang = user.language || 'english';
  res.json(lang[userLang]);
  res.end();
})

router.get('/tagFormat', function(req, res) {
  var response = {};
  var mapper = helperService.getTagFormat();;
  res.json(mapper);
  res.end();
})

router.get('/serviceKeyMapper', function(req, res) {
  var response = {};
  var mapper = helperService.getAdminFormat();
  res.json(mapper);
  res.end();
})

router.get('/profile', function(req, res) {
  var user = JSON.parse(req.session.user)['statusMessage'];
  res.json(user);
  res.end();
})

router.get('/sidebar', function(req, res) {
  var user = JSON.parse(req.session.user)['statusMessage'];
  var authService = req.session.authService;
  var parsedSidebar = helperService.getSidebarServiceList(user, authService);
  res.json(parsedSidebar);
  res.end();
})

router.get('/dashboardData', function(req, res) {
  try {
    var authService = req.session.authService;
    var service = 'bus';
    var user = JSON.parse(req.session.user)['statusMessage'];
    var isSWA = (user.isSWA == 'yes' || user.isSwa == 'yes') ? true : false;
    var dataWithActionsAndCustomer, finalDataWithUser, dataWithActions;
    var adminFormat = helperService.getAdminFormat();
    var proceedToRender = Q.defer();
    var proceedToNext = Q.defer();
    var completeCustomerPromiseArray = [];
    var customerUserPromiseArray = [];
    var serviceListArray;
    var dataToSend = {};

    if (isSWA) {
      dataToSend['isSwa'] = true;
      var customersPromise = helperService.getServiceDataForCustomer('servicewire', 'customers', authService, user);
      customersPromise.then(function(response) {
        var custData = JSON.parse(response);
        // get all the actions for data
        dataToSend['customers'] = helperService.getDataServiceActionList('customers', custData['statusMessage'], authService, isSWA);
      })

      var userPromise = apiService.userList('servicewire', user['uid']);
      userPromise.then(function(response) {
        var userData = JSON.parse(response);
        // get all the actions for data
        dataToSend['users'] = helperService.getDataServiceActionList('users', userData['statusMessage'], authService, isSWA);
      })

      Q.allSettled([customersPromise, userPromise]).then(function() {
        proceedToRender.resolve();
      })
    } else {
      // get the customer detailed info from customer read
      // if the customer data is already available in session just resolve the promise else pull the data from customer read api
      Object.keys(user.customers).forEach(function(customerName) {
      	completeCustomerPromiseArray.push(apiService.getJsonForCustomer(customerName));
      })

      // once the customer data is resolved proceed further
      Q.allSettled(completeCustomerPromiseArray).then(function(results) {
        results.forEach(function(result) {
  	      var completeCustomerJson = JSON.parse(result.value)['statusMessage'];
  	      var customerName = completeCustomerJson.customerName;
  	      // if user is a CA he should be able to see everything
  	      if (user['customers'][customerName]['role'] == 'CA') {
  	        serviceListArray = helperService.parseJsonToBuildOrg(completeCustomerJson, user['customers'][customerName], authService, service, true, true);
  	      } else {
  	        serviceListArray = helperService.parseJsonToBuildOrg(completeCustomerJson, user['customers'][customerName], authService, service, false, true);
  	      }
          serviceListArray['customers'] = getSingleLevelCustomerData(completeCustomerJson);
        	dataToSend[customerName] = serviceListArray;
          // console.log('dashhhhh', dataToSend);
          customerUserPromiseArray.push(apiService.userListObject(customerName, user.uid));
      	})
        Q.allSettled(customerUserPromiseArray).then(function(results) {
          results.forEach(function(result) {
            dataToSend[result.value.customerName]['users'] = result.value.statusMessage;
          })
          proceedToRender.resolve();
        })
        // proceedToRender.resolve();
      })
    }

    proceedToRender.promise.then(function() {
      res.json(dataToSend);
      res.end();
    }, function() {
      res.json({status: 'fail'});
      res.end();
    })
  } catch(e) {
    res.json({status: 'fail'});
    res.end();
  }
})


router.get('/resourceData', function(req, res) {
  var user = JSON.parse(req.session.user)['statusMessage'];
  var authService = req.session.authService;
  var parsedSidebar = helperService.getSidebarServiceList(user, authService);
  var proceedToRender = Q.defer();
  var serviceNames = [];
  var deferred = Q.defer();
  var resource = [];
  var Customername = req.query.customer;
  var result = resourceApiService.listResourceCount(Customername);
  result.then(function(response) {
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
      res.json(response);
      res.end();
    });
})

function apiAuthCheck(req, res, next) {
  if (!req.session.user) {
    res.json({status: "fail", statusMessage: "auth failed"});
    res.end();
  } else {
    next();
  }
}

function getSingleLevelCustomerData(customer) {
  return [{
    customerCity: customer.customerCity,
    customerCountry: customer.customerCountry,
    customerEmail: customer.customerEmail,
    customerName: customer.customerName,
    customerPhone: customer.customerPhone,
    isActive: customer.isActive,
    createdUser: customer.createdUser,
    customerAddress1: customer.customerAddress1,
    customerAddress2: customer.customerAddress2,
    customerState: customer.customerState,
    customerZip: customer.customerZip
  }];
}

// Exports
module.exports = router;