var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');
var index = require('./routes/index');
var eventRouter = require('./routes/event/event');
var error = require('./utils/error');
var utils = require('./utils/utils');
var environmentConfig = require('./config/environment');
var app = express();

//获取环境变量并启动
var environment = process.argv.splice(2)[0] || 'dev';
var currentEnvConfig = environmentConfig[environment];
var port = currentEnvConfig.port;

console.log('system running environment:')
console.log(currentEnvConfig)
app.set('environment', environment);
app.set('port', port);
http.createServer(app).listen(port).on('error', error.systemStartError);

var options = {
    key: fs.readFileSync('./cert/privatekey.pem'),
    cert: fs.readFileSync('./cert/certificate.pem')
};

https.createServer(options, app).listen(currentEnvConfig.httpsPort).on('error', error.systemStartError);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'xtpl');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(currentEnvConfig.staticPrefix));

app.use(function(req, res, next) {
  res.locals = {
    imagePrefix:environmentConfig['public'].imagePrefix,
    staticPrefix:currentEnvConfig.staticPrefix
  }
  next();
});


app.use('/', index);
app.use('/event', eventRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err,req,res,next){
  error.runningErrorHandler(err,req,res,next,environment);
});

module.exports = app;
