/*
 * # Truthbook HomePage Friend Relation Button Utility Function
 *
 */

/*	Friend relation button click handler.
 *
 */

function handleAddFriendButtonClick(){
	$( "#addFriendButton" ).click(function() {
//		addFriendByTmpButton();
		friendRequestSend($.cookie("truthbook_PageOwner_userId"));
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

function buttonController_AF_AP_DF_AFW(addFriend,addPhoto,disableFriend,addFriendWaiting){
	if (addFriend == 1)			{	showAddFriendButton();} else { hideAddFriendButton();}
	if (addPhoto == 1)			{	showAddPhotoButton();} else { hideAddPhotoButton();}
	if (disableFriend == 1)		{	showDisableFriendButton();} else { hideDisableFriendButton();}
	if (addFriendWaiting == 1)	{	showFriendWaitingButton();} else { hideFriendWaitingButton();}
}

/*	Check friend relations and show the related buttons accordingly.
 *
 */
function addFriendButtonCheck(){
	var userId = $.cookie("truthbook").userId;
	var pageOwnerId = $.cookie("truthbook_PageOwner_userId").userId;
	var pageOwnerisActivated = $.cookie("truthbook_PageOwner_userId").isActivated;
	if( pageOwnerisActivated == "false"){		//If owner is quote
		buttonController_AF_AP_DF_AFW(0,1,0,0);
		handleAddFriendButtonClick();
		return;
	}
	if ( pageOwnerId == undefined || pageOwnerId == null || userId == pageOwnerId ){
		//Homepage or wrong page
		buttonController_AF_AP_DF_AFW(0,0,0,0);
		return;
	}
	isFriendCheck(pageOwnerId);
}

/*	This function use winkar modified friend relation check API
*
*/
function isFriendCheck(friendId){		
	var onAjaxSuccess = function(data,textStatus){
		if (data > 0 ){
			buttonController_AF_AP_DF_AFW(0,1,1,0);
			handleAddFriendButtonClick();
			return true;
		}
		else{//not friend
			isSentFriendRequestMessage(friendId,$.cookie("truthbook").userId);
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		return false;
	};
	
	checkFriendRelationship($.cookie("truthbook").userId, friendId, onAjaxSuccess, onAjaxError);
}

function isSentFriendRequestMessage(friendId,ownId){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			var numMessage = messageLengthJson(data);
			var hasSent = 0;
			if (numMessage == 1){
				if (ownId == data.message.friend.userId){
					hasSent = 1;
				}
			} else {
				for (var i = 0;i<numMessage;i++){
					if (ownId == data.message[i].friend.userId && data.message[0].status != MESSAGESTATUS.READ){
						hasSent = 1;
						break;
					} 
				}	
			}
			if (hasSent ==1 ){
				buttonController_AF_AP_DF_AFW(0,0,0,1);
			} else {
				buttonController_AF_AP_DF_AFW(1,0,0,0);
			}
		} else if (data == null) {
			buttonController_AF_AP_DF_AFW(1,0,0,0);
		}
		handleAddFriendButtonClick();
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("拿不到消息 Error: " + error);
		return false;
	};	
	getMessageAPI(friendId,MessageType.ADDFRIEND.typeName,onAjaxSuccess, onAjaxError);
}



/*	Six help function to show and hide buttons.
 *  Stay like this in case we have different transition for different buttons.
 *
 */

function showAddFriendButton(){
	$("#addFriendButton").removeClass(" hidden");
	$("#addFriendButton").addClass(" visible");
	addFriendTransition("#addFriendButton");
}

function showDisableFriendButton(){
	$("#disabeFriendButton").removeClass(" hidden");
	$("#disabeFriendButton").addClass(" visible");
	addFriendTransition("#disabeFriendButton");
}

function showAddPhotoButton(){
	$("#uploadPhoto").removeClass(" hidden");
	$("#uploadPhoto").addClass(" visible");
	addFriendTransition("#uploadPhoto");
}

function showFriendWaitingButton(){
	$("#addFriendWaitingButton").removeClass(" hidden");
	$("#addFriendWaitingButton").addClass(" visible");
	addFriendTransition("#addFriendWaitingButton");
}

function hideAddFriendButton(){
	$("#addFriendButton").removeClass(" visible ");
	$("#addFriendButton").addClass(" hidden");
}
	
function hideAddPhotoButton(){
	$("#uploadPhoto").removeClass(" visible ");
	$("#uploadPhoto").addClass(" hidden ");
}

function hideDisableFriendButton(){
	$("#disabeFriendButton").removeClass(" visible ");
	$("#disabeFriendButton").addClass(" hidden ");
}

function hideFriendWaitingButton(){
	$("#addFriendWaitingButton").removeClass(" visible ");
	$("#addFriendWaitingButton").addClass(" hidden ");
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
	//There is a problem here that degrade a friend can delete their invitation relation.
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			refreshTopbarFriendsLists($.cookie("truthbook").userId);
			refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
			drawConfirmPopUp("成功把 "+towhom["fullName"] +" 降级为真·友");
			return true;
		}
		else{
			drawConfirmPopUp("降级失败");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("降级请求发送失败Error: "+error);
		return false;
	};
	
	updateFriendRelationship($.cookie("truthbook").userId, towhom["userId"], "1", "0", onAjaxSuccess, onAjaxError)
}

/*	This function need to be modified!!!
 *  Now, only valid for delete by OwnersPage delete button. 
 *
 */

function deleteFriendByTmpButton(towhom){		
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			if( towhom["userId"] == $.cookie("truthbook_PageOwner_userId").userId){
				buttonController_AF_AP_DF_AFW(1,0,0,0);
			} else {
//				buttonController_AF_AP_DF_AFW(0,0,0,0);
			}
			refreshTopbarFriendsLists($.cookie("truthbook").userId);
			refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
			drawConfirmPopUp("成功删除好友");
			return true;
		}
		else{
			drawConfirmPopUp("删除好友失败");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("删除好友请求发送失败 Error : " + error);
		return false;
	};

	deleteFriendAPI($.cookie("truthbook").userId, towhom["userId"]);
	deleteFriendAPI(towhom["userId"], $.cookie("truthbook").userId,onAjaxSuccess,onAjaxError);
}

function friendRequestSend(towhom){	
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			if( towhom["userId"] == $.cookie("truthbook_PageOwner_userId").userId){
				buttonController_AF_AP_DF_AFW(0,0,0,1);
			} else {
//				buttonController_AF_AP_DF_AFW(0,0,0,0);
			}
			drawConfirmPopUp("好友请求已发出<br>幸运儿 : " + towhom["fullName"]);
			return true;
		}
		else{
			drawConfirmPopUp("好友诏书发送失败<br>倒霉蛋 : " + towhom["fullName"]);
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("好友请求发送失败 Error："+error);
		return false;
	};
	
	sendMessageAPI(towhom["userId"], $.cookie("truthbook").userId, MessageType.ADDFRIEND.typeName, onAjaxSuccess, onAjaxError);
}

function friendRequestAccept(id){
	var onAjaxSuccess = function(data,textStatus){
		sendFriendAcceptMessage(data);
	}
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取用户数据失败 Error："+error);
		return false;
	};
	
	getUserAPI(id, onAjaxSuccess, onAjaxError);
}

function sendFriendAcceptMessage(towhom){		
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			return true;
		} else {
			drawConfirmPopUp("接受回执发送失败<br>倒霉蛋 : " + towhom["fullName"]);
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("接受回执发送失败 Error："+error);
		return false;
	};
	
	sendMessageAPI(towhom["userId"], $.cookie("truthbook").userId, MessageType.ACCEPTFRIEND.typeName, onAjaxSuccess, onAjaxError);
}

/*	This function can only be used after the friend list load.
 *  get the relation between userId and FriendId
 *
 */
//function getRelationship(friendId) {
//	for(friend in friendsId.eFriends) {
//		if(friendId == friendsId.eFriends[friend]["userId"]) {
//			return 2;
//		}
//	}
//	for(friend in friendsId.nFriends) {
//		if(friendId == friendsId.nFriends[friend]["userId"]) {
//			return 1;
//		}
//	}
//	return 0;
//}

function inviteFriendToUpload(towhom){	
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			drawConfirmPopUp("邀请已发出<br>受邀者 : " + towhom["fullName"]);
			return true;
		}
		else{
			drawConfirmPopUp("邀请已发送失败<br>受邀者 : " + towhom["fullName"]);
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("邀请已发送失败 Error："+error);
		return false;
	};
	
	sendMessageAPI(towhom["userId"], $.cookie("truthbook").userId, MessageType.INVITETOUPLOAD.typeName, onAjaxSuccess, onAjaxError);
}













