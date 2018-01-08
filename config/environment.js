var cdnFileVersion = 'sysv613';
var staticFileVersion = '?v=20180108';

module.exports = {
	'public':{
		imagePrefix:'//kascdn.kascend.com/jellyfish/uiupload',
		staticFileVersion:staticFileVersion
	},
	'dev':{
		port:3000,
		httpsPort:443,
		staticPrefix:'//127.0.0.1:8080'
	},
	'production':{
		port:80,
		httpsPort:443,
		staticPrefix:'//cdn.kascend.com/jellyfish/' + cdnFileVersion,
	}
}