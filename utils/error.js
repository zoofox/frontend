var utils = require('./utils');
var error = {
	//系统启动报错
	systemStartError:function(error){
		if (error.syscall !== 'listen') {
		    throw error;
		  }
		  switch (error.code) {
		    case 'EACCES':
		      console.error('port requires elevated privileges');
		      process.exit(1);
		      break;
		    case 'EADDRINUSE':
		      console.error('port is already in use');
		      process.exit(1);
		      break;
		    default:
		      throw error;
		  }
	},
	//捕获所有错误
	runningErrorHandler:function(err,req,res,next,environment){
		  res.locals.message = err.message;
		  res.locals.error = environment === 'dev' ? err : {};
		  res.status(err.status || 500);
		  var ua = req.get('User-Agent');
		  var isMobile = utils.isMobile(ua);
		  switch(err.status){
		    case 404:
		      var errorPage = isMobile?'mobile/common/not_found':'pc/common/not_found';
		      break;
		    default:
		      var errorPage = isMobile?'mobile/common/error':'pc/common/error';
		  }
		  res.render(errorPage);
	}
};
module.exports = error;