var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');
var velocity = require('velocityjs')//velocityjs
var index = require('./routes/index');
var error = require('./utils/error');
var app = express();

var vm = require('express-velocity');


//获取环境变量并启动
var environment = process.argv.splice(2)[0] || 'dev';
var envConfig = require('./config/environment')[environment];
var port = envConfig.port;


console.log(envConfig)
app.set('port', port);

http.createServer(app).listen(port).on('error', error.systemStartError);

var options = {
    key: fs.readFileSync('./cert/privatekey.pem'),
    cert: fs.readFileSync('./cert/certificate.pem')
};

https.createServer(options, app).listen(envConfig.httpsPort).on('error', error.systemStartError);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'vm');

app.engine(".vm", vm({
  root: __dirname + "/views"  //duplicated with views setting but required for velocity template
}))

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(envConfig.staticPrefix));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = environment === 'dev' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('pc/common/error');
});

module.exports = app;
