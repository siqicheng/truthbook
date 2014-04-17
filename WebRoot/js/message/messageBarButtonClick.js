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
			drawConfirmPopUp("成功加为好友");
			deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
			refreshTopbarFriendsLists($.cookie("truthbook").userId);
			refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
			friendRequestAccept(id);
			return true;
		} else {
			drawConfirmPopUp("添加好友失败");
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
			deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
			$.cookie("truthbook_PageOwner_userId", data);
			window.location.href = HomePage;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	getUserAPI(thisUserId, onAjaxSuccess, onAjaxError);
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
	}
	});
	deleteHeadMessageNumUpdate(thisItem);
}

function deleteHeadMessageNumUpdate(thisItem){
	var newNumOfMessage = Number(thisItem.parent().parent().children(".header.item").children(".pickTheNumber").children(".messageNumber.head").html()) - 1;
	if (newNumOfMessage <= 0){
		thisItem.parent().parent().children(".header.item").hide();
	} else {
		thisItem.parent().parent().children(".header.item").children(".pickTheNumber").children(".messageNumber.head").html(newNumOfMessage);
	}
}