/*
 *	All the buttons' function on an Image Item.
 *	1.	Like/Dislike :	One can click multiple times when refresh the page	
 *	2.	Show reply contents on the back
 *	3.	Return to sender
 *	4.	Upload image for sender
 *	5.	Set as portrait
 *	6.	Remove image 
 *	7.	Reply someone
 *	8.	delete message
 *	9.	add message
 *	10.	check @ function 
 * 	 
 *	Stranger handler
 *
 */

/*********************************************************************************
 *	1.	Like/Dislike 	
 *	Like this image click function and its help function 
 */

function likeThisImage(thisElem,imageId){
	var onLikeAjaxSuccess = function(data, textStatus) {
		if (data == true){
			setNumOfLike(thisElem,1);
		}else{
			enableLikeBtn(thisElem,imageId);
			drawConfirmPopUp("点赞失败");
		}
	};
	var onLikeAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("点赞失败请求发送失败 Error: "+error);
	};
	
	var onDislikeAjaxSuccess = function(data, textStatus) {
		if (data == true){
			setNumOfLike(thisElem,-1);
		}else{
			disableLikeBtn(thisElem,imageId);
			drawConfirmPopUp("取消点赞失败");
		}
	};
	var onDislikeAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("取消点赞失败请求发送失败 Error: "+error);
	};
	
	if(thisElem.parent().find(".red").attr("class") == undefined){
		disableLikeBtn(thisElem,imageId);
		setLikedByImageIdAPI(imageId,onLikeAjaxSuccess,onLikeAjaxError);
	} else {
		enableLikeBtn(thisElem,imageId);
		setDislikedByImageIdAPI(imageId,onDislikeAjaxSuccess,onDislikeAjaxError);	
	}
}

function disableLikeBtn(thisElem,imageId){
	thisElem.addClass("inverted red");
	thisElem.children().addClass("empty");
}

function enableLikeBtn(thisElem,imageId){
	thisElem.removeClass("inverted red");
	thisElem.children().removeClass("empty");
}

function setNumOfLike(thisElem,num){
	thisElem.parent().parent().parent().find('.numLikeSpan').html(
								Number(thisElem.parent().parent().parent().
										find('.numLikeSpan').html())+num);
}

/*********************************************************************************
 *	2.	Show reply contents on the back
 *	Show reply of this image click function and its help function 
 */

function showReply(thisElem){
	flipTheImageCard(thisElem);
	moveDownScroll(thisElem.parents('.ui.shape').find(".commentwrap"));
}

function flipTheImageCard(thisElem){
	thisElem.parents('.ui.shape')
	.shape('setting', {
		onChange: function(){
			$('#eventsegment').masonry();
		},
		duration:500
	})
	.shape('flip over');
}

/*********************************************************************************
 *	3.	Return to sender
 *	Return to sender click function and its help function 
 */

function returnToSender(thisElem){
	disableThisPopup("returnToSender");
	confirmReturnToSenderPopUp(thisElem);
}

function returnToSenderStart(imageURL,userId,uploaderId,description){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			drawConfirmPopUp("分享照片成功");
		}else{
			drawConfirmPopUp("分享照片失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("分享给用户请求发送失败 Error: "+error);
	};
	addImageAPI(imageURL,uploaderId,userId,description,onAjaxSuccess,onAjaxError);
}

function confirmReturnToSenderPopUp(thisElem){
	var uploaderId = thisElem.parent().parent().find(".uploaderId").html(),
		uploaderName = thisElem.parent().parent().find(".uploaderName").html(),
		description = thisElem.parent().parent().find(".description").html(),
		userId = thisElem.parent().parent().parent()
			.parent().parent().parent().find(".userId_span").html(),
		imageURL = thisElem.parent().parent().parent()
			.parent().parent().parent().find(".url_span").html();	
	var header = "确定把照片分享给"+ uploaderName +"？";
	var content = "等下一个天亮<br>" +
					"&ensp;&ensp;&ensp;&ensp;把偷拍我看海的照片送我好吗";
	var negativeBtn = "取消";
	var negativeBtnHidden = "还是自己一个人纪念";
	var positiveBtn = "确定";
	var positiveBtnHidden = "这是我们共同的回忆";
	var logo="share";
	approveFunction = function() {
		returnToSenderStart(imageURL,userId,uploaderId,description);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, 
						positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}


/*********************************************************************************
 *	4.	Upload image for sender
 *	UploadFor click function and its help function 
 */

function uploadFor(thisElem){
	disableThisPopup("uploadFor");
	var id = thisElem.parent().parent().find(".uploaderId").html();
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
/*********************************************************************************
 *	5.	Set as portrait
 *	Set Portrait click function and its help function 
 */

function setPortrait(thisElem){
	disableThisPopup("setPortrait");
	confirmSetPortrait(thisElem);
}

function setPortraitStart(thisElem){
	var imageId = thisElem.parent().parent().parent()
					.parent().parent().parent().find(".imageId_span").html(),
		userId = thisElem.parent().parent().parent()
					.parent().parent().parent().find(".userId_span").html();

	var onSetAjaxSuccess = function(data, textStatus) {
		if (data == false){
			drawConfirmPopUp("设置头像失败");
		}else{
			setPortraitImageForThisPage();
			drawConfirmPopUp("设置头像成功");
		}
	};
	var onSetAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("设置头像请求发送失败 Error: "+error);
	};
	
	setPortraitAPI(userId,imageId,onSetAjaxSuccess,onSetAjaxError);
}

function confirmSetPortrait(thisElem){
	var header = "确定把这张照片设置为头像？";
	var content = "似木头似石头的话<br>" +
					"&ensp;&ensp;&ensp;&ensp;得到注意吗";
	var negativeBtn = "取消";
	var negativeBtnHidden = "这张还是不够好看";
	var positiveBtn = "确定";
	var positiveBtnHidden = "是颜色不一样的花火";
	var logo="user";
	approveFunction = function() {
		setPortraitStart(thisElem);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, 
						positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}


/*********************************************************************************
 *	6.	Remove image 	
 * 	Remove image click function and its help function 
 */

function removeImage(thisElem){
	disableThisPopup("eventRemove");
	confirmRemoveImage(thisElem);
}

function removeImageStart(thisElem) {
	var imageId = thisElem.parent().parent().parent()
					.parent().parent().parent().find(".imageId_span").html(),
		rmelement = thisElem.parents(".eventpile");
	
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			$("#eventsegment").masonry( 'remove', rmelement);
			$("#eventsegment").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
				$('#eventsegment').masonry();
				deleteThisImageFromApprovedList(imageId);
				itemInitialize("#eventsegment");
			} );
		}else{
			drawConfirmPopUp("删除失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("删除请求发送失败 Error: "+error);
	};
	deleteImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError);
}

function confirmRemoveImage(thisElem){
	var header = "确定要删除这张照片？";
	var content = "我记得那年生日<br>" +
					"&ensp;&ensp;&ensp;&ensp;也记得那一首歌";
	var negativeBtn = "取消";
	var negativeBtnHidden = "给我再去相信的勇气";
	var positiveBtn = "确定";
	var positiveBtnHidden = "真相太赤裸裸";
	var logo="user";
	approveFunction = function() {
		removeImageStart(thisElem);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, 
						positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}

/*********************************************************************************
 *	7.	Reply someone 	
 * 	Remove image click function and its help function 
 */

function replySomeone(imageId,repliedByName,repliedByCommentId){
	$("#imageId"+imageId).find(".replyToId").html(repliedByCommentId);
	$("#imageId"+imageId).find(".replyToName").html(repliedByName);
	thisText = $("#imageId"+imageId).find(".textarea");
	tempInput = thisText.val();
	if (tempInput.substr(0,2) == "回复"){
		tempInput = tempInput.substring(tempInput.indexOf("：")+1)		
	} 
	thisText.val("").focus().val("回复"+ repliedByName+" ："+tempInput);
}


/*********************************************************************************
 *	8.	delete message 	
 * 	Remove image click function and its help function 
 */

function removeComment(imageId,commentId){
	confirmRemoveComment(imageId,commentId);
}

function removeCommentStart(imageId,commentId){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			$("#commentId"+commentId).transition({
				animation : 'horizontal flip out', 
				duration  : '0.3s',
				complete  : function() {
					$("#commentId"+commentId).hide();
					$("#eventsegment").masonry();
			}
			});
			
			changeTheTotalCommentNumber($("#imageId"+imageId).find(".numOfComment_inline"),-1);
		}else{
			drawConfirmPopUp("删除回复失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("删除回复请求发送失败 Error: "+error);
	};
	
	deleteCommentByCommentIdAPI(imageId,commentId,onAjaxSuccess,onAjaxError);
}


function confirmRemoveComment(imageId,commentId){
	var header = "确定要删除这条回复？";
	var content = "不算什麽<br>&ensp;&ensp;爱错就爱错<br>&ensp;&ensp;&ensp;&ensp;早点认错<br>"+
					"&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;早一点解脱";
	var negativeBtn = "取消";
	var negativeBtnHidden = "不够爆炸";
	var positiveBtn = "确定";
	var positiveBtnHidden = "所有错误从我这里落幕";
	var logo="trash";
	approveFunction = function() {
		removeCommentStart(imageId,commentId);
	};
	onDenyFunction = function() {
		return true;
	};
	testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, 
						positiveBtnHidden, approveFunction,onDenyFunction, logo);	
}

/*********************************************************************************
 *	9.	add message 	
 * 	submit comment click function and its help function 
 */

function submitComment(imageId){
	var thisText = $("#imageId"+imageId).find(".textarea");
	var thisReplyForm = thisText.parent().parent();
	var atListLength = $("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed .atName").length;

	if (thisText.val() != "" || atListLength != 0){
		var userId = $.cookie("truthbook_PageOwner_userId").userId,
			content = thisText.val(),
			repliedToId	= thisReplyForm.children(".replyToId").html(),
			repliedById = $.cookie("truthbook").userId;
		var atList = [];
		var preAtContent="",preAtContentToDisplay="";
		for(var i=0;i<atListLength;i++){
			atList[i]=[];
			atList[i][0]=$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed .atName")[i].innerHTML;
			atList[i][1]=$("#imageId"+imageId).find(".atNotationRegion .atUserIcon")[i].classList[1];
			preAtContent += "@"+atList[i][0]+"(#"+atList[i][1]+") ";
			preAtContentToDisplay += "<span class='nameOnAtList_span' " +
					"style='font-weight:bold;color:#4C7A9F;cursor:pointer;' " +
					"onClick='goOthersPage("+atList[i][1]+")'>@"+atList[i][0]+" </span>";
		}
		 
		content = preAtContent+content.substring(content.indexOf("：")+1);
		
		var onAjaxSuccess = function(data, textStatus) {
			if (data != null){
				var commentId = data;
				var onAddCommitToImageAjaxSuccess = function(data, textStatus) {
					if (data == true){
						submitCommentStart(commentId,imageId,thisText,thisReplyForm,preAtContentToDisplay,atList);				
					}else{
						drawConfirmPopUp("回复失败");
					}
				};
				var onAddCommitToImageAjaxError = function(xhr, textStatus, error) {
					drawConfirmPopUp("关联回复-图片请求发送失败 Error: "+error);
				};
				addCommentToImageByImageIdAPI(imageId,data,onAddCommitToImageAjaxSuccess,onAddCommitToImageAjaxError);
				
			}else{
				drawConfirmPopUp("回复失败<br>(可能字数太多咯)");
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			drawConfirmPopUp("添加回复请求发送失败 Error: "+error);
		};
		if (repliedToId==""){
			simpleCommentAPI(userId,content,repliedById,onAjaxSuccess,onAjaxError);
		} else{
//			content = content.substring(content.indexOf("：")+1);
			fullCommentAPI(userId,content,repliedToId,repliedById,onAjaxSuccess,onAjaxError);
		}
	} else {
		cleanTheTempVar(thisReplyForm);
		thisText.attr("placeholder","有些话不知道要怎么说出来...");
		thisText.focus();
	}
}

function submitCommentStart(commentId,imageId,thisText,thisReplyForm,preAtContentToDisplay,atList){	
	var	commentContent = thisText.val();
	var	repliedByCommentId = $.cookie("truthbook").userId;
	var	repliedByName = $.cookie("truthbook").fullName;
	var	repliedByProtrait = $.cookie("truthbook").defaultPortrait;
	var	repliedToCommentId = thisReplyForm.children(".replyToId").html();
	var	repliedToName = thisReplyForm.children(".replyToName").html();
//	var	createDate = new Date();
//	var	createDate = createDate.toLocaleDateString();
	var	createDate = "just now";
	if(repliedToCommentId!=""){
		var replyToDisplay = "inline";
		commentContent = commentContent.substring(commentContent.indexOf("：")+1);
	}else{
		var replyToDisplay = "none";
	}
	var	replyDisplay = "none",
		deleteDisplay = "inline";
	
	commentContent = preAtContentToDisplay + commentContent;
	repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

	recurCleanAtZone(imageId,atList);
	
	
	$("#imageId"+imageId).find(".commentwrap").append(thisCommentHTML(commentId,commentContent,
			repliedByCommentId,repliedByName,repliedByProtrait,
			repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
	
	//Add delete handler
	$("#delete"+commentId).click(function(){
		removeComment(imageId,commentId);
	});
	
	
	resetTextarea(thisText);
	$('#eventsegment').masonry();
	changeTheTotalCommentNumber($("#imageId"+imageId).find(".numOfComment_inline"),1);
	cleanTheTempVar(thisReplyForm);
	moveDownScroll($("#imageId"+imageId).find(".commentwrap"));
	
	$("#imageId"+imageId).find(".atNotationRegion .atZoneTitle").hide("slow");
	$("#imageId"+imageId).find(".enterHint").hide("slow");
	$("#eventsegment").masonry();
	atNotationFlag = 0;
	
	
//	cleanTheAtZone(imageId,atList);
	var thisOwnerId = $("#imageId"+imageId).find(".userId_span").html();
	var uploaderId = $("#imageId"+imageId).find(".uploaderId").html();
	sendMessageToAboveAll($("#imageId"+imageId).find(".commentwrap").find(".repliedByCommentId_span"),imageId,thisOwnerId,uploaderId,atList);
}

function cleanTheAtZone(imageId,atList){
	for(var i=0;i<atList.length;i++){
		try{
			var rmelement = $("#imageId"+imageId).find(".atUserIcon."+atList[i][1]);
			$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
			$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
				$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
			});	
		}catch(e){
		}
	}
	$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
	$("#eventsegment").masonry();
}

function recurCleanAtZone(imageId,atList){
	if(atList.length == 0) {
//		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
//		$("#eventsegment").masonry();
		
		var atList = [];
		var atListLength = $("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed .atName").length;
		for(var i=0;i<atListLength;i++){
			atList[i]=[];
			atList[i][0]=$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed .atName")[i].innerHTML;
			atList[i][1]=$("#imageId"+imageId).find(".atNotationRegion .atUserIcon")[i].classList[1];
		}
		cleanTheAtZone(imageId,atList);
		$("#imageId"+imageId).find(".atNotationRegion .atzone").html("");
//		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
//		$("#eventsegment").masonry();
		return;
	}
	var pickANumber = Math.floor(Math.random()*10)%(atList.length);
	var rmelement = $("#imageId"+imageId).find(".atUserIcon."+atList[pickANumber][1]);
	
	$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
	$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
		atList.splice(pickANumber,1);
		recurCleanAtZone(imageId,atList);
	});	
}

function resetTextarea(thisText){
	thisText.val("");
	thisText.attr("placeholder","你想说...");
}

function changeTheTotalCommentNumber(thisElem,num){
	currComment = Number(thisElem.html());
	currComment = currComment +num;
	if (currComment >= 0){
		thisElem.html(currComment);
	} else {
		thisElem.html(0);
	}
}

function cleanTheTempVar(thisReplyForm){
	thisReplyForm.children(".replyToId").html("");
	thisReplyForm.children(".replyToName").html("");
}

function moveDownScroll(thisElem){
	thisElem.scrollTop(thisElem[0].scrollHeight);
}

function sendMessageToAboveAll(thiscomment,imageId,ownId,uploaderId,atList){
	var numReply = thiscomment.length;
	var numMessageToSend = returnSmaller(numReply,MAX_MesssageToSend);
	var end =thiscomment.length-1;
	var selfId = $.cookie("truthbook").userId; 
	var nameList = new Array();
	
	//send message to image owner & uploader
	if(ownId != selfId)	{
		sendMessageWithImageIdAPI(ownId,selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(ownId);
	}

	if(uploaderId != selfId){
		sendMessageWithImageIdAPI(uploaderId,selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(uploaderId);
	}
	
	for(var i=0;i<numMessageToSend;i++){
		if(thiscomment[end-i].innerHTML==selfId || $.inArray(thiscomment[end-i].innerHTML, nameList)!=-1) continue;
		//send message
		sendMessageWithImageIdAPI(thiscomment[end-i].innerHTML, selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(thiscomment[end-i].innerHTML);
	}
	
	for(var i=0;i<atList.length;i++){
		if($.inArray(atList[i][1], nameList)!=-1) continue;
		//send message
		sendMessageWithImageIdAPI(atList[i][1], selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(atList[i][1]);
	}	
}

/*********************************************************************************
 *	10.	check @ function 
 * 	check @ function and its help function 
 */
function checkAtSomeone(textarea){
	var textInput = textarea.value;
//	console.log(textInput.replace(/(\r)*\n/g,"<br/>"));
	
	
	if(textInput.indexOf("@")==-1){
		hideEnterHintMessage(textarea);
		atNotationFlag=0;
		return;
	}else{
		atNotationFlag = 1;
		enableAtzoneTitle(textarea);
		if(textInput[textInput.indexOf("@")+1]==undefined){
			textarea.parentNode.parentNode.childNodes[1].style.display="none";
			$("#eventsegment").masonry();
		}

	}
	
	var textInputfull = textInput.replace(/(\r)*\n/g,"<br/>");
	
	if(textInputfull.substr(textInput.length-1)=="<br/>"){
		textarea.value=textInput.substr(0,textInput.lastIndexOf("@"));
		hideEnterHintMessage(textarea);
		addAtzoneController(textarea);
		atNotationFlag=0;
		return;
	}
	
	textarea.parentElement.parentElement.childNodes[0].childNodes[1].innerHTML = "";
	var name = textInput.substr(textInput.lastIndexOf("@")+1,MAX_FULLNAME_LENGTH);
	if (name.length == 0) return;

	var bonusForAll = 0;
	if(name == INS_FOR_ALL){
		bonusForAll = 1;
	}
	
	var orderNumber = 1;
	for(var i=0;i<userFriendsLists.nFriends.length;i++){
		if(userFriendsLists.nFriends[i].fullName.substr(0,name.length) != name && bonusForAll == 0){
			continue;
		}
		addThisUserToAtzone(textarea,userFriendsLists.nFriends[i],orderNumber);
		orderNumber++;
	}
	for(var i=0;i<userFriendsLists.eFriends.length;i++){
		if(userFriendsLists.eFriends[i].fullName.substr(0,name.length) != name && bonusForAll == 0){
			continue;
		}
		addThisUserToAtzone(textarea,userFriendsLists.eFriends[i],orderNumber);
		orderNumber++;
	}
}


function enableEnterHintMessage(textarea){
	textarea.parentNode.parentNode.childNodes[1].style.display="block";
	$("#eventsegment").masonry();
}

function hideEnterHintMessage(textarea){
	textarea.parentNode.parentNode.childNodes[1].style.display="none";
	$("#eventsegment").masonry();
	if(textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes.length==0 &&
			textarea.parentElement.parentElement.childNodes[0].childNodes[1].childNodes.length==0	){
		hideAtzoneTitle(textarea);
	}
}

function enableAtzoneTitle(textarea){	
	textarea.parentNode.parentNode.childNodes[0].childNodes[0].style.display="block";
	$("#eventsegment").masonry();
}

function hideAtzoneTitle(textarea){
	textarea.parentNode.parentNode.childNodes[0].childNodes[0].style.display="none";
	$("#eventsegment").masonry();
}

function addAtzoneController(textarea){
	var existAtFlag = 0;
	if(textarea.parentElement.parentElement.childNodes[0].childNodes[2].innerHTML !=""){
		existAtFlag=1;
	}
	var elementLength = textarea.parentElement.parentElement.childNodes[0].childNodes[1].childNodes.length;
	textarea.parentElement.parentElement.childNodes[0].childNodes[2].innerHTML += textarea.parentElement.parentElement.childNodes[0].childNodes[1].innerHTML;
	textarea.parentElement.parentElement.childNodes[0].childNodes[1].innerHTML = "";
	var allElementLength = textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes.length;
	var imageId = textarea.classList[1];
	deleteNode = $("#imageId"+imageId).find(".confirmed .atusername");
	
	if (existAtFlag == 1){
		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
	}
	
	for(var i=0;i<allElementLength;i++){
		var atUserId = textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes[i].childNodes[0].classList[3];
//		if(textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes[i].childNodes[0].classList[4]!="red"){
//			continue;
			addDeleteNodeHander(textarea,deleteNode,atUserId,imageId,i,elementLength);
//		}
		handAtDelete(textarea,imageId,atUserId);
	}
}

function handAtDelete(textarea,imageId,atUserId){
	$("#imageId"+imageId).find(".atUserIcon."+atUserId).click(function(){
		var rmelement = $("#imageId"+imageId).find(".atUserIcon."+atUserId);
		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
			$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
//
//			atzoneInitialize(imageId);
			if(textarea.parentElement.parentElement.childNodes[0].childNodes[2].innerHTML ==""){
				$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
			}
		});
	});
}

function addDeleteNodeHander(textarea,deleteNode,atUserId,imageId,i,elementLength){
	if(i==0){
		atzoneInitialize(imageId);
		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
	}else{
		var element = $("#imageId"+imageId).find(".atNotationRegion .ui.label.atusername."+atUserId).parent();
//		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'appended', element );
		$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
	}
	deleteNode.find(".icon."+atUserId).parents(".atusername").addClass("red");


}

function addThisUserToAtzone(textarea,thisUser,order){
	if(existThisUserInAtzone(textarea,thisUser)) return;
	if(order>9){
		var orderDisplay = "none";
	}else{
		var orderDisplay = "inline";
	}
	var html = 
		"<div class='atUserIcon "+thisUser.userId+"' style='display:inline'>"+
			"<a class=\"ui label atusername "+thisUser.userId+"\" style='margin: 4px;'>"+
				"<span class='atNameOrder' style='display:"++"'>"+order+":</span><span class='atName' style='display:inline'>"+thisUser.fullName+"</span>"+
				"<i class=\"delete icon "+thisUser.userId+"\" style='display:inline'></i>"+
			"</a>"+
		"</div>";
	textarea.parentElement.parentElement.childNodes[0].childNodes[1].innerHTML += html;
}

function existThisUserInAtzone(textarea,thisUser){
	try{	
		var newUserLength = textarea.parentElement.parentElement.childNodes[0].childNodes[1].childNodes.length;
		for(var i=0;i<newUserLength;i++){
			var userId = textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes[i].childNodes[0].classList[3];
			if(userId==thisUser.userId){
				return true;
			}
		}
	}
	catch(e){
//		console.log("newUserError");
	}
	try{
		var addedUserLength = textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes.length;
		for(var i=0;i<addedUserLength;i++){
			var userId = textarea.parentElement.parentElement.childNodes[0].childNodes[2].childNodes[i].childNodes[0].classList[3];
			if(userId==thisUser.userId){
				return true;
			}
		}
	}
	catch(e){
//		console.log("addedUserError");
	}
	enableEnterHintMessage(textarea);
	return false;
}



function atzoneInitialize(imageId){
	$("#imageId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry({		
		itemSelector: '.atUserIcon',
        columnWidth: 5,
		gutter: 4});
}

/*********************************************************************************
 * 	Remove all the popup after someone click above buttons.
 */

function disableThisPopup(thisElem){
	$("."+thisElem)
	  .popup('hide')
	;
}

/*********************************************************************************
 * 	Stranger cannot send message cannot see comment
 */
function strangerHandler(imageId){
	$("#imageId"+imageId).find(".commentwrap").html(
		"<h3 class='ui center aligned header' style='color:#999999'>加为好友才能看到评论哦</h3>");

}

function promptAddFriend(imageId){
	thisText = $("#imageId"+imageId).find(".textarea");
	thisText.val("");
	thisText.attr("placeholder","加为好友才能留言哦...");
	thisText.focus();
}


