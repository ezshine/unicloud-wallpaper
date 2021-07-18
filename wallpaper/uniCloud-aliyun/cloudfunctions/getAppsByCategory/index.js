'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	let start = event.start || 0;
	let cid = event.cid || 26;
	
	if(event.queryStringParameters){
		start = event.queryStringParameters.start || 0;
		cid = event.queryStringParameters.cid || 26;
	}else if(event.body){
		let bodyData = JSON.parse(event.body);
		start = bodyData.start || 0;
		cid = bodyData.cid || 26;
	}
	
	const res = await uniCloud.httpclient.request("http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid="+cid+"&start="+start,{
		dataType:"json"
	});
	return res.data
};
