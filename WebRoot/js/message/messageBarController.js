$(function() {
	getMessage();
});

function messageLengthJson(data){
	if(data == null){
		return -1;
	}
	if (data.message.length != undefined){
		return data.message.length;
	} else if (data != null) {
		return 1;
	}
}

function getMessage(){
	if ($.cookie("truthbook").userId != $.cookie("truthbook_PageOwner_userId").userId ){
		$("#notifiBtn").html("<i class=\"qr code icon\"></i>");
		return;
	}
	$("#unreadMessageNum").html("00");
	getNewMessage(MessageType.INVITETOUPLOAD);
	getNewMessage(MessageType.ADDFRIEND);
	getNewMessage(MessageType.ACCEPTFRIEND);
//	getInviteToUploadMessage();
//	getFriendRequestMessage();
	
	
}


function getNewMessage(messageType){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == null){
//			drawConfirmPopUp("data: "+data);//maybe need to modify the number of total message later
		}else{
			var numOfMessage = messageLengthJson(data);
			if (numOfMessage > 0){
				updateNewMessageNum(numOfMessage);
				updateNewMessageMenuList(numOfMessage,data,messageType);
			}
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("获取新系统通知 Error: "+error);
	};
	
	getMessageAPI($.cookie("truthbook").userId,messageType.typeName,onAjaxSuccess, onAjaxError)
}

function updateNewMessageNum(numOfMessage){
	var newNumOfMessage =numOfMessage +Number($("#unreadMessageNum").html());
//	drawConfirmPopUp(newNumOfMessage);
	if (newNumOfMessage <= 0){
		$("#unreadMessageNum").html("00");
		$("#unreadMessageNum").attr("class", "floating ui circular green label transition hidden");
	} else if (newNumOfMessage<10){
		showMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html("0" + newNumOfMessage);
	} else {
		showMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html(newNumOfMessage);
	}
}

function deleteMessageNumUpdate(numOfMessage){
	var newNumOfMessage =numOfMessage +Number($("#unreadMessageNum").html());
	if (newNumOfMessage <= 0){
		$("#unreadMessageNum").html("00");
		$("#unreadMessageNum").attr("class", "floating ui circular green label transition hidden");
	} else if (newNumOfMessage<10){
		changeMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html("0" + newNumOfMessage);
	} else {
		changeMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html(newNumOfMessage);
	}
}

function changeMessageNumberTransition(id){
	$(id).transition({	
		animation : 'vertical flip in', 
		duration  : '0.4s',
	});
	$(id).show();
}

function showMessageNumberTransition(id){
	$(id).transition({
		animation : 'scale fade in', 
		duration  : '0.7s',
	});
	$(id).show();
}

function showHiddenMessageTransition(id){
//	$(id).transition({	
//		animation : 'toggle', 
//		duration  : '0.4s',
//	});
	$(id).slideToggle();

}

function pickIconName(messageTypeName){
	if(messageTypeName == MessageType.INVITETOUPLOAD.typeName){
		var iconArray = ["cloud upload","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.ADDFRIEND.typeName){
		var iconArray = ["checkmark","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.ACCEPTFRIEND.typeName){
		var iconArray = ["","remove"];
		return iconArray;
	}
}

function pickHeadIconName(messageTypeName){
	if(messageTypeName == MessageType.INVITETOUPLOAD.typeName){
		var iconArray = "cloud";
		return iconArray;
	} else if (messageTypeName == MessageType.ADDFRIEND.typeName){
		var iconArray = "user";
		return iconArray;
	} else if (messageTypeName == MessageType.ACCEPTFRIEND.typeName){
		var iconArray = "users";
		return iconArray;
	}
	
}

function enableHeaderMenu(numOfMessage,messageType){
	html = "<div class=\"header item\" id=\""+messageType.typeName+"HeaderMenu\">" + 
				"<div class=\"pickTheNumber\"><i class=\""+pickHeadIconName(messageType.typeName)+" upload icon\"></i>" + 
				"<span class =\"messageNumber head\">" + numOfMessage + "</span>" + messageType.typeHeadMenuName + 
		   "</div></div>";
	
	$("#"+messageType.typeName+"_MessageMenu").html(html);
}

function updateNewMessageMenuList(numOfMessage,data,messageType){
	enableHeaderMenu(numOfMessage,messageType);
	var html = "<div id = \""+messageType.typeName+"MessageContent\" style=\"display:none;\">";
	var iconName = pickIconName(messageType.typeName);
	for(var i=0;i<numOfMessage;i++){
		if (numOfMessage == 1){
			var userId = data.message.friend.userId,
			messageId = data.message.messageId,
			fullName = data.message.friend.fullName;
		}else {
			var userId = data.message[i].friend.userId,
			messageId = data.message[i].messageId,
			fullName = data.message[i].friend.fullName;
		}

		html = html +"<div class=\"item message\" >"+
			"<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
				"<span class=\"this_userId\" style=\"display:none;\">" + userId + "</span>" +
				"<span class=\"this_messageId\" style=\"display:none;\">" + messageId + "</span>" +
				"<a class=\""+messageType.typeButtonOneName+"\"><i class=\"" + iconName[0]  + " large icon\"></i></a>" +
				"<a class=\""+messageType.typeButtonTwoName+"\"><i class=\"" + iconName[1]  + " large icon\"></i></a>" +
			"</div>" +
			"<div class=\"content message\" style=\"width: 150px;\">" +
			fullName +
			"</div></div>";
	}
	html = html +"</div>";
	$("#"+messageType.typeName+"_MessageMenu").append(html);
	$("#"+messageType.typeName+"HeaderMenu").click(function(){
		showHiddenMessageTransition("#"+messageType.typeName+"MessageContent");
	});
	
	$(".list.menu.message .item.message").hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	
	$("#"+messageType.typeName+"MessageContent")
		.children(".item.message")
		.children(".content.message")
		.hover(	function(){$(this).css("color","#33B2E1");},
				function(){$(this).css("color","");}
			  );
	
	$(".list.menu.message ." + messageType.typeButtonOneName)
		.children(".icon")		
		.hover(	function(){$(this).css("color","#33B2E1");},
				function(){$(this).css("color","");}
			  );
	
	$(".list.menu.message ."+ messageType.typeButtonTwoName)
		.children(".icon")
		.hover(	function(){$(this).css("color","#33B2E1");},
				function(){$(this).css("color","");}
			  );
	
	$("#"+messageType.typeName+"MessageContent")
		.children(".item.message")
		.children(".content.message")
		.click(function() {
					itemOnClickSwitch(messageType.number,thisUserId,thisMessageId,$(this).parent());
				}
		);

	
	$(".list.menu.message ." + messageType.typeButtonOneName).click(function() {
		var thisUserId = $(this).parent().children(".this_userId").html();
		var thisMessageId = $(this).parent().children(".this_messageId").html();
		buttonOneOnClickSwitch(messageType.number,thisUserId,thisMessageId,$(this).parent().parent());
		
	});
	
	$(".list.menu.message ."+ messageType.typeButtonTwoName).click(function() {
		var thisUserId = $(this).parent().children(".this_userId").html();
		var thisMessageId = $(this).parent().children(".this_messageId").html();
		buttonTwoOnClickSwitch(messageType.number,thisUserId,thisMessageId,$(this).parent().parent());

	});
}

function itemOnClickSwitch(messageTypeNumber,thisUserId,thisMessageId,thisItem){
	switch (messageTypeNumber){
	case "0"://inviteToUpload
		
		break;
	case "1"://friendRequest
		
		break;
	case "2"://acceptFriendRequest
		
		break;
	case "3":

		break;
	case "4":

		break;
	case "5":

		break;
	case "6":

		break;
	}	
}

function buttonOneOnClickSwitch(messageTypeNumber,thisUserId,thisMessageId,thisItem){
	switch (messageTypeNumber){
	case "0"://inviteToUpload
		inviteToUploadButtonOneOnclick(thisUserId);	
		break;
	case "1"://friendRequest
		friendRequestButtonOneOnclick(thisUserId,thisMessageId,thisMessageId,thisItem);
		break;
	case "2"://acceptFriendRequest
		
		break;
	case "3":

		break;
	case "4":

		break;
	case "5":

		break;
	case "6":

		break;
	}	
}

function buttonTwoOnClickSwitch(messageTypeNumber,thisUserId,thisMessageId,thisItem){
	switch (messageTypeNumber){
	case "0"://inviteToUpload
		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);	
		break;
	case "1"://friendRequest
		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
	  break;
	case "2"://acceptFriendRequest
		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
		break;
	case "3":

		break;
	case "4":

		break;
	case "5":

		break;
	case "6":

		break;
	}		
}

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



