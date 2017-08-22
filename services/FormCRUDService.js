'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var Q = require('q');

// Server connection
var nats = require('nats');
var apiService = require('./ApiService');

// Globals
var config = require('config');
var servers = config.get('nats');
var nc = nats.connect({'servers': servers});
// var servers = ['nats://ec2-54-254-224-248.ap-southeast-1.compute.amazonaws.com:4222'];

// All the create functions
module.exports.createUser = function(formData, user) {
  var def = Q.defer();

  if (user.isSwa == 'yes') {
    nc.request('user', '{"action":"create", "parameters":[{"uid":"'+formData.uid+'", "fname":"'+formData.fname+'", "isActive":"'+formData.isActive+'", "sname":"'+formData.sname+'", "createdUser": "'+user.uid+'", "isLocal": "'+(formData.isLocal || 'yes')+'", "userAddress":"'+formData.userAddress+'", "userCity":"'+formData.userCity+'", "userCountry":"'+formData.userCountry+'", "userZip":"'+formData.userZip+'", "userPhone":"'+formData.userPhone+'"}]}', function(response) {

      def.resolve(response);
    });
  } else {
    nc.request('user', '{"action":"create", "parameters":[{"uid":"'+formData.uid+'", "fname":"'+formData.fname+'", "isActive":"'+formData.isActive+'", "sname":"'+formData.sname+'", "createdUser": "'+user.uid+'", "userAddress":"'+formData.userAddress+'", "customerName": "'+formData.customerName+'", "isLocal": "'+(formData.isLocal || 'yes')+'", "userCity":"'+formData.userCity+'", "userCountry":"'+formData.userCountry+'", "userZip":"'+formData.userZip+'", "userPhone":"'+formData.userPhone+'"}]}', function(response) {

      def.resolve(response);
    });
  }

  return def.promise;
}

module.exports.createCustomer = function(formData, user) {
  var def = Q.defer(); 
  // console.log(user);
  nc.request('customer', '{"action":"create", "parameters":[{"createdUser":"'+user.uid+'", "customerName":"'+formData.customerName+'","isAuthenticated":"1", "isGlobalAuthorized":"1", "customerAddress1": "'+formData.customerAddress1+'", "customerAddress2": "'+formData.customerAddress2+'", "customerCity":"'+formData.customerCity+'", "customerState":"'+formData.customerState+'","customerCountry":"'+formData.customerCountry+'", "customerZip":"'+formData.customerZip+'", "customerEmail":"'+formData.customerEmail+'", "customerPhone":"'+formData.customerPhone+'","isActive": "'+ (formData.isActive || 'no') +'"}]}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createProject = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  nc.request('project', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createAccount = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  nc.request('account', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createBu = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  nc.request('bu', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

//All the Update functions
module.exports.updateUser = function(formData, user) {
  var def = Q.defer();
  if (formData['customers']) {
    delete formData['customers'];
  }
  // nc.request('user', '{"action":"update", "parameters":[{"uid":"'+formData.uid+'", "fname":"'+formData.fname+'", "isActive":"'+formData.isActive+'", "sname":"'+formData.sname+'", "createdUser": "'+user.uid+'", "isLocal": "yes", "userAddress":"'+formData.userAddress+'", "userCity":"'+formData.userCity+'", "userCountry":"'+formData.userCountry+'", "userZip":"'+formData.userZip+'", "userPhone":"'+formData.userPhone+'"}]}', function(response) {
  nc.request('user', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateCustomer = function(formData, user) {
  var def = Q.defer();

  if (formData['projects']) {
    delete formData['projects'];
  }

  if (formData['bus']) {
    delete formData['bus'];
  }

  if (formData['accounts']) {
    delete formData['accounts'];
  }

  if (formData['csps']) {
    delete formData['csps'];
  }

  nc.request('customer', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateProject = function(formData, user) {
  var def = Q.defer();

  nc.request('project', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateAccount = function(formData, user) {
  var def = Q.defer();
  if (formData['projects']) {
    delete formData['projects'];
  }
  if (formData['projectNames']) {
    delete formData['projectNames'];
  }
// console.log(JSON.stringify(formData));
  nc.request('account', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateBu = function(formData, user) {
  var def = Q.defer();
  if (formData['projects']) {
    delete formData['projects'];
  }
  if (formData['projectNames']) {
    delete formData['projectNames'];
  }
  nc.request('bu', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createCsp = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  formData['isEditable'] = 'yes';
  if (formData['regions'] == 'undefined') {
    delete formData['regions'];
  }
  if (formData['regions']) {
    formData['regions'] = JSON.parse(formData['regions']);
  }
  nc.request('csp', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateCsp = function(formData, user) {
  var def = Q.defer();
  formData['isEditable'] = 'yes';
  if (formData['regions']) {
    formData['regions'] = JSON.parse(formData['regions']);
  }

  nc.request('csp', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createRegion = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  nc.request('region', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.updateRegion = function(formData, user) {
  var def = Q.defer();

  nc.request('region', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.createLdapConfig = function(formData, user) {
  var def = Q.defer();
  formData['createdUser'] = user.uid;
  nc.request('ldapconfig', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.verifyUserLocal = function(formData) {
  var result;
  var def = Q.defer();

  nc.request('user', '{"action":"userislocal", "parameters":['+JSON.stringify(formData)+']}', function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagCa = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagcustomeradmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['customerNames'] = JSON.parse(formData['customerNames'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagBu = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagbuadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['buNames'] = JSON.parse(formData['buNames'])
  json['parameters'].push(formData); console.log(JSON.stringify(json));

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagProjectAdmin = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagprojectadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['projectNames'] = JSON.parse(formData['projectNames'])
  json['parameters'].push(formData);

  // nc.request('user', '{"action":"tagprojectadmin", "parameters":['+formData+']}', function(response) {
  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagProjectUser = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagprojectuser';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['projectNames'] = JSON.parse(formData['projectNames'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagAaRole = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagacadminrole';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.tagFaRole = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'tagfinancialadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}
module.exports.untagCa = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagcustomeradmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['customerNames'] = JSON.parse(formData['customerNames'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.untagBu = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagbuadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['buNames'] = JSON.parse(formData['buNames'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.untagProjectAdmin = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagprojectadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['projectNames'] = JSON.parse(formData['projectNames'])
  json['parameters'].push(formData);

  // nc.request('user', '{"action":"tagprojectadmin", "parameters":['+formData+']}', function(response) {
  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.untagProjectUser = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagprojectuser';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  formData['projectNames'] = JSON.parse(formData['projectNames'])
  json['parameters'].push(formData);

  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.untagFaRole = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagfinancialadmin';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  if (formData['accountNames']) {
    formData['accountNames'] = JSON.parse(formData['accountNames'])
  }
  json['parameters'].push(formData);
  // console.log(JSON.stringify(json));
  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}
module.exports.untagAaRole = function(formData, user) {
  var def = Q.defer();

  var json = {};
  json['action'] = 'untagacadminrole';
  json['parameters'] = [];
  formData['uids'] = JSON.parse(formData['uids'])
  if (formData['accountNames']) {
    formData['accountNames'] = JSON.parse(formData['accountNames'])
  }
  json['parameters'].push(formData);
  // console.log(JSON.stringify(json));
  nc.request('user', JSON.stringify(json), function(response) {
    def.resolve(response);
  });

  return def.promise;
}

module.exports.verifyToken = function(userToken, email, password, customerName) {
  var def = Q.defer();

  nc.request('user', '{"action":"emailvalidate", "parameters":[{"uid":"'+email+'", "hashDigest":"'+userToken+'", "customerName":"'+customerName+'", "password":"'+password+'"}]}', function(response) {
    def.resolve(response);
  });

  return def.promise; 
}

module.exports.refreshUser = function(req) {
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
    }
    return req;
  })
}