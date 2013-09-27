var ErrM = require('./error-manager');

var RM= {};
module.exports = RM;

RM.FormatRes = function (response, params)  
{
	//params = {obj, errStr, errCode}
	var resObj;

	if (params.obj) {
		resObj = params.obj;
	} else {
		resObj = {};
	}

	if (params.errStr || params.errCode) {
		resObj.success = false;
		if (params.errCode) {
			resObj.errCode = params.errCode;	
			resObj.errMsg = ErrM.ErrorCodes[params.errCode];
		}
		
		if (params.errStr) {
			if (params.errCode) {
				resObj.errMsg += ': ';
			}	
			resObj.errMsg += params.errStr;
		} 
	} else
	{
	  	resObj.success = true;		
	}

	response.writeHead(200, { 'Content-Type': 'text/javascript'});
	response.write(JSON.stringify(resObj));
	response.end();
}
