var logsConfig = require('../config/logs');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var FileStreamRotator = require('file-stream-rotator')

module.exports = {
	isMobile:function(userAgent){
		if(userAgent){
			var phoneReg = /iPhone|iPod|iPad|Android|Windows Phone|MQQBrowser/;
			return phoneReg.test(userAgent);
		}
		return false;
	},
	logsGenerate:function(logName,app){
		//日志
		var logDirectory = logsConfig.logDirctory;
		var accessLogsConfig = logsConfig[logName];
		console.log(accessLogsConfig)

		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
		var accessLogStream = FileStreamRotator.getStream({
		  date_format: accessLogsConfig.date_format,
		  filename: path.join(logDirectory, accessLogsConfig.filename),
		  frequency: accessLogsConfig.frequency,
		  verbose: accessLogsConfig.verbose,
		  size:accessLogsConfig.size
		})
		if(accessLogsConfig.formatSelfDefined){
		  morgan.format(accessLogsConfig.formatName, accessLogsConfig.formatContent);
		}
		app.use(logger(accessLogsConfig.formatName, {stream: accessLogStream,skip: accessLogsConfig.skipFunction}));

	}
}