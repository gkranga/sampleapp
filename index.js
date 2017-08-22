'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
//var provisionApiRoutes = require('./routes/provisionApi');
//var apiRoutes = require('./routes/api');
//var requestApiRoutes = require('./routes/requestApi');
//var resourceApiRoutes = require('./routes/resourceApi');
//var privateRoutes = require('./routes/private');
//var newPrivateRoutes = require('./routes/newPrivate');
var publicRoutes = require('./routes/public');
//var budgetRoutes = require('./routes/budget');

// Globals
var app = express();

app.use(cookieParser());
app.use(require('express-session')({
    secret: 'servicewire',
    resave: false,
    saveUninitialized: false
}));

// Application settings
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './views');

app.locals.siteTitle = 'Node app';

// Middlewares
app.use('/static', express.static('./static', {
  index: false,
  redirect: false
}));
app.use('/static', express.static('./bower_components', {
  index: false,
  redirect: false
}));

// Routes
app.use('/', publicRoutes);
//app.use('/request', requestApiRoutes);
//app.use('/resource',resourceApiRoutes);
//app.use('/api', apiRoutes);
//app.use('/provision', provisionApiRoutes);
//app.use('/dashboard', privateRoutes);
//app.use('/budget', budgetRoutes);
//app.use('/newdashboard', newPrivateRoutes);

// Server
// app.listen(process.env.PORT || 9000);
 // app.listen(80);
 app.listen(9000);
