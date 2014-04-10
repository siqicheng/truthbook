/*
 * # Truthbook Utility JavaScript
 *
 */

/*
 *	getAjaxObj
 *	Generate an object for AJAX call
 */
function getAjaxObj(url,type,dataType,onAjaxSuccess,onAjaxError,onAjaxComplete,cache){
	var ajax_obj = new Object();
	ajax_obj.url = url;
	ajax_obj.type = type;
	ajax_obj.dataType = dataType;
	ajax_obj.onSuccess = onAjaxSuccess;
	ajax_obj.onError = onAjaxError;
	ajax_obj.onComplete = onAjaxComplete;
	ajax_obj.cache = cache;
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
		cache:ajax_obj.cache,
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
	$.cookie("truthbook", null,{expires: -1});
	$.cookie("truthbook_PageOwner_userId",null,{expires: -1});
}

function cleanFriendsCookie() {
	$.cookie("eFriends", null,{expires: -1});
	$.cookie("nFriends", null, {expires: -1});
}

function setUserInfoCookie(data){
	$.cookie("truthbook", data);
}

function goHomePage(){
	$.cookie("truthbook_PageOwner_userId", $.cookie("truthbook"));
	window.location.href = HomePage;
}

function goZhangSan(){
	$.cookie("truthbook_PageOwner_userId","42203:张三");
	window.location.href = HomePage; 
}

function goOthersPage(id){
	var path = "v1/";
	var url = ServerRoot + ServiceType.LOGIN + path +id;
	var onAjaxSuccess = function(data,textStatus){
		if(data == false){
			alert("take user object failed");
		} else {
			$.cookie("truthbook_PageOwner_userId", data);
			window.location.href = HomePage;
		}
	};
	var onAjaxError = function(xhr,status,error){
		$("#errorMessageMail").show();
		$("#errorMessageMail").text("注册失败:" + error);
		console.log("Register failed with error:" + error);
		return false;
	};
	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
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
	if(data == null){
		return -1;
	}
	if (data.user.length != undefined){
		return data.user.length;
	} else if (data != null) {
		return 1;
	}
}


function cookieAvailableCheck(){
    document.cookie = "cookieid=1; expires=60";
    var result = document.cookie.indexOf("cookieid=") != -1;
    if (!result) {
        alert("浏览器未启用cookies");
     
    }
}


function showSidebar(){
	$("#upload").removeClass("mfp-hide white-popup");
	$("#upload").addClass("ui very wide styled sidebar");
	$("#upload").sidebar("show");
}

function showPopup(){
	$("#upload").removeClass("ui very wide styled sidebar");
	$("#upload").addClass("white-popup");
	$("#upload").show();
}

function getRelationship(friendId) {
	for(friend in friendsId.eFriends) {
		if(friendId == friendsId.eFriends[friend]["userId"]) {
			return 2;
		}
	}
	for(friend in friendsId.nFriends) {
		if(friendId == friendsId.nFriends[friend]["userId"]) {
			return 1;
		}
	}
	return 0;
}

function addFriendAPI(id, friend_id, type, is_invitee,  onSuccess, onError) {
	var path = "v1/friends/add",
		url = ServerRoot + ServiceType.USERPROFILE + path,
		data ="id=" + id + "&friend_id=" + friend_id + "&type=" + type + "&is_invitee=" + is_invitee,
		ajax_obj = getAjaxObj(url, "POST", "json", onSuccess, onError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function updateFriendRelationship(id, friend_id, type, is_invitee, onSuccess, onError) {
	var path = "v1/friends/update",
		url = ServerRoot + ServiceType.USERPROFILE + path,
		data ="id=" + id + "&friend_id=" + friend_id + "&type=" + type + "&is_invitee=" + is_invitee,
		ajax_obj = getAjaxObj(url, "PUT", "json", onSuccess, onError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function checkFriendRelationship(id, friend_id, onSuccess, onError) {
	var path = "v1/friends/"+ id + "/" + friend_id + "/check",
		url = ServerRoot + ServiceType.USERPROFILE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onSuccess, onError);
	ajax_call(ajax_obj);
}
