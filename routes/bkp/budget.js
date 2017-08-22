'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var Q = require('q');
var apiService = require('../services/ApiService');
var userService = require('../services/UserService');
var BudgetService = require('../services/BudgetService');
var helperService = require('../services/HelperService');
var natsClient = require('../services/NatsClient');
var formService = require('../services/FormCRUDService');
var config = require('config');

var mailer = require("nodemailer");
var nats = require('nats');

var servers = config.get('nats');
var router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

router.post('/create', function(req, res) {
    var user = JSON.parse(req.session.user);
    var formData = req.body;
    var budgetData = {};

    budgetData['budgetName'] = formData.budget_name;
    budgetData['customerName'] = formData.customer_name;
    budgetData['period'] = formData.budget_period;;
    budgetData['financialYear'] = formData.f_year;
    budgetData['value'] = formData.value;
    budgetData['type'] = formData.type;
    budgetData['isActive'] = formData.create_active;
    if(formData.budget_period === 'quarterly' ) {
        budgetData['financialQuarter'] = formData.f_quarter;
        budgetData['financialMonth'] = formData.financialMonth;
    } else if(formData.budget_period === 'monthly' ) {
       budgetData['financialMonth'] = formData.financialMonth;
    }
    budgetData['isActive'] = formData.create_active;
    var result = BudgetService.createBudget(budgetData);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
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
router.post('/update', function(req, res) {
    var user = JSON.parse(req.session.user);
    var formData = req.body;
    var budgetData = {};

    budgetData['budgetName'] = formData.budget_name;
    budgetData['type'] = formData.type;
    budgetData['isActive'] = formData.create_active;
    var result = BudgetService.updateBudget(budgetData);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
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
router.get('/list/:customerName', function(req, res) {
    var customerName = req.params.customerName;
    var result = BudgetService.listBudget(customerName);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
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

router.get('/:customerName/:budgetName', function(req, res) {
    var customerName = req.params.customerName;
    var budgetName = req.params.budgetName;
    var result = BudgetService.listSingleBudget(customerName,budgetName);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
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
router.get('/list/filter/billing', function(req, res) {
    var customerName = req.query.customerName;;
    var result = BudgetService.getBillingFilter(customerName);
    result.then(function(response) {
        try {
            // console.log(response);
            response = JSON.parse(response);
            // console.log(response);
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

router.get('/billing', function(req, res) {
    var customerName = req.query.customerName;
    var provider = req.query.provider;
    var end_date = req.query.end_date;
    var start_date = req.query.start_date;
    var result = BudgetService.getBill(customerName,end_date,start_date,provider);
    result.then(function(response) {
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

router.get('/getBudgetBU', function(req, res) {
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    var result = BudgetService.getBudgetBU(budgetName,customerName);
    result.then(function(response) {
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

router.get('/getBudgetProject', function(req, res) {
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    var result = BudgetService.getBudgetProject(budgetName,customerName);
    result.then(function(response) {
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
router.get('/getUntaggedBudgetBu', function(req, res) {
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    var result = BudgetService.getUntaggedBudgetBu(budgetName,customerName);
    result.then(function(response) {
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
router.get('/getUntaggedBudgetProject', function(req, res) {
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    var result = BudgetService.getUntaggedBudgetProject(budgetName,customerName);
    result.then(function(response) {
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

router.get('/unTagBudgetBu', function(req, res) {
    var BuName = req.query.BuName;
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    // console.log(BuName,budgetName,customerName);
    var result = BudgetService.unTagBudgetBu(BuName,budgetName,customerName);
    result.then(function(response) {
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
router.get('/tagBudgetBu', function(req, res) {
    var BuName = req.query.BuName;
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    // console.log(BuName,budgetName,customerName);
    var result = BudgetService.tagBudgetBu(BuName,budgetName,customerName);
    result.then(function(response) {
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
router.get('/tagBudgetProject', function(req, res) {
    var projectName = req.query.projectName;
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    // console.log(BuName,budgetName,customerName);
    var result = BudgetService.tagBudgetProject(projectName,budgetName,customerName);
    result.then(function(response) {
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
router.get('/unTagBudgetProject', function(req, res) {
    var projectName = req.query.projectName;
    var budgetName = req.query.budgetName;
    var customerName = req.query.customerName;
    // console.log(BuName,budgetName,customerName);
    var result = BudgetService.unTagBudgetProject(projectName,budgetName,customerName);
    result.then(function(response) {
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
// Exports
module.exports = router;
