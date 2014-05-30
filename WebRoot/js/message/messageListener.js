
function updateMessage(){
	var userId = $.cookie("truthbook").userId;
	var onAjaxSuccess = function(data, textStatus) {
		if (data != undefined || data != null){
			if(data.message.length == undefined){
				oneMessageHandler(data.message);
			} else {
				multiMessageHandler(data.message);
			}
		}else{
			//modified the fetching period according to the user behavior
		}		
	};
	var onAjaxError = function(xhr, textStatus, error) {
//		drawConfirmPopUp("获取更新系统通知 Error: "+error);
	};
	
	getUpdateMessageAPI(userId,onAjaxSuccess,onAjaxError);
}

function oneMessageHandler(message){
	var messageTypeName = message.messageType;
	var messageId = message.messageId;
	var sourceId = message.friend.userId;
	var sourceName = message.friend.fullName;
	var imageId = message.imageId;
	var imageOwnId = message.imageOwnerid;
	var content = message.content;
	if (imageId == undefined ) imageId ="";
	if (imageOwnId == undefined ) imageOwnId ="";
	if (content == undefined ) content ="";
	insertThisMessage(messageTypeName,messageId,sourceId,sourceName,imageId,imageOwnId,content);
	updateNewMessageNum(1);
}

function multiMessageHandler(message){
	var messagelength = message.length;
	for (var i=0;i<messagelength;i++){
		var messageTypeName = message[i].messageType;
		var messageId = message[i].messageId;
		var sourceId = message[i].friend.userId;
		var sourceName = message[i].friend.fullName;
		var imageId = message[i].imageId;
		var imageOwnId = message[i].imageOwnerid;
		var content = message[i].content;
		if (imageId == undefined ) imageId ="";
		if (imageOwnId == undefined ) imageOwnId ="";
		if (content == undefined ) content ="";
		
		if(messageTypeName == MessageType.UPGRADE.typeName){
			refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
		}
		
		insertThisMessage(messageTypeName,messageId,sourceId,sourceName,imageId,imageOwnId,content);
	}
	updateNewMessageNum(messagelength);
}


function insertThisMessage(messageTypeName,messageId,sourceId,sourceName,imageId,imageOwnId,content){
	var messageType = findMessageTypeByTypeName(messageTypeName);
	if ($("#"+messageTypeName+"HeaderMenu").html() == undefined||$("#"+messageTypeName+"HeaderMenu").html()==""){
		//no this type message exists
		enableHeaderMenu(1,messageType);
		drawMessageContentWrapper(messageType);
	}else{
		modifyHeaderMenuNumber(1,messageTypeName);
	}
	var iconName = pickIconName(messageType.typeName);
	$("#"+messageTypeName+"MessageContent").append(thisMessageContentHTML(sourceId,messageId,imageId,sourceName,iconName,messageType));
	singleMessageButtonHandler(messageType,sourceId,messageId,imageId,imageOwnId,content);
}

function modifyHeaderMenuNumber(num,messageTypeName){
	var newNum = Number($("#"+messageTypeName+"HeaderMenu").find(".messageNumber").html())+num;
	$("#"+messageTypeName+"HeaderMenu").find(".messageNumber").html(newNum);
}

function findMessageTypeByTypeName(typeName){
	if(MessageType.INVITETOUPLOAD.typeName == typeName)	return MessageType.INVITETOUPLOAD;
	if(MessageType.ADDFRIEND.typeName == typeName)	return MessageType.ADDFRIEND;
	if(MessageType.ACCEPTFRIEND.typeName == typeName)	return MessageType.ACCEPTFRIEND;
	if(MessageType.TAKEQUOTE.typeName == typeName)	return MessageType.TAKEQUOTE;
	if(MessageType.REJECTIMAGE.typeName == typeName)	return MessageType.REJECTIMAGE;
	if(MessageType.ACCEPTIMAGE.typeName == typeName)	return MessageType.ACCEPTIMAGE;
	if(MessageType.REPLY.typeName == typeName)	return MessageType.REPLY;
	if(MessageType.UPGRADE.typeName == typeName)	return MessageType.UPGRADE;
	return null;
}









