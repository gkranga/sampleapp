'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var apiService = require('../services/ApiService');
var mailer = require("nodemailer");
var mg = require('nodemailer-mailgun-transport');
var Q = require('q');
var config = require('config');

module.exports.getUserActions = function(authService, service, role) {
	var userActionList, permittedService = [];
  userActionList = authService['adminServices'][service]['actions'];
  Object.keys(userActionList).forEach(function(newKey) {
  	if (userActionList[newKey].indexOf(role) >= 0 || userActionList[newKey].indexOf(role.toLowerCase()) >= 0) {
			permittedService.push(newKey);
		}
  });
  return permittedService;
}

module.exports.sendEmailOld = function(link, email) {
	var def = Q.defer();
  var smtpConfig = {
    host: config.get('host'),
    port: config.get('port'),
    secure: config.get('ssl') || false, // use SSL
    auth: {
      user: config.get('username'),
      pass: config.get('password')
    }
  };
  // var smtpTransport = mailer.createTransport("smtps://vignesh.nallamad%40gmail.com:prateek2612@smtp.gmail.com");
	var smtpTransport = mailer.createTransport(smtpConfig);

	var mail = {
    from: "Vignesh NALLAMAD <vignesh.nallamad@gmail.com>",
    to: email,
    subject: "ServiceWire Verification Email",
    html: "<b>Verification link is <a href='"+link+"'>here.</a></b>"
	}

	smtpTransport.sendMail(mail, function(error, response){
    if(error){
      // console.log(error);
      def.reject(error);
    } else {
      // console.log("Message sent: " + response.response);
    	def.resolve(response);
    }
    
    smtpTransport.close();
	});

	return def.promise;
}

module.exports.sendEmail = function(link, email) {
  var def = Q.defer();
  
  var auth = {
    auth: {
      api_key: config.get('api_key'),
      domain: config.get('domain')
    }
  }

  var nodemailerMailgun = mailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail({
    from: config.get('username'),
    to: email,
    subject: "ServiceWire Verification Email",
    html: "<b>Verification link is <a href='"+link+"'>here.</a></b>"
  }, function (error, response) {
    if (error) {
      console.log(error);
      def.reject(error);
    }
    else {
      // console.log("Message sent: ", response);
      def.resolve(response);
    }
  });

  return def.promise;
}

module.exports.getServiceDataForCustomer = function(customerName, service, authService, user) {
	var filteredArray;
  if (service == 'customers') {
    if (user.isSwa == 'yes' || user.isSWA == 'yes') {
      return apiService.customerList(customerName, user.uid);
    } else {
      filteredArray = user.customers;
      return filteredArray;
    }
  }
  filteredArray = filterJson('customerName', customerName, user.customers);
	var final = [];
	filteredArray.forEach(function(value, key) {
		final = final.concat(value[service]);
	});
	return final;
}

module.exports.getDataServiceActionList = function(service, data, authService, isSWA) {
	var final;
	data.forEach(function(value, key) {
    var role = isSWA ? 'SWA' : value.role;
		data[key]['actions'] = module.exports.getUserActions(authService, service, role);
	});
	return data;
}

module.exports.getSidebarServiceList = function(user, authService) {
  var allRoles, allServiceAccess, result = [];
  try {
    if (user.customers != undefined) {
      Object.keys(user.customers).forEach(function(customer) {
        if (typeof user.customers[customer] == 'object') {
          var customerName = customer;
          customer = user.customers[customer];
          allRoles = getAllRolesOfCustomer(customer);

          if ((user.isSWA && user.isSWA == 'yes') || (user.isSwa && user.isSwa == 'yes')) {
            allRoles.push('SWA');
          }
          if (customer.isAcAdmin != undefined && customer.isAcAdmin == 'yes' && allRoles.indexOf('AA') == -1) {
            allRoles.push('AA');
          }
          if (customer.isFa != undefined && customer.isFa == 'yes' && allRoles.indexOf('FA') == -1) {
              allRoles.push('FA');
          }
          allServiceAccess = getAllServiceOfCustomer(authService, allRoles);
          result.push({name: customerName, service: allServiceAccess['service'], role: allRoles, actionList: allServiceAccess['actionList'] });
        }
      });
    } else {
      return [];
    }
  } catch (e) {
    return {status: 'fail'};
  }
  return result;
}

module.exports.getUserActionList = function(user, authService) {
  var allRoles, allServiceAccess, result = [];
  try {
    if (user.customers != undefined) {
      Object.keys(user.customers).forEach(function(customer) {
        var customerName = customer;
        customer = user.customers[customer];
        allRoles = getAllRolesOfCustomer(customer);
        if ((user.isSWA && user.isSWA == 'yes') || (user.isSwa && user.isSwa == 'yes')) {
          allRoles.push('SWA');
        }
        if (customer.isAcAdmin != undefined && customer.isAcAdmin == 'yes' && allRoles.indexOf('AA') == -1) {
          allRoles.push('AA');
        }
        allServiceAccess = getAllServiceOfCustomer({adminServices: { users: authService['adminServices']['users'] }}, allRoles);
        result.push({name: customerName, service: allServiceAccess['service'], role: allRoles, actionList: allServiceAccess['actionList'] });
      });
      // console.log(result);
    } else {
      return [];
     }
  } catch (e) {
    return [];
  }
  return result;
}

module.exports.mergeCustomerData = function(customer, customerDetails) {
  return customer;
}

module.exports.keyActualNames = keyActualNames;

function getAllRolesOfCustomer(customer) {
  var result = [];
  Object.keys(customer).forEach(function(customerKey) {
    if (typeof customer[customerKey] == 'object') {
      Object.keys(customer[customerKey]).forEach(function(service) {
        Object.keys(customer[customerKey][service]).forEach(function(jsonKeys) {
          if ((jsonKeys.toLowerCase().indexOf('role') != -1) && (result.indexOf(customer[customerKey][service][jsonKeys]) == -1)) {
            result.push(customer[customerKey][service][jsonKeys]);
          }
        })
      })
    }
  });
  if (customer.role != undefined && result.indexOf(customer.role) == -1 && customer.role != '') {
    result.push(customer.role);
  }
  if (customer.ifAcAdmin != undefined && customer.ifAcAdmin == 'yes' && result.indexOf('AA') == -1) {
    result.push('AA');
  }
  return result;
}

function getAllServiceOfCustomer(authService, allRoles) {
  var final = [], result = [], authServiceIndividual = {}, service = {}, actionList = {};
  Object.keys(authService).forEach(function(serviceKey) {
    if (serviceKey != '_id') {
      authServiceIndividual = authService[serviceKey];
      if (authServiceIndividual != null) {
        Object.keys(authServiceIndividual).forEach(function(authKeys) {
          allRoles.forEach(function(role) {
            if (authServiceIndividual[authKeys]['roles'].indexOf(role.toLowerCase()) != -1) {
              if (final.indexOf(authKeys) == -1) {
                final.push(authKeys);
              }
              var actions = authServiceIndividual[authKeys]['actions'];
              Object.keys(actions).forEach(function(action) {
                if ((actions[action].indexOf(role.toLowerCase()) != -1) && (result.indexOf(action) == -1)) {
                  result.push(action);
                }
              })
            }
          })
        })
      }
      service[serviceKey] = final;
      actionList[serviceKey] = result;
      final = [];
      result = [];
    }
  })
  return {service: service, actionList: actionList};
}

module.exports.parseJsonToBuildOrg = function(completeCustomerDetails, userJson, authService, serviceReq, isCA, fullList) {
  var onlyServices = ['bus', 'projects', 'accounts', 'csps'];
  var servicesWithKeys = '{ "bus" : [ "buNames", "buName" ],'+
    '"projects" : [ "projectNames", "projectName" ],'+
    '"accounts" : [ "accountNames", "accountName" ],'+
    '"csps" : [ "cspNames", "cspName" ],'+
    '"myRequests" : [ "myRequests", "myRequest" ],'+
    '"forApprovals" : [ "forApprovals", "forApproval" ],'+
    '"displayRegions" : [ "displayRegionNames", "displayRegionName" ] }';
  var serviceAndRoles = {};
  var dataToReturn = [];

  servicesWithKeys = JSON.parse(servicesWithKeys);

  var result = {};
  onlyServices.forEach(function(service) {
    result[service] = [];
  })

  Object.keys(onlyServices).forEach(function(service) {
    service = onlyServices[service];

    // if CA there will be no entry inside the user json so just list the service names directly
    // if AA even then there is no restriction
    if (isCA || userJson['ifAcAdmin'] == 'yes') {
      var role = isCA ? 'ca' : 'aa';
      // check if role has read permission for the service
      var permission = authService['adminServices'][service]['actions'][keyActualNames(service, 'read')].indexOf(role);
      if (permission != -1) {
        // if permitted add it to list
        if (completeCustomerDetails[service]) {
          Object.keys(completeCustomerDetails[service]).forEach(function(data) {
            result[service].push(data);
            serviceAndRoles[data] = role;
          });
        }
      }
    } else if ((['csps'].indexOf(service) == -1) && userJson[service] && Object.keys(userJson[service]).length) {

      Object.keys(userJson[service]).forEach(function(data) {
        result[service].push(data);
        serviceAndRoles[data] = userJson[service][data]['role'].toLowerCase();
      })

      Object.keys(result[service]).forEach(function(serviceName) {
        serviceName = result[service][serviceName];
        var roleInUser = userJson[service][serviceName]['role'].toLowerCase();
        var serviceData = completeCustomerDetails[service][serviceName];

        Object.keys(servicesWithKeys).forEach(function(nameHolders) {
          var unqServiceNameSingular = servicesWithKeys[nameHolders][1];
          var unqServiceNamePlural = servicesWithKeys[nameHolders][0];
          var permission = authService['adminServices'][service]['actions'][keyActualNames(service, 'read')].indexOf(roleInUser);
          if (permission != -1) {
            if (serviceData && serviceData[unqServiceNameSingular] && (result[nameHolders].indexOf(serviceData[unqServiceNameSingular]) == -1)) {
              result[nameHolders].push(serviceData[unqServiceNameSingular]);
              serviceAndRoles[serviceData[unqServiceNameSingular]] = roleInUser;
            }

            if (serviceData && serviceData[unqServiceNamePlural]) {
              serviceData[unqServiceNamePlural].forEach(function(data) {
                if (result[nameHolders].indexOf(data) == -1) {
                  result[nameHolders].push(data);
                  serviceAndRoles[data] = roleInUser;
                }
                if (service == 'accounts' && unqServiceNamePlural == 'projectNames') {
                  var projectBuName = completeCustomerDetails['projects'][data]['buName'] || '';
                  if (result['bus'].indexOf(completeCustomerDetails['bus'][projectBuName]) == -1) {
                    result['bus'].push(projectBuName);
                    serviceAndRoles[projectBuName] = roleInUser;
                  }
                }
              })
            }
          }
        })
      })
    } else if ((service == 'csps') && completeCustomerDetails[service]) {
      Object.keys(completeCustomerDetails[service]).forEach(function(data) {
        if (result[service].indexOf(data) == -1) {
          result[service].push(data);
          serviceAndRoles[data] = 'BUA';
        }
      });
    }
  })
  // console.log(result, serviceAndRoles);
  if (fullList) {
    var finalDataToReturn = {};
    // return full data
    Object.keys(result).forEach(function(serviceReq) {
      result[serviceReq].forEach(function(finalData) {
        var temp = completeCustomerDetails[serviceReq][finalData];
        temp['role'] = serviceAndRoles[finalData];
        if (finalDataToReturn[serviceReq] == undefined) {
          finalDataToReturn[serviceReq] = [];
        }
        finalDataToReturn[serviceReq].push(temp);
      })
    })
    return finalDataToReturn;
  } else {
    // return data of the selected service only
    result[serviceReq].forEach(function(finalData) {
      var temp = completeCustomerDetails[serviceReq][finalData];
      temp['role'] = serviceAndRoles[finalData];
      dataToReturn.push(temp);
    })
    return dataToReturn;
  }
  // Object.keys($userJson[])
}

function keyActualNames(service, key) {
    var name = '';
    switch (service) {
      case 'bus' :
        if (key == 'roles') {
          name = 'buRole';
        } else if (key == 'name') {
          name = 'buName';
        } else if (key == 'read') {
          name = 'readBu';
        }
        break;
      case 'customers' :
        if (key == 'roles') {
          name = 'customerRole';
        } else if (key == 'name') {
          name = 'customerName';
        } else if (key == 'read') {
          name = 'readCustomer';
        }
        break;
      case 'projects' :
        if (key == 'roles') {
          name = 'projectRole';
        } else if (key == 'name') {
          name = 'projectName';
        } else if (key == 'read') {
          name = 'readProject';
        }
        break;
      case 'accounts' :
        if (key == 'roles') {
          name = 'accountRole';
        } else if (key == 'name') {
          name = 'accountName';
        } else if (key == 'read') {
          name = 'readAccount';
        }
        break;
      case 'users' :
        if (key == 'roles') {
          name = 'userRole';
        } else if (key == 'name') {
          name = 'userName';
        } else if (key == 'read') {
          name = 'readUser';
        }
        break;
      case 'csps' :
        if (key == 'roles') {
          name = 'cspRole';
        } else if (key == 'name') {
          name = 'cspName';
        } else if (key == 'read') {
          name = 'readCsp';
        }
        break;
      case 'displayRegions' :
        if (key == 'roles') {
          name = 'displayRegionRole';
        } else if (key == 'name') {
          name = 'displayRegionName';
        } else if (key == 'read') {
          name = 'readDisplayRegion';
        }
        break;
      case 'myRequests' :
        if (key == 'roles') {
          name = 'myRequestRole';
        } else if (key == 'name') {
          name = 'myRequestName';
        } else if (key == 'read') {
          name = 'readMyRequest';
        }
        break;
      case 'forApprovals' :
        if (key == 'roles') {
          name = 'forApprovalRole';
        } else if (key == 'name') {
          name = 'forApprovalName';
        } else if (key == 'read') {
          name = 'readForApprovals';
        }
        break;
      default: name = '';
    }
    return name;
  }

function filterJson(key, value, arrayOfJson) {
	var filteredArray = arrayOfJson.filter(function(v){ return v[key] == value; });
	return filteredArray;
}

module.exports.getAdminFormat = function() {
  var path = __dirname +'/../static/jsons/adminFormat.json';
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {error: 'no data found'};
  }
}

module.exports.getTagFormat = function() {
  var path = __dirname +'/../static/jsons/tagFormat.json';
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {error: 'no data found'};
  }
}

module.exports.listRequests = function() {
  var path = __dirname +'/../static/jsons/vm.json';
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {error: 'no data found'};
  }
}

module.exports.getLanguage = function() {
  var path = __dirname +'/../static/jsons/language.json';
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {error: 'no data found'};
  }
}

module.exports.getUntagged = function(a, b) {
  return this.arraySubtract(this.union(a,b), a);
}

module.exports.union = function (a, b) {
  var c = a.concat(b);
  var d = c.filter(function (item, pos) {return c.indexOf(item) == pos});
  return d;
}

module.exports.arraySubtract = function (fullArray, toRemove) {
  return fullArray.filter(function(i) {return toRemove.indexOf(i) < 0;});
}

module.exports.intersect = function (a, b) {
  var result = [];
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      if (a[i] == b[j]) {
        result.push(a[i]);
      }
    }
  }
  return result;
}