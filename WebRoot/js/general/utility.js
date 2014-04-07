/*
 * # Truthbook Utility JavaScript
 *
 */

/*
 *	getAjaxObj
 *	Generate an object for AJAX call
 */
function getAjaxObj(url,type,dataType,onAjaxSuccess,onAjaxError,onAjaxComplete){
	var ajax_obj = new Object();
	ajax_obj.url = url;
	ajax_obj.type = type;
	ajax_obj.dataType = dataType;
	ajax_obj.onSuccess = onAjaxSuccess;
	ajax_obj.onError = onAjaxError;
	ajax_obj.onComplete = onAjaxComplete;
	return ajax_obj;
}
/*
 *	ajax_call
 *	Start an AJAX call
 */		
function ajax_call(ajax_obj){
	$.ajax({
		url: ajax_obj.url,
		type: ajax_obj.type,
		data: ajax_obj.data,
		dataType: ajax_obj.dataType,
		success: ajax_obj.onSuccess,
		error: ajax_obj.onError,
		complete: ajax_obj.onComplete,
	});
}

function Redirect (url) {
	var ua        = navigator.userAgent.toLowerCase(),
		isIE      = ua.indexOf('msie') !== -1,
		version   = parseInt(ua.substr(4, 2), 10);

	// IE8 and lower
	if (isIE && version < 9) {
		var link = document.createElement('a');
		link.href = url;
		document.body.appendChild(link);
		link.click();
	}

	// All other browsers
	else { window.location.href = url; }
}

function cleanUserInfoCookie(){
	$.cookie("truthbook_email", null,{expires: -1}); 
	$.cookie("truthbook_entryTime", null,{expires: -1}); 
	$.cookie("truthbook_fullName", null,{expires: -1}); 
	$.cookie("truthbook_isActivated", null,{expires: -1}); 
	$.cookie("truthbook_school", null,{expires: -1}); 
	$.cookie("truthbook_userId", null,{expires: -1});
	$.cookie("truthbook_PageOwner_userId",null,{expires: -1});
}

function setUserInfoCookie(data){
	//alert(data.email+data.entryTime+data.fullName+data.isActivated+data.school+data.userId);
	$.cookie("truthbook_email", data.email); 
	$.cookie("truthbook_entryTime", data.entryTime); 
	$.cookie("truthbook_fullName", data.fullName); 
	$.cookie("truthbook_isActivated", data.isActivated); 
	$.cookie("truthbook_school", data.school); 
	$.cookie("truthbook_userId", data.userId);
}

function goHomePage(){
	$.cookie("truthbook_PageOwner_userId", $.cookie("truthbook_userId"));
	window.location.href = HomePage;
}

function goZhangSan(){
	$.cookie("truthbook_PageOwner_userId","42203:张三");
	window.location.href = HomePage; 
}

function goOthersPage(id){
	$.cookie("truthbook_PageOwner_userId", id);
	window.location.href = HomePage;
}

function goLogin(){
	window.location.href = LoginPage;
}


function cookieAvailableCheck(){
    document.cookie = "cookieid=1; expires=60";
    var result = document.cookie.indexOf("cookieid=") != -1;
    if (!result) {
        alert("浏览器未启用cookies");
     
    }
}

function userLengthJson(data){
	if (data.user.length != undefined){
		return data.user.length;
	
	} else if (data != null) {
		return 1;
	}
	if(data == null){
		return -1;
	}
}






