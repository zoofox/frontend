var logsConfig = require('../config/logs');
var logsTasksList = require('../config/logsTasks');
var fs = require('fs');
var path = require('path');
var async = require('async');
var logger = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var logTasksStartThread = 5; //日志启动线程数

module.exports = {
	//判断pc h5
	isMobile:function(userAgent){
		if(userAgent){
			var phoneReg = /iPhone|iPod|iPad|Android|Windows Phone|MQQBrowser/;
			return phoneReg.test(userAgent);
		}
		return false;
	},
	//获取日志配置，生成日志文件并记录日志
	logsGenerate:function(logName,app,callback){
		//日志
		var logDirectory = logsConfig.logDirctory;
		var accessLogsConfig = logsConfig[logName];

		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
		var accessLogStream = FileStreamRotator.getStream({
		  date_format: accessLogsConfig.date_format,
		  filename: path.join(logDirectory, accessLogsConfig.filename),
		  frequency: accessLogsConfig.frequency,
		  verbose: accessLogsConfig.verbose,
		  size:accessLogsConfig.size
		})
		if(accessLogsConfig.formatSelfDefined){
		  logger.format(accessLogsConfig.formatName, accessLogsConfig.formatContent);
		}
		app.use(logger(accessLogsConfig.formatName, {stream: accessLogStream,skip: accessLogsConfig.skipFunction}));
		callback(null,1);
	},
	//系统启动时执行日志任务
	startLogsTask:function(app){
		var self = this;
		var dateNow = new Date().getTime();
		if(logsTasksList.taskList && logsTasksList.taskList.length != 0){
			async.mapLimit(logsTasksList.taskList,logTasksStartThread,function(logTask,callback){
				var logTaskStartTime = new Date(logTask.startTime).getTime();
				var logTaskEndTime = new Date(logTask.endTime).getTime();
				if(dateNow > logTaskStartTime && dateNow < logTaskEndTime){
					self.logsGenerate(logTask.name, app, callback);
				}else{
					callback(null,0);
				}
			},function(err, results){
				var successArr = results.filter(function(result,k){
					return result==1;
				})
				var failedNum = results.length-successArr.length;
				console.log('log tasks finished: '+successArr.length+' success, '+ failedNum + ' failed [not in time]' );
			})
		}	
	}
}