/*
 * # Truthbook Utility JavaScript
 *
 */

/*
 *	getAjaxObj
 *	Generate an object for AJAX call
 */
function getAjaxObj(url,type,dataType,onAjaxSuccess,onAjaxError,onAjaxComplete,cache){
	try{
		var token = $.cookie("truthbook").token;
		if(token==undefined||token==null) token="";
	}
	catch(err){
		
	}
	var ajax_obj = new Object();
	ajax_obj.beforeSend = function(request){
		request.setRequestHeader("token",token);
	};
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
		beforeSend:ajax_obj.beforeSend,
		async: ajax_obj.async,
		url: ajax_obj.url,
		type: ajax_obj.type,
		data: ajax_obj.data,
		dataType: ajax_obj.dataType,
		success: ajax_obj.onSuccess,
		error: ajax_obj.onError,
		complete: ajax_obj.onComplete,
		cache:ajax_obj.cache,
		contentType: ajax_obj.contentType,
		processData: ajax_obj.processData
	});
}

function Redirect(url) {
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
	$.cookie("truthbook_Page_Image_Pointer",null,{expires: -1});
	$.cookie("truthbook_Timeline_Item_Pointer",null,{expires: -1});
}

function setUserInfoCookie(data){
	$.cookie("truthbook", data);
}

function goTimeLine(){
	$.cookie("truthbook_PageOwner_userId", $.cookie("truthbook"));
	Redirect(TimeLinePage);
}

function goHomePage(){
	$.cookie("truthbook_PageOwner_userId", $.cookie("truthbook"));
	Redirect(HomePage+"?id="+$.cookie("truthbook_PageOwner_userId").userId);
}

function goOthersPage(id){
//	var onAjaxSuccess = function(data,textStatus){
//		if(data == false){
//			drawConfirmPopUp("获取用户失败");
//		} else {
//			$.cookie("truthbook_PageOwner_userId", data);
//			window.location.href = HomePage+"?id="+$.cookie("truthbook_PageOwner_userId").userId;
	Redirect(HomePage+"?id="+id);
//		}
//	};
//	var onAjaxError = function(xhr,status,error){
//		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
//		return false;
//	};
//	getUserAPI(id, onAjaxSuccess, onAjaxError, true);
}

function goLogin(){
	window.location.href = LoginPage;
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
	$("#upload").addClass("ui wide styled sidebar");
	$("#upload").sidebar("show");
}

function showPopup(){
	$("#upload").removeClass("ui wide styled sidebar");
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

function getImageUrl(url,style){
	if (url==undefined||url==null){
		return DefaultPortrait;
	}else{
		return "http://"+url+style;
	}
}

function returnSmaller(one,two){
	if (one > two){
		return  two;
	} else {
		return  one;
	}
}


/*Api helper functions*/

function addFriendAPI(id, friend_id, type, is_invitee,  onSuccess, onError) {
	var path = "v1/friends/add",
		url = ServerRoot + ServiceType.USERPROFILE + path,
		data ="id=" + id + "&friend_id=" + friend_id + "&type=" + type + "&is_invitee=" + is_invitee,
		ajax_obj = getAjaxObj(url, "POST", "json", onSuccess, onError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function deleteFriendAPI(userId, friendId,onAjaxSuccess,onAjaxError){
	var path = "v1/friends/" + userId + "/" + friendId +"/delete",
		url=ServerRoot+ServiceType.USERPROFILE+path,
		ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
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

function registerNewQuote(data, onSuccess, onError) {
	var path = "v1/quote/register",
		url = ServerRoot + ServiceType.LOGIN +path,
		ajax_obj = getAjaxObj(url, "POST", "json", onSuccess, onError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function verifyUserExists(data, onSuccess, onError) {
	var path = "v1/user/verify",
		url = ServerRoot + ServiceType.LOGIN +path,
		ajax_obj = getAjaxObj(url, "POST", "json", onSuccess, onError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function getFriends(id, type, onSuccess, onError) {
	var path = "v1/friends/" + id + "/" + type,
		url = ServerRoot + ServiceType.USERPROFILE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onSuccess, onError);
	ajax_call(ajax_obj);
}

function getFriendsSync(id, type, onSuccess, onError) {
	var path = "v1/friends/" + id + "/" + type,
		url = ServerRoot + ServiceType.USERPROFILE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onSuccess, onError);
	ajax_obj.async = false;
	ajax_call(ajax_obj);
}

function getUserAPI(id, onSuccess, onError, async) {
	var path = "v1/" + id,
		url = ServerRoot + ServiceType.LOGIN + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onSuccess, onError);
	ajax_obj.async = async;
	ajax_call(ajax_obj);
}
/*********************************************************************************
 * Message Service API
 */
function getMessageAPI(receiver,messageTypeName,onAjaxSuccess, onAjaxError){
	var path = "v1/message/" + receiver + "/" + messageTypeName + "/get",
		url = ServerRoot + ServiceType.NOTIFICATION + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);	
}

function sendMessageAPI(receiver, sender, messageTypeName, onAjaxSuccess, onAjaxError){
	var path = "v1/message/"+receiver+"/" + sender + "/" + messageTypeName + "/send",
		url=ServerRoot+ServiceType.NOTIFICATION + path,
		ajax_obj = getAjaxObj(url,"PUT","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);	
}

function markReadMessageAPI(messageId,onAjaxSuccess, onAjaxError){
	var path = "v1/message/"+messageId+"/read",
		url = ServerRoot + ServiceType.NOTIFICATION + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);	
}

function sendMessageWithImageIdAPI(receiver, sender, imageId, messageTypeName, onAjaxSuccess, onAjaxError){
	var path = "v1/message/"+receiver+"/" + sender + "/" + messageTypeName +"/"+imageId+ "/send",
		url=ServerRoot+ServiceType.NOTIFICATION + path,
		ajax_obj = getAjaxObj(url,"PUT","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
}

function sendMessageWithContentAPI(receiver, sender,imageId, content,messageTypeName, onAjaxSuccess, onAjaxError){
	var path = "v1/message/imageContent/send",
		url = ServerRoot + ServiceType.NOTIFICATION +path,
		data ="id="+receiver+"&srcid=" + sender + "&type=" + messageTypeName + "&content=" + content + "&imageId=" + imageId,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function getUpdateMessageAPI(receiver,onAjaxSuccess, onAjaxError){
	var path = "v1/message/"+receiver+"/getunsent",
		url=ServerRoot+ServiceType.NOTIFICATION + path,
		ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
}


/*********************************************************************************
 * Image Service API
 */

function addImageAPI(imageURL,userId,uploaderId,description,onAjaxSuccess,onAjaxError){
	var path = "v1/image/add",
		url = ServerRoot + ServiceType.IMAGE +path,
		data ="imageURL="+imageURL+"&userId=" + userId + "&uploaderId=" + uploaderId + "&description=" + description,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function getAllImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + userId + "/user",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function getOneImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + userId + "/latest",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);	
}

function getGuestImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + userId + "/guest",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);	
}

function getOneImageByUserIdSyncAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + userId + "/latest",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.async = false;
	ajax_call(ajax_obj);	
}

function deleteImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/"+imageId+"/delete",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "PUT", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);	
}

function setLikedByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + imageId + "/like",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function setDislikedByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + imageId + "/dislike",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function approveImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + imageId + "/approve",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function unapproveImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + imageId + "/unapprove",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "PUT", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function getImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/image/" + imageId + "/id",
		url = ServerRoot + ServiceType.IMAGE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

/*********************************************************************************
 * Portrait Service API
 */

function addPortraitAPI(userId,imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/portrait/add",
		url = ServerRoot + ServiceType.PORTRAIT +path,
		data ="userId=" + userId + "&imageId=" + imageId,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function setPortraitAPI(userId,imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/portrait/set",
		url = ServerRoot + ServiceType.PORTRAIT +path,
		data ="userId=" + userId + "&imageId=" + imageId,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function getDefaultPortraitAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/portrait/"+userId+"/default",
		url = ServerRoot + ServiceType.PORTRAIT +path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);		
}

/*********************************************************************************
 * Comment Service API
 */

function fullCommentAPI(userId,content,repliedToId,repliedById,onAjaxSuccess,onAjaxError){
	var path = "v1/comment/add/full",
		url = ServerRoot + ServiceType.COMMENT +path,
		data ="userId=" + userId + "&content=" + content + 
				"&repliedToId=" + repliedToId + "&repliedById=" + repliedById,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function simpleCommentAPI(userId,content,repliedById,onAjaxSuccess,onAjaxError){
	var path = "v1/comment/add/replyBy",
		url = ServerRoot + ServiceType.COMMENT +path,
		data ="userId=" + userId + "&content=" + content + 
				"&repliedById=" + repliedById,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function addCommentToImageByImageIdAPI(imageId,commentId,onAjaxSuccess,onAjaxError){
	var path = "v1/imageComment/add",
		url = ServerRoot + ServiceType.COMMENT +path,
		data ="imageId=" + imageId + "&commentId=" + commentId,
		ajax_obj = getAjaxObj(url, "POST", "json", onAjaxSuccess, onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function getAllCommentAPI(imageId,onAjaxSuccess,onAjaxError){
	var path = "v1/imageComment/"+imageId,
		url = ServerRoot + ServiceType.COMMENT +path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function deleteCommentByCommentIdAPI(imageId,commentId,onAjaxSuccess,onAjaxError){
	var path = "v1/imageComment/"+imageId+"/"+commentId+"/delete",
		url = ServerRoot + ServiceType.COMMENT +path,
		ajax_obj = getAjaxObj(url, "DELETE", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

/*********************************************************************************
 * Timeline Service API
 */
function getAllTimelineByUserIdAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/feed/"+ userId + "/all",
		url = ServerRoot + ServiceType.TIMELINE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function getNewTimelineByUserIdAPI(userId,onAjaxSuccess,onAjaxError){
	var path = "v1/feed/"+ userId,
		url = ServerRoot + ServiceType.TIMELINE + path,
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function getPartOfCommentAPI(imageId,commentNumber,onAjaxSuccess,onAjaxError){
	var path = "v1/imageComment/"+imageId+"/"+commentNumber,
		url = ServerRoot + ServiceType.COMMENT +path,
		ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
}
/*********************************************************************************
 * TimeZoneHandler
 */
function translate_timezone(time,timezone,type){
	var t=time.split(" ");
	var t2=t[3].split(":");
	var d,m;
	var day=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var cday=["周日","周一","周二","周三","周四","周五","周六"];
	var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var monthday=[["1","3","5","7","8","10","12"],["4","6","9","11"],["2"]];


	function getyear(year){
		if(year%100==0){
			if(year%400==0){
				return true;
			}else{
				return false;
			}
		}else if(year%4==0){
			return true;
		}else{
			return false;
		}
	}
	function getNum(array,n){
		for(var i=0;i<array.length;i++){
			if(array[i]==n){
				return i;break;
			}
		}
	}
	
	function getm(n){
		for(var i=0;i<monthday.length;i++){
			for(var j=0;j<monthday[i].length;j++){
				if(monthday[i][j]==(n+1)){
					return i;
					break;
				}
			}
		}
	}

d=getNum(day,t[0]);
m=getNum(month,t[1]);
t2[0]=Number(t2[0]);
t[5]=Number(t[5]);
t[2]=Number(t[2]);

if(t2[0]<(24-timezone)){
	t2[0]+=timezone;
}else{
	t2[0]-=(24-timezone);
	if(t2[0]<10){
	t2[0]="0"+String(t2[0]);
}
	if(d<6){
		t[0]=day[d+1]
	}else{
		t[0]=day[0]
	}
	if(t[2]>27){
switch(getm(m)){
	case 0:
  		if(t[2]>30){
  			t[2]=1;
  			if(t[1]!="Dec"){
  				t[1]=month[m+1];
  			}else{
  				t[1]=month[0];
  				t[5]=t[5]+1;
  			}
  		}else{
  			t[2]=t[2]+1;
  		}
		break;
	case 1:
  		if(t[2]>29){
  			t[2]=1;
  			t[1]=month[m+1];
  		}else{
  		t[2]=t[2]+1;}
   		break;
    case 2:
      if(getyear(t[5])){if(t[2]>28){t[2]=1;t[1]=month[m+1];}else{t[2]=t[2]+1;}}else{t[2]=1;t[1]=month[m+1];}
    	break; 
  	}
  }else{
   t[2]=t[2]+1;
  }
}
if(t[2]<10){t[2]="0"+String(t[2]);}
	t[4]="+0"+String(timezone*100);t[3]=t2.join(":");
switch(type){
  case 0:
  return t.join(" ");
  break;
  case 1:
  return t[5]+"年"+(getNum(month,t[1])+1)+"月"+t[2]+"日 "+t[3]+" "+cday[getNum(day,t[0])]+" 当前时区："+t[4];
  break;
 }
}

function formatTheServerDate(createDate){
	var dayInEng=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var monthInEng=["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
	var numMonthOfUTC = createDate.substr(createDate.indexOf("T")-5,2);
	if (numMonthOfUTC<10){
		numMonthOfUTC = createDate.substr(createDate.indexOf("T")-4,1);
	}
	var Month = monthInEng[numMonthOfUTC];
	var Day = createDate.substr(createDate.indexOf("T")-2,2);
	var Time = createDate.substr(createDate.indexOf("T")+1,8);
	var TimeZone = createDate.substr(createDate.indexOf("T")+9,3)+"00";
	var year = createDate.substring(0,4);
	
	var numDayOfUTC;
	numDayOfUTC = new Date(year+'/'+numMonthOfUTC+'/'+Day).getDay();
	var WeekDate = dayInEng[numDayOfUTC];
	return WeekDate+" "+Month+" "+Day+" "+Time+" "+TimeZone+" "+year;

}






