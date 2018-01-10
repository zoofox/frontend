module.exports = {
	logDirctory:'../frlogs/',
	access:{
		date_format:'YYYYMMDD',	
		filename:'access-%DATE%.log',
		formatSelfDefined:false,
		formatName:'short',
		formatContent:'',
		frequency:'daily',
		size:'1K',
		skipFunction:function (req, res) { return res.statusCode < 400 }
	}
}
// https://github.com/expressjs/morgan
// https://github.com/rogerc/file-stream-rotator