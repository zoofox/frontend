var error = {
	//系统启动报错
	systemStartError:function(error){
		if (error.syscall !== 'listen') {
		    throw error;
		  }

		  // handle specific listen errors with friendly messages
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
	}
};
module.exports = error;