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
//		confirmDeleteFriendPopUp();
		var header = "真的不能再做朋友了么？",
		content = "从前共你\t促膝把酒倾通宵都不够<br>我有痛快过\t你有没有?",
		negativeBtn = "算了，还是继续做朋友",
		positiveBtn = "不，真的不能和你再做朋友了。";
		approveFunction = function() {
			deleteFriendByTmpButton();
		};
		testModalPopup(header, content, negativeBtn, positiveBtn, approveFunction);
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

/*	This function need to be modified!!!
 *  Now, only valid for delete by OwnersPage delete button. 
 *
 */

function deleteFriendByTmpButton(){
	var path = "v1/friends/";
	var userId = $.cookie("truthbook").userId + "/";
	var friendId = $.cookie("truthbook_PageOwner_userId").userId;
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
	var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
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




