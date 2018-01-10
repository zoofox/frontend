var utils = require('../../../utils/utils');

function renderPage(req,res,next){
	var ua = req.get('User-Agent');
	if(utils.isMobile(ua)){
  		res.render('event/201801/newyear_m.xtpl', {});
	}else{
		res.render('event/201801/newyear.xtpl', {});		
	}
}

module.exports = {
	renderPage:renderPage
}