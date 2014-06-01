/*
 * System Message Bar Button OnClick Functions JavaScript
 *
 */

function inviteToUploadButtonOneOnclick(id){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == null){
			drawConfirmPopUp("找不到用户");
		}else{
			upload_choosepic(data);
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("获取用户数据失败 Error: "+error);
	};
	getUserAPI(id, onAjaxSuccess, onAjaxError);
}

function friendRequestButtonOneOnclick(id,thisMessageId,messageTypeNumber,thisItem){
	var onAjaxSuccess = function(data,textStatus){
		if (data == true ){
			deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
			drawConfirmPopUp("成功加为好友");
			refreshTopbarFriendsLists($.cookie("truthbook").userId);
			refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
			friendRequestAccept(id);
			return true;
		} else {
			deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
			drawConfirmPopUp("添加好友失败<br>(可能是你们已经是好友咯)");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("添加好友请求发送失败 Error: "+error);
		return false;
	};

	addFriendAPI($.cookie("truthbook").userId, id, type_nFriends,"false");
	addFriendAPI(id, $.cookie("truthbook").userId, type_nFriends,"false", onAjaxSuccess, onAjaxError);
	
}

function goToFriendPageButtonOnlick(thisUserId,thisMessageId,messageTypeNumber,thisItem){
	var onAjaxSuccess = function(data,textStatus){
		if(data == false){
			drawConfirmPopUp("获取用户失败");
		} else {
			$.cookie("truthbook_PageOwner_userId", data);
			deleteMessageAndJump(thisMessageId,messageTypeNumber,thisItem);
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	getUserAPI(thisUserId, onAjaxSuccess, onAjaxError);
}

function recurFindTheImageAndFlip(imageId,level){
	if(level == 10) {
		$.cookie("truthbook_thisImageId", null,{expires: -1});
		return;
	}
	if($("#imageId"+imageId).html()==undefined){
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE);
		itemInitialize("#eventsegment");
		recurFindTheImageAndFlip(imageId,level+1);
		return;
	}else{
		if(level == 1){
			$("#imageId"+imageId).find(".commentwrap").html("");
			getThisComment_All(imageId,CONTROL.Self);
//			flipImageByImageId(imageId);
		}
	}
	return;
}


function goToThatImageComment(thisImageId,thisUserId,thisMessageId,messageTypeNumber,thisItem,imageOwnId){
	var userId = imageOwnId;
	if(userId == $.cookie("truthbook_PageOwner_userId").userId){
		//不跳转，完成背后图片载入即可
		$.cookie("truthbook_thisImageId",thisImageId);
//		deleteMessageAndJump(thisMessageId,messageTypeNumber,thisItem);
		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
		recurFindTheImageAndFlip(thisImageId,1);
		
	}else{
		var onSuccess = function(data,textStatus){
			if(data != null ){
				$.cookie("truthbook_PageOwner_userId", data);
				$.cookie("truthbook_thisImageId",thisImageId);
				deleteMessageAndJump(thisMessageId,messageTypeNumber,thisItem);
			} else {
				drawConfirmPopUp("获取用户失败");
			}
		};
		var onError = function(xhr,status,error){
			drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
			return false;
		};
		getUserAPI(userId, onSuccess, onError);
	}
}

function goToThatImage(thisImageId,thisUserId,thisMessageId,messageTypeNumber,thisItem){
	var userId = thisUserId;
	var onSuccess = function(data,textStatus){
		if(data != null ){
			$.cookie("truthbook_PageOwner_userId", data);
			$.cookie("truthbook_thisImageId",thisImageId);
			deleteMessageAndJump(thisMessageId,messageTypeNumber,thisItem);
//					window.location.href = HomePage+"?id="+$.cookie("truthbook_PageOwner_userId").userId;
		} else {
			drawConfirmPopUp("获取用户失败");
		}
	};
	var onError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	
	getUserAPI(userId, onSuccess, onError);
}


function deleteMessageAndJump(thisMessageId,messageTypeNumber,thisItem){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			deleteMessageTrasition(messageTypeNumber,thisItem);
			window.location.href = HomePage+"?id="+$.cookie("truthbook_PageOwner_userId").userId;
		}else{
			drawConfirmPopUp("标记信息已读失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("标记信息已读请求发送失败 Error: " + error);			
	};

	markReadMessageAPI(thisMessageId,onAjaxSuccess, onAjaxError);	
}


function deleteMessageButtonOnclick(messageId,messageTypeNumber,thisItem){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			deleteMessageTrasition(messageTypeNumber,thisItem);
		}else{
			drawConfirmPopUp("标记信息已读失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("标记信息已读请求发送失败 Error: " + error);			
	};

	markReadMessageAPI(messageId,onAjaxSuccess, onAjaxError);
}

function deleteMessageTrasition(messageTypeNumber,thisItem){
	deleteMessageNumUpdate(-1);
	
	thisItem.transition({
		animation : 'horizontal flip out', 
		duration  : '0.3s',
		complete  : function() {
			thisItem.hide();
			thisItem.html("");
			deleteHeadMessageNumUpdate(thisItem);
		}
	});
	
}

function deleteHeadMessageNumUpdate(thisItem){
	var newNumOfMessage = Number(thisItem.parent().parent().find(".messageNumber").html()) - 1;
	if (newNumOfMessage <= 0){
		thisItem.parent().parent().find(".item").html("");
		thisItem.parent().parent().children(".item").hide();
	} else {
		thisItem.parent().parent().find(".messageNumber").html(newNumOfMessage);
	}
}