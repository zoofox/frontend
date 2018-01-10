var logsConfig = require('../config/logs');
var logsTasksList = require('../config/logsTasks');
var fs = require('fs');
var path = require('path');
var async = require('async');
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
	logsGenerate:function(logName,app,callback){
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
	},
	startLogsTask:function(app){
		var self = this;
		var dateNow = new Date();
		if(logsTasksList.taskList && logsTasksList.taskList.length != 0){
			async.mapLimit(logsTasksList.taskList,5,function(logTask,callback){
				// self.logsGenerate(logTask.name)
			})
		}	
	}
}