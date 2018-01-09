modules.export = {
	isMobile:function(userAgent){
		if(userAgent){
			var phoneReg = /iPhone|iPod|iPad|Android|Windows Phone|MQQBrowser/;
			return phoneReg.test(userAgent);
		}
		return false;
	}
}