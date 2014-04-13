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
	getInviteToUploadMessage();
	getFriendRequestMessage();
}

function getInviteToUploadMessage(){
	var receiver = $.cookie("truthbook").userId;
	var path = "v1/message/"+receiver + MessageType.INVITETOUPLOAD + "/get";
	var url = ServerRoot + ServiceType.NOTIFICATION + path;
	var onAjaxSuccess = function(data, textStatus) {
//		drawConfirmPopUp("test data : " + messageLengthJson(data));
		if (data == null){
			//maybe need to modify the number of total message later
		}else{
			var numOfInviteToUploadMessage = messageLengthJson(data);
			if (numOfInviteToUploadMessage > 0){
				updateNewMessageNum(numOfInviteToUploadMessage);
				updateNewMessageMenuList(numOfInviteToUploadMessage,data);
			}
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		console.log("getFriends error: "+ error);
	};
	var ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
	ajax_call(ajax_obj);
}

function updateNewMessageNum(numOfInviteToUploadMessage){
	var newNumOfMessage =numOfInviteToUploadMessage;// +Number($("#unreadMessageNum").html())
	if (newNumOfMessage <= 0){
		$("#unreadMessageNum").hide();
	} else if (newNumOfMessage<10){
		showMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html("0" + newNumOfMessage);
	} else {
		showMessageNumberTransition("#unreadMessageNum");
		$("#unreadMessageNum").html(newNumOfMessage);
	}
}

function showMessageNumberTransition(id){
	$(id).transition({	
		animation : 'scale fade in', 
		duration  : '0.6s',
	});
	$(id).show();
}

function showHiddenMessageTransition(id){
//	$(id).transition({	
//		animation : 'toggle', 
//		duration  : '0.4s',
//	});
	$(id).slideToggle("slow");

}

function enableHeaderMenu(numOfInviteToUploadMessage){
	html = "<div class=\"header item\" id=\"inviteMessageHeaderMenu\"><i class=\"cloud upload icon\"></i>" + 
			numOfInviteToUploadMessage + "条上传照片邀请</div>"
	$("#inviteMessageMenu").html(html);
}

function updateNewMessageMenuList(numOfInviteToUploadMessage,data){
	enableHeaderMenu(numOfInviteToUploadMessage);
	var html = "<div id = \"inviteMessageContent\" style=\"display:none;\">";
	for(var i=0;i<numOfInviteToUploadMessage;i++){
		if (numOfInviteToUploadMessage == 1){
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
			"<a class=\"upload_for_fri_btn\"><i class=\"cloud upload large icon\"></i></a>" +
			"<a class=\"delete_message_btn\"><i class=\"remove large icon\"></i></a>" +
			"</div>" +
			"<div class=\"content message\" style=\"padding-top: 7px;font-size:16px;width:120px\">" +
			fullName + "：帮我传张照片吧" +
			"</div></div>";
	}
	html = html +"</div>";
	$("#inviteMessageMenu").append(html);
	$("#inviteMessageHeaderMenu").click(function(){
		showHiddenMessageTransition("#inviteMessageContent");
	});
	
	$(".list.menu.message .item.message").hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	
	$(".list.menu.message .upload_for_fri_btn").click(function() {
		var id = $(this).parent().children(".this_userId").html();
		var path = "v1/" + id;
		var url = ServerRoot + ServiceType.LOGIN + path;
		var onAjaxSuccess = function(data, textStatus) {
			if (data == null){
				console.log("cannot get friend object by id");
			}else{
				upload_choosepic(data);
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			console.log("getFriends error: "+ error);
		};
		var ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
		ajax_call(ajax_obj);
	});
	
	$(".list.menu.message .delete_message_btn").click(function() {
		var id = $(this).parent().children(".this_messageId").html();
		var path = "v1/message/"+id+"/read";
		var url = ServerRoot + ServiceType.NOTIFICATION + path;
		var onAjaxSuccess = function(data, textStatus) {
			if (data == true){
				drawConfirmPopUp("delete");
//				getInviteToUploadMessage();
			}else{
				drawConfirmPopUp("cannot delete");
				console.log("cannot delete message");
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			drawConfirmPopUp("delete ajax error: " + error);			
//			console.log("getFriends error: "+ error);
		};
		var ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
		ajax_call(ajax_obj);
		
	});
}











