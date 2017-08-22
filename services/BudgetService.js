'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var config = require('config');
var servers = config.get('nats');

var nats = require('nats');
var nc = nats.connect({'servers': servers});
var Q = require('q');


module.exports.createBudget = function(formData) {    
    var def = Q.defer();
    nc.request('budget', '{"action":"create", "parameters":['+JSON.stringify(formData)+']}', function(response) {
        def.resolve(response);
    });

    return def.promise;
}
module.exports.updateBudget = function(formData) {    
    var nc = nats.connect({'servers': servers});
    var def = Q.defer();
    nc.request('budget', '{"action":"update", "parameters":['+JSON.stringify(formData)+']}', function(response) {
        def.resolve(response);
    });

    return def.promise;
}

module.exports.listBudget = function (customerName) {
    var result;
    var def = Q.defer();
    nc.request('budget', '{"action":"list", "parameters":[{"customerName": '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}
module.exports.listSingleBudget = function (customerName,budgetName) {
    var result;
    var nc = nats.connect({'servers': servers});
    var def = Q.defer();
    nc.request('budget', '{"action":"read", "parameters":[{"customerName": '+JSON.stringify(customerName)+',"budgetName": '+JSON.stringify(budgetName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}


module.exports.getBill = function (customerName,end_date,start_date,provider) {
    var def = Q.defer();
    // console.log({ "customerName" : [JSON.stringify(customerName)], "startDate" : JSON.stringify(start_date), "endDate" : JSON.stringify(end_date),"cspName" : JSON.stringify(provider)});
    // nc.request('billingCassandra', '{"action":"getBill", "parameters":[{ "projectName" : [], "buName" : [], "accountName" : [], "customerName" : ["Wipro"], "startDate" : "2016-5-6", "endDate" : "2017-5-2", "cspName" : [], "regionName" : [], "resourceID" : [], "resourceName" : [], "groupBy" : "resourceName"}]}', function(response) {
    nc.request('billingCassandra', '{"action":"getBill", "parameters":[{ "customerName" : ['+JSON.stringify(customerName)+'], "startDate" : '+JSON.stringify(start_date)+', "endDate" : '+JSON.stringify(end_date)+'}]}', function(response) {
        def.resolve(response);
    });

    return def.promise;
}


module.exports.getBillingFilter = function (customerName) {
    var def = Q.defer();
    nc.request('billing', '{"action":"filters", "parameters":[{ "customerName" : '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}

module.exports.getBudgetBU = function (budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"listBus", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}
module.exports.getUntaggedBudgetBu = function (budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"listUntaggedBus", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}


module.exports.getBudgetProject = function (budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"listProjects", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}

module.exports.getUntaggedBudgetProject = function (budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"listUntaggedProjects", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}

module.exports.tagBudgetBu = function (BuName,budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"tagBuToBudget", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+', "buName" : '+JSON.stringify(BuName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}
module.exports.unTagBudgetBu = function (BuName,budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"unTagBuToBudget", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+', "buName" : '+JSON.stringify(BuName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}
module.exports.tagBudgetProject = function (projectName,budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"tagProjectToBudget", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+', "projectName" : '+JSON.stringify(projectName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}
module.exports.unTagBudgetProject = function (projectName,budgetName,customerName) {
    var def = Q.defer();
    nc.request('budget', '{"action":"unTagProjectToBudget", "parameters":[{ "budgetName" : '+JSON.stringify(budgetName)+', "customerName" : '+JSON.stringify(customerName)+', "projectName" : '+JSON.stringify(projectName)+'}]}', function(response) {
        def.resolve(response);
    });
    return def.promise;
}


