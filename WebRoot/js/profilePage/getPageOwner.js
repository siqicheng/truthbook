$(function() {
	var pageOwnerId = parseInt(getUrlParam());
	if(pageOwnerId == undefined) {
		$.cookie("truthbook_PageOwner_userId", $.cookie("truthbook"));
		return;
	};
	if(pageOwnerId == $.cookie("truthbook_PageOwner_userId").userId) { return; };
	var onSuccess = function(data, textStatus) {
		if(data == false){
			drawConfirmPopUp("获取用户失败");
		} else {
			$.cookie("truthbook_PageOwner_userId", data);
		}
	};
	var onError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	getUserAPI(pageOwnerId, onSuccess, onError, false);
});

function getUrlParam() {
	var param = window.location.search;
	return param.slice( param.indexOf('=') + 1);
}