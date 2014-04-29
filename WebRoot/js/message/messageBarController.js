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
	$("#unreadMessageNum").attr("class", "floating ui circular green label transition hidden");
	$("#unreadMessageNum").html("00");
	
	getNewMessage(MessageType.INVITETOUPLOAD);
	getNewMessage(MessageType.ADDFRIEND);
	getNewMessage(MessageType.ACCEPTFRIEND);
	getNewMessage(MessageType.TAKEQUOTE);
	getNewMessage(MessageType.REJECTIMAGE);
	getNewMessage(MessageType.ACCEPTIMAGE);
	getNewMessage(MessageType.REPLY);
	getNewMessage(MessageType.UPGRADE);
	
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
		if(messageType.typeName==MessageType.UPGRADE.typeName){
			returnIntervalInt=self.setInterval("updateMessage()",periodCheckNewMessage);
		}
		
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("获取新系统通知 Error: "+error);
	};
	
	getMessageAPI($.cookie("truthbook").userId,messageType.typeName,onAjaxSuccess, onAjaxError)
}

function updateNewMessageNum(numOfMessage){
	var newNumOfMessage =numOfMessage +Number($("#unreadMessageNum").html());
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
		var iconArray = ["cloud upload","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.TAKEQUOTE.typeName){
		var iconArray = ["home","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.REJECTIMAGE.typeName){
		var iconArray = ["cloud upload","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.ACCEPTIMAGE.typeName){
		var iconArray = ["comment outline","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.REPLY.typeName){
		var iconArray = ["comment outline","remove"];
		return iconArray;
	} else if (messageTypeName == MessageType.UPGRADE.typeName){
		var iconArray = ["","remove"];
		return iconArray;
	}
}

function pickHeadIconName(messageTypeName){
	if(messageTypeName == MessageType.INVITETOUPLOAD.typeName){
		var iconArray = "cloud upload";
		return iconArray;
	} else if (messageTypeName == MessageType.ADDFRIEND.typeName){
		var iconArray = "user";
		return iconArray;
	} else if (messageTypeName == MessageType.ACCEPTFRIEND.typeName){
		var iconArray = "users";
		return iconArray;
	} else if (messageTypeName == MessageType.TAKEQUOTE.typeName){
		var iconArray = "road";
		return iconArray;
	} else if (messageTypeName == MessageType.REJECTIMAGE.typeName){
		var iconArray = "shield";
		return iconArray;
	} else if (messageTypeName == MessageType.ACCEPTIMAGE.typeName){
		var iconArray = "archive";
		return iconArray;
	} else if (messageTypeName == MessageType.REPLY.typeName){
		var iconArray = "chat outline";
		return iconArray;
	} else if (messageTypeName == MessageType.UPGRADE.typeName){
		var iconArray = "level up";
		return iconArray;
	}
	
}

function enableHeaderMenu(numOfMessage,messageType){
	html = "<div class=\"item\" id=\""+messageType.typeName+"HeaderMenu\" style='background-color:#FAFAFA;-webkit-box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.1),0 1px 0 0 rgba(0, 0, 0, 0.1);'>" + 
				"<div class=\"pickTheNumber\"><i class=\""+pickHeadIconName(messageType.typeName)+" inverted circular black icon\"></i>" + 
				"<span class =\"messageNumber head\">" + numOfMessage + "</span>" + messageType.typeHeadMenuName + 
		   "</div></div>";
	
	$("#"+messageType.typeName+"_MessageMenu").html(html);
	
	$("#"+messageType.typeName+"HeaderMenu").click(function(){
		showHiddenMessageTransition("#"+messageType.typeName+"MessageContent");
	});

	$("#"+messageType.typeName+"HeaderMenu").hover(
			function(){$(this).css("background-color","#F4F4F4");},
			function(){$(this).css("background-color","");}
	 );
}

function drawMessageContentWrapper(messageType){
	var html = "<div id = \""+messageType.typeName+"MessageContent\" style=\"display:none;\"></div>";
	$("#"+messageType.typeName+"_MessageMenu").append(html);
}

function thisMessageContentHTML(sourceId,messageId,imageId,fullName,iconName,messageType){
	var html =	"<div class=\"item message\" id='messageId"+messageId+"'>"+
					"<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
						"<span class=\"this_userId\" style=\"display:none;\">" + sourceId + "</span>" +
						"<span class=\"this_messageId\" style=\"display:none;\">" + messageId + "</span>" +
						"<span class=\"this_imageId\" style=\"display:none;\">" + imageId + "</span>" +
						"<a class=\""+messageType.typeButtonOneName+"\"><i class=\"" + iconName[0]  + " large icon\"></i></a>" +
						"<a class=\""+messageType.typeButtonTwoName+"\"><i class=\"" + iconName[1]  + " large icon\"></i></a>" +
					"</div>" +
					"<div class=\"content message messageId"+ messageId+"\" style=\"width: 150px;word-break:break-all;\">" +
						fullName +
					"</div>" +
				"</div>";
	return html;
}

function updateNewMessageMenuList(numOfMessage,data,messageType){
	enableHeaderMenu(numOfMessage,messageType);
	drawMessageContentWrapper(messageType);
	
	for(var i=0;i<numOfMessage;i++){
		if (numOfMessage == 1){
			var messageId = data.message.messageId,
				sourceId = data.message.friend.userId,
				sourceName = data.message.friend.fullName,
				imageId = data.message.imageId,
				imageOwnId = data.message.imageOwnerid,
				content = data.message.content;
		}else {
			var messageId = data.message[i].messageId,
				sourceId = data.message[i].friend.userId,
				sourceName = data.message[i].friend.fullName,
				imageId = data.message[i].imageId,
				imageOwnId = data.message[i].imageOwnerid,
				content = data.message[i].content;
		}
		if (imageId == undefined ) imageId ="";
		var iconName = pickIconName(messageType.typeName);
		
		$("#"+messageType.typeName+"MessageContent").append(thisMessageContentHTML(sourceId,messageId,imageId,sourceName,iconName,messageType));
		singleMessageButtonHandler(messageType,sourceId,messageId,imageId,imageOwnId,content);
	
	}

}

function singleMessageButtonHandler(messageType,sourceId,messageId,imageId,imageOwnId,content){
	if(messageType.typeName == MessageType.REJECTIMAGE.typeName){
		$("#"+messageType.typeName+"MessageContent")
		.children(".item.message")
		.children(".content.message.messageId"+messageId)
		.popup({
			    on: 'hover',
			    position : 'left center',
			    title	:	MESSAGE_REJECTIMAGE_TITLE,
			    content	:	content,
			    transition: 'fade down'
		});
	}
	
	if(messageType.typeName == MessageType.ACCEPTIMAGE.typeName){
		$("#"+messageType.typeName+"MessageContent")
		.children(".item.message")
		.children(".content.message.messageId"+messageId)
		.popup({
			    on: 'hover',
			    position : 'left center',
			    title	:	MESSAGE_ACCEPTIMAGE_TITLE,
			    content	:	content,
			    transition: 'fade down'
		});
	}
	
	if(messageType.typeName == MessageType.UPGRADE.typeName){
		$("#"+messageType.typeName+"MessageContent")
		.children(".item.message")
		.children(".content.message.messageId"+messageId)
		.popup({
			    on: 'hover',
			    position : 'left center',
			    title	:	MESSAGE_UPGRADE_TITLE,
			    content	:	MESSAGE_UPGRADE_CONTENT,
			    transition: 'fade down'
		});
	}
	
	$("#messageId"+messageId).hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	
	$("#"+messageType.typeName+"MessageContent")
	.find(".content.message.messageId"+messageId)
	.hover(	function(){$(this).css("color","#33B2E1");},
			function(){$(this).css("color","");}
		  );

	$("#"+messageType.typeName+"MessageContent")
	.find(".content.message.messageId"+messageId)
	.click(function() {
			itemOnClickSwitch(messageType.number,thisUserId,thisMessageId,$(this).parent());
		}
	);
	
	$("#messageId"+messageId)
		.find("."+messageType.typeButtonOneName)
		.children(".icon")
		.hover(	function(){$(this).css("color","#33B2E1");},
		function(){$(this).css("color","");}
	  );
	
	$("#messageId"+messageId)
	.find("."+messageType.typeButtonOneName)
	.children(".icon")
	.click(function() {
		buttonOneOnClickSwitch(messageType.number,sourceId,messageId,$("#messageId"+messageId),imageId,imageOwnId);	
	});
	
	$("#messageId"+messageId)
		.find("."+messageType.typeButtonTwoName)
		.children(".icon")
		.hover(	function(){$(this).css("color","#33B2E1");},
		function(){$(this).css("color","");}
	  );
	
	$("#messageId"+messageId)
	.find("."+messageType.typeButtonTwoName)
	.children(".icon")
	.click(function() {
		buttonTwoOnClickSwitch(messageType.number,sourceId,messageId,$("#messageId"+messageId));
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
	case "3"://takeQuote
		
		break;
	case "4"://rejectImage

		break;
	case "5"://acceptImage

		break;
	case "6"://reply

		break;
	case "7"://upgrade

		break;
	}	
}

function buttonOneOnClickSwitch(messageTypeNumber,thisUserId,thisMessageId,thisItem,thisImageId,imageOwnId){
	switch (messageTypeNumber){
	case "0"://inviteToUpload
		inviteToUploadButtonOneOnclick(thisUserId);	
		break;
	case "1"://friendRequest
		friendRequestButtonOneOnclick(thisUserId,thisMessageId,messageTypeNumber,thisItem);
		break;
	case "2"://acceptFriendRequest
		inviteToUploadButtonOneOnclick(thisUserId);	
		break;
	case "3"://takeQuote
		goToFriendPageButtonOnlick(thisUserId,thisMessageId,messageTypeNumber,thisItem);
		break;
	case "4"://rejectImage
		inviteToUploadButtonOneOnclick(thisUserId);	
		break;
	case "5"://acceptImage
		goToThatImage(thisImageId,thisUserId,thisMessageId,messageTypeNumber,thisItem);
		break;
	case "6"://reply
		goToThatImageComment(thisImageId,thisUserId,thisMessageId,messageTypeNumber,thisItem,imageOwnId);
		break;
	case "7"://upgrade
		
		break;
	}	
}

function buttonTwoOnClickSwitch(messageTypeNumber,thisUserId,thisMessageId,thisItem){
	
	deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
	
//	switch (messageTypeNumber){
//	case "0"://inviteToUpload
//		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);	
//		break;
//	case "1"://friendRequest
//		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
//	  break;
//	case "2"://acceptFriendRequest
//		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
//		break;
//	case "3"://takeQuote
//		deleteMessageButtonOnclick(thisMessageId,messageTypeNumber,thisItem);
//		break;
//	case "4"://rejectImage
//
//		break;
//	case "5"://acceptImage
//
//		break;
//	case "6"://reply
//
//		break;
//	case "7"://upgrade
//
//		break;
//	}	
}







