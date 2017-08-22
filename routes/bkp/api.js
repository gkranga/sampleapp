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

// Routes
router.get('/customer/:id', function(req, res) {
  var id = req.params.id;
  var def = apiService.getJsonForCustomer(id);
  def.then(function(response) {
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
});

router.get('/auth-service', function(req, res) {
  var result;
  var def = apiService.getAuthService();

  // nc.request('authService', '{"action":"read", "parameters":[{}]}', function(response) {
  //   def.resolve(response);
  // });

  def.then(function(response) {
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

router.get('/user/:id', function(req, res) {
  var id = req.params.id;
  var def = apiService.getJsonForUser(id);
  def.then(function(response) {
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
});

router.get('/testMail', function(req, res) {
  var mailResponse;
  mailResponse = helperService.sendEmail('http://'+req.headers.host+'/dashboard/verify/'+'12345', 'vignesh+123@wonderpoint.com');
      mailResponse.then(function(data) {
        res.json({status: "success", statusMessage: 'User created successfully and email sent.'});
        res.end();
      }, function(error) {
        res.json({status: "fail", statusMessage: 'Mail failed and hash digest is: 12345'});
        res.end();
      });
})

router.post('/createUser', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createUser(input, user['statusMessage']);
  var mailResponse, hashedToken;

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      hashedToken = require('crypto').createHash('md5').update(response.statusMessage).digest("hex")
      mailResponse = helperService.sendEmail('http://'+req.headers.host+'/dashboard/verify/'+hashedToken, input.uid);
      mailResponse.then(function(data) {
        res.json({status: "success", statusMessage: 'User created successfully and email sent.'});
        res.end();
      }, function(error) {
        res.json({status: "fail", statusMessage: 'Mail failed and hash digest is: '+hashedToken});
        res.end();
      });
      userService.addUserToken(input.uid, hashedToken, response.statusMessage, input.customerName);
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  });
});

router.post('/createCustomer', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createCustomer(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/createProject', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createProject(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/createAccount', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createAccount(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/createBu', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createBu(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/updateUser', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var userStructureCall = apiService.getJsonForUser(input.uid);
  var result;

  userStructureCall.then(function(userStructure) {
    userStructure = JSON.parse(userStructure);

    Object.keys(input).forEach(function(key) {
      userStructure['statusMessage'][key] = input[key];
    })

    delete userStructure['statusMessage']['_id'];

    result = formService.updateUser(userStructure['statusMessage'], user['statusMessage']);

    result.then(function(response) {
      // console.log('Nats response: ' + response);
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error('Invalid json: '+response+ ' \n Error: '+e);
      }
      if (response.status === "success") {
        req = formService.refreshUser(req);
        res.json(response);
        res.end();
      } else {
        res.json({status: "fail", statusMessage: response.statusMessage});
        res.end();
      }
    })
  })
});

router.post('/updateCustomer', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateCustomer(input, user['statusMessage']);

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
});

router.post('/updateProject', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateProject(input, user['statusMessage']);

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
});

router.post('/updateAccount', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateAccount(input, user['statusMessage']);

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
});

router.post('/updateBu', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateBu(input, user['statusMessage']);

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
});

router.post('/createCsp', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createCsp(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/updateCsp', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateCsp(input, user['statusMessage']);

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
});

router.post('/createDisplayRegion', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createDisplayRegion(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
});

router.post('/updateDisplayRegion', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.updateDisplayRegion(input, user['statusMessage']);

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
});

router.post('/tagCa', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagCa(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/tagBu', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagBu(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/tagProjectAdmin', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagProjectAdmin(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/tagProjectUser', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagProjectUser(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/tagAaRole', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagAaRole(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/tagFaRole', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.tagFaRole(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})
router.post('/untagCa', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagCa(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/untagBu', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagBu(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/untagProjectAdmin', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagProjectAdmin(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/untagProjectUser', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagProjectUser(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/untagAaRole', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagAaRole(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/untagFaRole', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagFaRole(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})


router.post('/createLdapConfig', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.createLdapConfig(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/emailValidate', function(req, res) {
  var hash = req.body.hash;
  hash = userService.getUserFromHash(hash);
  hash.then(function(dbData) {
    var response = formService.verifyToken(dbData.ip, dbData.user_id, req.body.password, dbData.customer_name);
    response.then(function(data) {
      res.json(JSON.parse(data));
      res.end();
    }, function(error) {
      res.json({status: error});
      res.end();
    })
  }) 
});

router.get('/userList/count', function(req, res) {
  var input = req.query;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var result = apiService.userList(input.customerName, user.uid);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      res.json({status: "success", customerName: input.customerName, count: response.statusMessage.length});
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.post('/verify-user-local', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var result = formService.verifyUserLocal(input);

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

router.get('/userList', function(req, res) {
  var input = req.query;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var result = apiService.userList(input.customerName, user.uid);

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

router.get('/customerList', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var result = apiService.customerList(input.customerName, user.uid);

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

router.get('/select/:customerName/customers', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];

  var result = apiService.customerList(req.params.customerName);
  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      response['statusMessage'].forEach(function(value, key) {
        if (value.isActive == 'yes') {
          var temp = {};
          temp['value'] = value['customerName'];
          temp['name'] = value['customerName'];
          finalResponse[key] = temp;
        }
      })
      res.json(finalResponse);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/select/:customerName/users', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];

  var result = apiService.userList(req.params.customerName);
  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      response['statusMessage'].forEach(function(value, key) {
        if (value.isActive == 'yes') {
          var temp = {};
          temp['value'] = value['uid'];
          temp['name'] = value['fname']+' '+value['sname'];
          finalResponse[key] = temp;
        }
      })
      res.json(finalResponse);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/select/:customerName/nativeCsps', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];

  var result = apiService.cspList(req.params.customerName);
  result.then(function(response) {
    // console.log('Nats response: ' + response);
    // response = '{"status":"success", "statusMessage":[{"aws":["us-east-1", "us-west-2", "us-west-1", "eu-west-1", "eu-central-1", "ap-southeast-1", "ap-northeast-1", "ap-southeast-2", "ap-northeast-2", "sa-east-1", "us-gov-west-1"]}]}';
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      response['statusMessage'].forEach(function(value, key) {
        Object.keys(value).forEach(function(names) {
          var temp = {};
          temp['value'] = names;
          temp['name'] = names;
          temp['nativeRegions'] = value[names];
          finalResponse.push(temp); 
        })
      })
      res.json(finalResponse);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/select/:customerName/nativeRegions', function(req, res) {
  var def = Q.defer();
  var input = req.params;
  var finalResponse = [];
  var customerName = req.params.customerName;
  var selectedDisplayCsp = req.query.csps;

  var result = apiService.cspList(customerName);
  result.then(function(response) {
    // console.log('Nats response: ' + response);
    // response = '{"status":"success", "statusMessage":[{"aws":["us-east-1", "us-west-2", "us-west-1", "eu-west-1", "eu-central-1", "ap-southeast-1", "ap-northeast-1", "ap-southeast-2", "ap-northeast-2", "sa-east-1", "us-gov-west-1"]}]}';
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      var displayCspPromise = apiService.getJsonForCustomer(customerName);
      // var displayCspPromise = apiService.getDisplayCsp(selectedDisplayCsp);
      // once the customer data is resolved proceed further
      // temp use full customer read as displaycsp read is not working
      displayCspPromise.then(function(displayCsp) {
        displayCsp = JSON.parse(displayCsp)['statusMessage']['csps'][selectedDisplayCsp];
        var selectedCsp = displayCsp['nativeCsp'];
        response['statusMessage'].forEach(function(csps) {
          if (csps[selectedCsp]) {
            selectedCsp = csps[selectedCsp];
          }
        })
        selectedCsp.forEach(function(region) {
          var temp = {};
          temp['value'] = region;
          temp['name'] = region;
          finalResponse.push(temp);
        })
        res.json(finalResponse);
        res.end();
      })
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/select/:customerName/:service', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];
  var service = req.params.service;
  var customerName = req.params.customerName;

  var completeCustomerPromise = apiService.getJsonForCustomer(customerName);
  completeCustomerPromise.then(function(completeCustomerJson) {
    completeCustomerJson = JSON.parse(completeCustomerJson);
    if (completeCustomerJson['status'] == 'success') {
      completeCustomerJson = completeCustomerJson['statusMessage'];
      if (completeCustomerJson[service]) {
        Object.keys(completeCustomerJson[service]).forEach(function(serviceName) {
          if (completeCustomerJson[service][serviceName]['isActive'] && completeCustomerJson[service][serviceName]['isActive'] == 'yes') {
            var temp = {};
            temp['value'] = serviceName;
            temp['name'] = serviceName;
            if (service == 'csps') {
              temp['nativeCsp'] = completeCustomerJson[service][serviceName]['nativeCsp'];
            }
            finalResponse.push(temp);
          }
        })
      }
    }
    res.json(finalResponse);
    res.end();
  });
})

router.get('/getService', function(req,res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];
  var service = req.query.service;
  var serviceName = req.query.serviceName;
  var customerName = req.query.customerName;

  var serviceRead = apiService.getJsonForServiceName(service, serviceName, customerName);

  serviceRead.then(function(response) {
    finalResponse = JSON.parse(response);
    res.json(finalResponse);
    res.end();
  }, function(error) {
    res.json(error);
    res.end();
  })
})

router.get('/userListCustom', function(req,res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];
  var service = req.query.service;
  var serviceName = req.query.serviceName;
  var customerName = req.query.customerName;
  var role = req.query.role;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var formData = {customerName:customerName, role:role};
  formData[service] = serviceName;
  formData['uid'] = user.uid;

  // console.log('{"action":"list", "parameters":['+JSON.stringify(formData)+']}');
  nc.request('user', '{"action":"list", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    finalResponse = JSON.parse(response);
    res.json(finalResponse);
    res.end();
  }, function(error) {
    res.json(error);
    res.end();
  })
})

router.get('/userListWithFilter', function(req,res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];
  var service = req.query.service;
  var serviceName = req.query.serviceName;
  var customerName = req.query.customerName;
  var role = req.query.role;
  var query = req.query.query;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var formData = {customerName:customerName, role:role};
  formData[service] = serviceName;
  formData['uid'] = user.uid;

  var finalJson = {}, temp = {};
  temp['pre'] = {};
  temp['pre']['data'] = formData;
  temp['pre']['query'] = JSON.parse(query);
  temp['pre']['query']['isActive'] = 'yes';
  finalJson['action'] = 'listandsearch';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(temp['pre']);
  // formData['query'] = JSON.parse(query);

    console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    finalResponse = JSON.parse(response);
    res.json(finalResponse);
    res.end();
  }, function(error) {
    res.json(error);
    res.end();
  })
})

router.get('/userServiceList', function(req,res) {
  var def = Q.defer();
  var input = req.body;
  var finalResponse = [];

  var service = req.query.service;
  var customerName = req.query.customerName;
  var uid = req.query.uid;
  var role = req.query.role || '';
  var formData = {customerName:customerName, uid: uid};

  if (service != 'accounts') {
    formData['role'] = role;
  }

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_'+service;
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    finalResponse = JSON.parse(response);
    res.json(finalResponse);
    res.end();
  }, function(error) {
    res.json(error);
    res.end();
  })
})

router.get('/customersUnderUser', function(req,res) {
  var uid = req.query.uid;
  var listAll = req.query.all || false;
  var role = req.query.role || 'ca';
  var user = JSON.parse(req.session.user)['statusMessage'];

  var customersMaster = Object.keys(user.customers);

  var def = apiService.getJsonForUser(uid);
  def.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      var customers = [];
      Object.keys(response.statusMessage.customers).forEach(function(key) {
        if (role) {
          if(response.statusMessage.customers[key].role.toLowerCase() == 'ca') {
            customers.push(key)
          }
        } else {
          customers.push(key)
        }
      })
      if (listAll) {
        res.json({status: "success", statusMessage: customers});
      } else {
        res.json({status: "success", statusMessage: helperService.intersect(customersMaster, customers)});
      }
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/customersNotUnderUser', function(req,res) {
  var uid = req.query.uid;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var role = req.query.role || 'ca';

  var customersMaster = Object.keys(user.customers);

  var def = apiService.getJsonForUser(uid);
  def.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      if (role) {
        var customers = [];
        Object.keys(response.statusMessage.customers).forEach(function(key) {
          if(response.statusMessage.customers[key].role.toLowerCase() == 'ca') {
            customers.push(key)
          }
        })
      } else {
        var customers = Object.keys(response.statusMessage.customers);
      }
      res.json({status: "success", statusMessage: helperService.getUntagged(customers, customersMaster)});
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/accountsUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var user = JSON.parse(req.session.user)['statusMessage'];

  var accountsMaster = Object.keys(user.customers[customerName].accounts);

  var formData = {customerName:customerName, uid: uid};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_accounts';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      var accounts = response.statusMessage
      res.json({status: "success", statusMessage: helperService.intersect(accountsMaster, accounts)});
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/accountsNotUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var user = JSON.parse(req.session.user)['statusMessage'];

  var accountsMaster = Object.keys(user.customers[customerName].accounts);

  var formData = {customerName:customerName, uid: uid};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_accounts';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      var accounts = response.statusMessage
      res.json({status: "success", statusMessage: helperService.getUntagged(accounts, accountsMaster)});
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/busUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var busMaster = [];
  var proceedToNext = Q.defer();

  if (user.customers[customerName].role.toLowerCase() == 'ca') {
    var customerPromise = apiService.getJsonForCustomer(customerName);
  } else {
    var customerPromiseHolder = Q.defer();
    var customerPromise = customerPromiseHolder.promise;
    customerPromiseHolder.resolve(JSON.stringify({regularFlow: true}));
  }

  customerPromise.then(function(response) {
    response = JSON.parse(response);
    if (response.regularFlow) {
      busMaster = Object.keys(user.customers[customerName].bus);
    } else {
      busMaster = Object.keys(response.statusMessage.bus)
    }
    proceedToNext.resolve();
  })

  var formData = {customerName:customerName, uid: uid};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_bus';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  proceedToNext.promise.then(function() {
    def.promise.then(function(response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error('Invalid json: '+response+ ' \n Error: '+e);
      }
      if (response.status === "success") {
        var bus = response.statusMessage
        res.json({status: "success", statusMessage: helperService.intersect(busMaster, bus)});
        res.end();
      } else {
        res.json({status: "fail", statusMessage: response.statusMessage});
        res.end();
      }
    })
  })
})

router.get('/busNotUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var user = JSON.parse(req.session.user)['statusMessage'];
  var busMaster = [];
  var proceedToNext = Q.defer();

  if (user.customers[customerName].role.toLowerCase() == 'ca') {
    var customerPromise = apiService.getJsonForCustomer(customerName);
  } else {
    var customerPromiseHolder = Q.defer();
    var customerPromise = customerPromiseHolder.promise;
    customerPromiseHolder.resolve(JSON.stringify({regularFlow: true}));
  }

  customerPromise.then(function(response) {
    response = JSON.parse(response);
    if (response.regularFlow) {
      busMaster = Object.keys(user.customers[customerName].bus);
    } else {
      busMaster = Object.keys(response.statusMessage.bus)
    }
    proceedToNext.resolve();
  })

  var formData = {customerName:customerName, uid: uid};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_bus';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  proceedToNext.promise.then(function() {
    def.promise.then(function(response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error('Invalid json: '+response+ ' \n Error: '+e);
      }
      if (response.status === "success") {
        var bus = response.statusMessage;
        res.json({status: "success", statusMessage: helperService.getUntagged(bus, busMaster)});
        res.end();
      } else {
        res.json({status: "fail", statusMessage: response.statusMessage});
        res.end();
      }
    })
  })
})

router.get('/projectsUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var user = JSON.parse(req.session.user)['statusMessage'];

  var projectsMaster = [];
  var proceedToNext = Q.defer();

  if (user.customers[customerName].role.toLowerCase() == 'ca') {
    var customerPromise = apiService.getJsonForCustomer(customerName);
  } else {
    var customerPromiseHolder = Q.defer();
    var customerPromise = customerPromiseHolder.promise;
    customerPromiseHolder.resolve(JSON.stringify({regularFlow: true}));
  }

  customerPromise.then(function(response) {
    response = JSON.parse(response);
    if (response.regularFlow) {
      projectsMaster = Object.keys(user.customers[customerName].projects);
    } else {
      projectsMaster = Object.keys(response.statusMessage.projects)
    }
    proceedToNext.resolve();
  })

  var formData = {customerName:customerName, uid: uid};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_projects';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  proceedToNext.promise.then(function() {
    def.promise.then(function(response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error('Invalid json: '+response+ ' \n Error: '+e);
      }
      if (response.status === "success") {
        var projects = response.statusMessage
        // console.log(projects, projectsMaster, 'tagged')
        res.json({status: "success", statusMessage: helperService.intersect(projectsMaster, projects)});
        res.end();
      } else {
        res.json({status: "fail", statusMessage: response.statusMessage});
        res.end();
      }
    })
  })
})

router.get('/projectsNotUnderUser', function(req,res) {
  var def = Q.defer();
  var uid = req.query.uid;
  var customerName = req.query.customerName;
  var role = req.query.role;
  var user = JSON.parse(req.session.user)['statusMessage'];

  var projectsMaster = [];
  var proceedToNext = Q.defer();

  if (user.customers[customerName].role.toLowerCase() == 'ca') {
    var customerPromise = apiService.getJsonForCustomer(customerName);
  } else {
    var customerPromiseHolder = Q.defer();
    var customerPromise = customerPromiseHolder.promise;
    customerPromiseHolder.resolve(JSON.stringify({regularFlow: true}));
  }

  customerPromise.then(function(response) {
    response = JSON.parse(response);
    if (response.regularFlow) {
      projectsMaster = Object.keys(user.customers[customerName].projects);
    } else {
      projectsMaster = Object.keys(response.statusMessage.projects)
    }
    proceedToNext.resolve();
  })

  var formData = {customerName:customerName, uid: uid, role:role};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'list_projects';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  proceedToNext.promise.then(function() {
    def.promise.then(function(response) {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error('Invalid json: '+response+ ' \n Error: '+e);
      }
      if (response.status === "success") {
        var projects = response.statusMessage
        // console.log(projects, projectsMaster, 'untagged')
        res.json({status: "success", statusMessage: helperService.getUntagged(projects, projectsMaster)});
        res.end();
      } else {
        res.json({status: "fail", statusMessage: response.statusMessage});
        res.end();
      }
    })
  })
})

router.get('/projectsUnderAccount', function(req,res) {
  var def = Q.defer();
  var customerName = req.query.customerName;
  var accountName = req.query.accountName;

  var formData = {customerName:customerName, accountName: accountName};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'listallprojects';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('account', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json(response);
    res.end();
  })
})

router.get('/projectsUnderBu', function(req,res) {
  var def = Q.defer();
  var customerName = req.query.customerName;
  var buName = req.query.buName;

  var formData = {customerName:customerName, buName: buName};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'listbuprojectnames';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('bu', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json(response);
    res.end();
  })
})

router.get('/accountAdminsUnderCustomer', function(req,res) {
  var def = Q.defer();
  var customerName = req.query.customerName;

  var formData = {customerName:customerName};

  var finalJson = {}, temp = {};
  finalJson['action'] = 'listacadminusers';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json(response);
    res.end();
  })
})

router.get('/financeAdminsUnderCustomer', function(req,res) {

    var def = Q.defer();
    var customerName = req.query.customerName;
    var user = JSON.parse(req.session.user);
    let uid = user.statusMessage.uid;

    // var formData = {customerName:customerName};

    var finalJson = {}, temp = {};
    finalJson['action'] = 'listandsearch';
    finalJson['parameters'] = [{"data":{"customerName":customerName,"role":"FA","uid":uid}, "query":{}}];
    // finalJson['parameters'].push(formData);
    console.log(finalJson);
    nc.request('user', JSON.stringify(finalJson), function(response) {
  
        def.resolve(response);
    });
    def.promise.then(function(response) {
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
        res.json(response);
        res.end();
    })
})

router.get('/get-budget-customer', function(req,res) {

    var def = Q.defer();
    var customerName = req.query.customerName;
    var budgetName = req.query.budgetName;
    var type = req.query.name;
    // var formData = {customerName:customerName};
    console.log(customerName,budgetName,type);
    var finalJson = {}, temp = {};
    finalJson['action'] = 'tagBuToBudget';
    finalJson['parameters'] = [{"data":{"customerName":"Infosys","role":"FA","uid":"vignesh.nallamad@gmail.com"}, "query":{}}];
    // finalJson['parameters'].push(formData);

    nc.request('user', JSON.stringify(finalJson), function(response) {
  
        def.resolve(response);
    });
    def.promise.then(function(response) {
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error('Invalid json: '+response+ ' \n Error: '+e);
        }
        res.json(response);
        res.end();
    })
})

router.post('/tagAcAdminAndAccount', function(req,res) {
  var def = Q.defer();

  var formData = req.body;

  formData['uids'] = JSON.parse(formData['uids'])
  formData['accountNames'] = JSON.parse(formData['accountNames'])

  var finalJson = {}, temp = {};
  finalJson['action'] = 'tagacadminandaccount';
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  // console.log(JSON.stringify(finalJson));
  nc.request('user', JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json(response);
    res.end();
  })
})

router.post('/untagAcAdminAndAccount', function(req, res) {
  var def = Q.defer();
  var input = req.body;
  var user = JSON.parse(req.session.user);
  var result = formService.untagAaRole(input, user['statusMessage']);

  result.then(function(response) {
    // console.log('Nats response: ' + response);
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    if (response.status === "success") {
      req = formService.refreshUser(req);
      res.json(response);
      res.end();
    } else {
      res.json({status: "fail", statusMessage: response.statusMessage});
      res.end();
    }
  })
})

router.get('/genericCall', function(req,res) {
  var def = Q.defer();

  var service = req.query.service;
  var formData = req.query.formData;
  formData = JSON.parse(formData);

  var finalJson = {}, temp = {};
  finalJson['action'] = req.query.action;
  finalJson['parameters'] = [];
  finalJson['parameters'].push(formData);

  console.log(formData, JSON.stringify(finalJson));
  nc.request(service, JSON.stringify(finalJson), function(response) {
    def.resolve(response);
  });

  def.promise.then(function(response) {
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error('Invalid json: '+response+ ' \n Error: '+e);
    }
    res.json(response);
    res.end();
  })
})

// Task scheduler to refresh token
// setInterval(getJsonForCustomer, 60000);

// Exports
module.exports = router;
