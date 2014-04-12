/*
 * # Truthbook HomePage Friend Relation Button Utility Function
 *
 */

/*	Friend relation button click handler.
 *
 */

function handleAddFriendButtonClick(){
	$( "#addFriendButton" ).click(function() {
		addFriendByTmpButton();
	});
	$( "#disabeFriendButton" ).click(function() {
		confirmDeleteFriendPopUp($.cookie("truthbook_PageOwner_userId"));
	});
	
	$("#addFriendWaitingButton").click(function(){
//		drawConfirmPopUp("test confirm message");
	});
	$("#uploadPhoto").click(function(){
		var towhom = $.cookie("truthbook_PageOwner_userId");
		upload_choosepic(towhom);
	});	
}


/*	Check friend relations and show the related buttons accordingly.
 *
 */
function addFriendButtonCheck(){
	var userId = $.cookie("truthbook").userId;
	var pageOwnerId = $.cookie("truthbook_PageOwner_userId").userId;
	var pageOwnerisActivated = $.cookie("truthbook_PageOwner_userId").isActivated;
	if( pageOwnerisActivated == "false"){
		$("#addFriendButton").hide();
		$("#disabeFriendButton").hide();
		$("#uploadPhoto").show();
		addFriendTransition("#uploadPhoto");
		handleAddFriendButtonClick();
		return;
	}
	if ( pageOwnerId == undefined || pageOwnerId == null || userId == pageOwnerId ){
		hideAddFriendButton();
		hideAddPhotoButton();
		return;
	}
	if (getRelationship(pageOwnerId)>0){
		hideAddFriendButton();
		showAddPhotoButton();
		handleAddFriendButtonClick();
		return;
	}
	else{
		hideAddPhotoButton();
		showAddFriendButton();
		handleAddFriendButtonClick();
		return;
	}
}

/*	Four help function to show and hide buttons.
 *
 */

function showAddFriendButton(){
	$("#addFriendButton").show();
	addFriendTransition("#addFriendButton");
}

function showAddPhotoButton(){
	$("#uploadPhoto").show();
	$("#disabeFriendButton").show();
	addFriendTransition("#uploadPhoto");
	addFriendTransition("#disabeFriendButton");
}

function hideAddFriendButton(){
	$("#addFriendButton").hide();
}

function hideAddPhotoButton(){
	$("#disabeFriendButton").hide();
	$("#uploadPhoto").hide();
}

/*	Button change transition.
 *	
 */

function addFriendTransition(buttonId,onSuccessFunction){
	$(buttonId).transition({	
		animation : 'horizontal flip in', 
		duration  : '0.5s',
		complete  : onSuccessFunction
	});
}


function confirmInviteFriendUploadPopUp(towhom){
	var header = "确定邀请"+towhom["fullName"]+"为你上传照片？";
	var content = "你是我的眼<br>&ensp;&ensp;&ensp;&ensp;&ensp;带我领略四季的变换<br>你是我的眼<br>&ensp;&ensp;&ensp;&ensp;&ensp;"+
					"带我穿越拥挤的人潮<br>你是我的眼<br>&ensp;&ensp;&ensp;&ensp;&ensp;带我阅读浩瀚的书海";
	var negativeBtn = "取消";
	var negativeBtnHidden = "就是那么简单几句我办不到";
	var positiveBtn = "确定";
	var positiveBtnHidden = "世界纷纷扰扰喧喧闹闹你眼里的我才是真实";
	var logo="screenshot";
	approveFunction = function() {
		inviteFriendToUpload(towhom);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}


function confirmDeleteFriendPopUp(towhom){
	var header = "我当你一世朋友，真的不能做朋友了么？";
	var content = "從前共你\t促膝把酒傾通宵都不夠<br>我有痛快過\t你有沒有?";
	var negativeBtn = "继续做朋友";
	var negativeBtnHidden = "多想一天，彼此都不追究";
	var positiveBtn = "解除好友关系";
	var positiveBtnHidden = "位置變了，各有隊友";
	var logo="trash";
	approveFunction = function() {
		deleteFriendByTmpButton(towhom);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}

function confirmDegradeFriendPopUp(towhom){
	var header = "过去那样厚，真的不能让我做你的极·友么？";
	var content = "為何舊知己\t在最後<br>變不到老友";
	var negativeBtn = "继续做极·友";
	var negativeBtnHidden = "一直躲避的藉口，非甚麼大仇";
	var positiveBtn = "降级（不可更改）";
	var positiveBtnHidden = "是敵與是友，各自也沒有自由";
	var logo="level down";
	approveFunction = function() {
		degradeFriendByTmpButton(towhom);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, positiveBtnHidden, approveFunction, onDenyFunction, logo);	
}


function degradeFriendByTmpButton(towhom){
	var path = "v1/friends/update";
	//There is a problem here that degrade a friend can delete their invitation relation.
	var data = "id=" + $.cookie("truthbook").userId  + "&friend_id=" + towhom["userId"] + "&type=" + "1" + "&is_invitee=" + "0" + "\"";
	var url=ServerRoot+ServiceType.USERPROFILE+path;	
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			drawConfirmPopUp("成功把 "+towhom["fullName"] +" 降级为真·友");
			freshFriendsLists($.cookie("truthbook").userId);
			return true;
		}
		else{
			alert("failed to degrade friend!");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		return false;
	};
	var ajax_obj = getAjaxObj(url,"PUT","json",onAjaxSuccess,onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
	
}

/*	This function need to be modified!!!
 *  Now, only valid for delete by OwnersPage delete button. 
 *
 */

function deleteFriendByTmpButton(towhom){
	var path = "v1/friends/";
	var userId = $.cookie("truthbook").userId + "/";
	var friendId = towhom["userId"];//
	var action = "/delete";
	var url=ServerRoot+ServiceType.USERPROFILE+path+userId+friendId+action;			
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			hideAddPhotoButton();
			showAddFriendButton();
// 			alert("delete friends success!");
			drawConfirmPopUp("成功删除好友");
			return true;
		}
		else{
			alert("failed to delete friend!");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		return false;
	};
	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_obj.cache = "false";
	ajax_call(ajax_obj);

}

/*	This function need to be modified!!!
 *  Now, only valid for add by OwnersPage add button. 
 *
 */

function addFriendByTmpButton(){
	var path = "v1/friends/add";
	var url=ServerRoot+ServiceType.USERPROFILE+path;			
	data = "id=" + $.cookie("truthbook").userId  + "&friend_id=" + $.cookie("truthbook_PageOwner_userId").userId + "&type=1&is_invitee=0";
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			hideAddFriendButton();
			showAddPhotoButton();
// 			alert("add friends success!");
			drawConfirmPopUp("成功加为好友");
			return true;
		}
		else{
			alert("failed to add friend!");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		return false;
	};
	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

/*	This function can only be used after the friend list load.
 *  get the relation between userId and FriendId
 *
 */
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


/*	This function use winkar modified friend relation check API
 *
 */
//function isFriend(pageOwnerId){
//	var path = "v1/friends/";
//	var userId = $.cookie("truthbook").userId + "/";
//	var friendId = $.cookie("truthbook_PageOwner_userId").userId;
//	var action = "/check";
//	var url=ServerRoot+ServiceType.USERPROFILE+path+userId+friendId+action;			
//	var onAjaxSuccess = function(data,textStatus){
//		if (data > 0 ){
//			hideAddFriendButton();
//			showAddPhotoButton();
//			handleAddFriendButtonClick();
//			return true;
//		}
//		else{
//			hideAddPhotoButton();
//			showAddFriendButton();
//			handleAddFriendButtonClick();
//			return true;
//		}
//	};
//	var onAjaxError = function(xhr,status,error){
//		return false;
//	};
//	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
//	ajax_obj.cache = "false";
//	ajax_call(ajax_obj);
//}



function inviteFriendToUpload(towhom){
	var receiver = towhom["userId"];
	var sender = $.cookie("truthbook").userId;
	var path = "v1/message/"+receiver+"/" + sender + MessageType.INVITETOUPLOAD + "/send";
	var url=ServerRoot+ServiceType.NOTIFICATION+path;		
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			drawConfirmPopUp("邀请已发出<br>受邀者 : " + towhom["fullName"]);
			return true;
		}
		else{
			drawConfirmPopUp("邀请已发送失败<br>受邀者 : " + towhom["fullName"]);
			alert("failed to send message");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("邀请已发送失败 Error："+error);
		return false;
	};
	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
}














