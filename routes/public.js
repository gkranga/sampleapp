'use strict';

var express = require('express');
//var helperService = require('../services/HelperService');

// Globals
var router = express.Router();
var ipaddr;
// Routes
router.get('/dashboard', function(req, res) {
  var partials = {
                    forms  : '../partials/forms/forms.html',
                    scripts : 'scripts.html',
                    head: 'head.html',
                    dataTable: 'table.html',
                    notification: 'notification.html',
                    sidebar: 'sidebar.html',
                    login: 'login.html',
                    profile: 'profile.html'
                 };
  var user = JSON.parse(req.session.user)['statusMessage'];
  var authService = req.session.authService;
  var parsedSidebar = helperService.getSidebarServiceList(user, authService);
  var adminFormat = helperService.getAdminFormat();
  var customerActionsForSwa, userActonsForSwa;
  if (user.isSwa == 'yes') {
    customerActionsForSwa = helperService.getUserActions(authService, 'customers', 'SWA');
    userActonsForSwa = helperService.getUserActions(authService, 'users', 'SWA');
  }
  res.render('index', { partials: partials, title: 'ServiceWire', selected: '', user: user, sidebar: parsedSidebar, customerActionsForSwa: customerActionsForSwa, userActonsForSwa: userActonsForSwa, adminFormat: adminFormat });
});

router.get('/', function(req, res) {
/*  var user = JSON.parse(req.session.user)['statusMessage'];
  var authService = req.session.authService;
  var parsedSidebar = helperService.getSidebarServiceList(user, authService);
  var adminFormat = helperService.getAdminFormat();
  var customerActionsForSwa, userActonsForSwa;
  if (user.isSwa == 'yes') {
    customerActionsForSwa = helperService.getUserActions(authService, 'customers', 'SWA');
    userActonsForSwa = helperService.getUserActions(authService, 'users', 'SWA');
  }
  res.render('new/layout', { title: 'ServiceWire', selected: '', user: user, sidebar: parsedSidebar, customerActionsForSwa: customerActionsForSwa, userActonsForSwa: userActonsForSwa, adminFormat: adminFormat });
*/
/*  function to get the IP address of the server */
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
	ipaddr = iface.address
      console.log(ipaddr);
    }

    ++alias;
  });
});
/*  function to get the IP address of the server */

  var partials = {
                    forms  : '../partials/forms/forms.html',
                    scripts : 'scripts.html',
                    head: 'head.html',
                    login: 'login.html'
                 };
  res.render('newLogin', { partials: partials, ipaddr: ipaddr, title: 'ServiceWire - Login'});


});

router.get('/login', dashboardRedirect, function(req, res) {
  var partials = {
                    forms  : '../partials/forms/forms.html',
                    scripts : 'scripts.html',
                    head: 'head.html',
                    login: 'login.html'
                 };
  res.render('newLogin', { partials: partials, title: 'ServiceWire - Login'});
});

router.get('/logout', checkAuth, function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

function checkAuth(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

function dashboardRedirect(req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

// Exports
module.exports = router;
