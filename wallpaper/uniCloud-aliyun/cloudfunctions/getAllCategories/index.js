'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const res = await uniCloud.httpclient.request("http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAllCategories",{
		dataType:"json"
	});
	
	delete res.data.data[1];
	delete res.data.data[21];
	delete res.data.data[27];
	
	
	return res.data
};
