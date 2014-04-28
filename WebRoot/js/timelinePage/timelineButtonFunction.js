/*********************************************************************************
 *	Load more item button function 	
 * 	show next batch feed  
 */
function loadMoreButtonHandler(){
	$("#loadMoreButton").click(function(){
		showNextBatchFeed(NUM_NEXT_BATCH_ITEM_ON_TIMELINE);
		timelineInitialize(".timelineWrapper");
	});
}

function showNextBatchFeed(numToShow){
	
	showLoadingButton();
	
	var currPointer = $.cookie("truthbook_Timeline_Item_Pointer"),
		nextEndPoint = numToShow + currPointer;
	if(currPointer>=numTimelineItem){
		//ToDo: Launch another ajax call
		disableLoadMoreButton();
		return;
	}
	for (;currPointer < nextEndPoint ;currPointer++){	
		var element = prepareFeed(allTimelineItem[currPointer],true,Comment);
//		$(".timelineWrapper").masonry( 'appended', element );
		
		if(currPointer == numTimelineItem - 1){
			//ToDo: Launch another ajax call
			$.cookie("truthbook_Timeline_Item_Pointer", numTimelineItem);
			disableLoadMoreButton();
			return;
		}
	}
	$.cookie("truthbook_Timeline_Item_Pointer", currPointer);
	showRefreshButton();
	return;
}

function showLoadingButton(){
	$("#loadMoreButton").html("<i class=\"loading large icon\"></i>");
}
function disableLoadMoreButton(){
	$("#loadMoreButton").addClass("disable").html("没有更多了...");
}
function showRefreshButton(){
	$("#loadMoreButton").html("加载更多");
}


/*********************************************************************************
 *	Reply someone 	
 * 	Remove image click function and its help function 
 */

function replySomeone(imageId,repliedByName,repliedByCommentId){
	$("#itemId"+imageId).find(".replyToId").html(repliedByCommentId);
	$("#itemId"+imageId).find(".replyToName").html(repliedByName);
	thisText = $("#itemId"+imageId).find(".textarea");
	tempInput = thisText.val();
	if (tempInput.substr(0,2) == "回复"){
		tempInput = tempInput.substring(tempInput.indexOf("：")+1)		
	} 
	thisText.val("").focus().val("回复"+ repliedByName+" ："+tempInput);
}


/*********************************************************************************
 *	delete message 	
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
			}
			});		
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
 *	9.	add comment 	
 * 	submit comment click function and its help function 
 */

function submitComment(imageId,imageOwnerId){
	var thisText = $("#itemId"+imageId).find(".textarea");
	var thisReplyForm = thisText.parent().parent();
	if (thisText.val() != ""){
		var userId = imageOwnerId,
			content = thisText.val(),
			repliedToId	= thisReplyForm.children(".replyToId").html(),
			repliedById = $.cookie("truthbook").userId;

		var onAjaxSuccess = function(data, textStatus) {
			if (data != null){
				var commentId = data;
				var onAddCommitToImageAjaxSuccess = function(data, textStatus) {
					if (data == true){
						submitCommentStart(commentId,imageId,thisText,thisReplyForm,userId);				
					}else{
						drawConfirmPopUp("回复失败");
					}
				};
				var onAddCommitToImageAjaxError = function(xhr, textStatus, error) {
					drawConfirmPopUp("关联回复-图片请求发送失败 Error: "+error);
				};
				addCommentToImageByImageIdAPI(imageId,data,onAddCommitToImageAjaxSuccess,onAddCommitToImageAjaxError);
				
			}else{
				drawConfirmPopUp("回复失败");
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			drawConfirmPopUp("添加回复请求发送失败 Error: "+error);
		};
		if (repliedToId==""){
			simpleCommentAPI(userId,content,repliedById,onAjaxSuccess,onAjaxError);
		} else{
			content = content.substring(content.indexOf("：")+1);
			fullCommentAPI(userId,content,repliedToId,repliedById,onAjaxSuccess,onAjaxError);
		}
	} else {
		cleanTheTempVar(thisReplyForm);
		thisText.attr("placeholder","有些话不知道要怎么说出来...");
		thisText.focus();
	}
}

function submitCommentStart(commentId,imageId,thisText,thisReplyForm,imageOwnerId){	
	var	commentContent = thisText.val();
	var	repliedByCommentId = $.cookie("truthbook").userId;
	var	repliedByName = $.cookie("truthbook").fullName;
	var	repliedByProtrait = $.cookie("truthbook").defaultPortrait;
	var	repliedToCommentId = thisReplyForm.children(".replyToId").html();
	var	repliedToName = thisReplyForm.children(".replyToName").html();
	var	createDate = new Date();
//	var	createDate = createDate.toLocaleDateString();
		createDate = "just now";
	if(repliedToCommentId!=""){
		var replyToDisplay = "inline";
		commentContent = commentContent.substring(commentContent.indexOf("：")+1);
	}else{
		var replyToDisplay = "none";
	}
	var	replyDisplay = "none",
		deleteDisplay = "inline";
	
	
	repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

	
	$("#itemId"+imageId).find(".commentwrap").append(thistimelineCommentHTML(commentId,commentContent,
			repliedByCommentId,repliedByName,repliedByProtrait,
			repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
	
	//Add delete handler
	$("#delete"+commentId).click(function(){
		removeComment(imageId,commentId);
	});
	
	resetTextarea(thisText);
	cleanTheTempVar(thisReplyForm);
	moveDownScroll($("#itemId"+imageId).find(".commentwrap"));
	var thisOwnerId = imageOwnerId;
	var uploaderId = $("#itemId"+imageId).find(".uploaderId").html();
	sendMessageToAboveAll($("#itemId"+imageId).find(".commentwrap").find(".repliedByCommentId_span"),imageId,thisOwnerId,uploaderId);
}

function resetTextarea(thisText){
	thisText.val("");
	thisText.attr("placeholder","你想说...");
}

function cleanTheTempVar(thisReplyForm){
	thisReplyForm.children(".replyToId").html("");
	thisReplyForm.children(".replyToName").html("");
}

function moveDownScroll(thisElem){
	thisElem.scrollTop(thisElem[0].scrollHeight);
}

function sendMessageToAboveAll(thiscomment,imageId,ownId,uploaderId){
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
	if(uploaderId != selfId) {
		sendMessageWithImageIdAPI(uploaderId,selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(uploaderId);
	}
	
	for(var i=0;i<numMessageToSend;i++){
		if(thiscomment[end-i].innerHTML==selfId || $.inArray(thiscomment[end-i].innerHTML, nameList)!=-1) continue;
		//send message
		sendMessageWithImageIdAPI(thiscomment[end-i].innerHTML, selfId,imageId, MessageType.REPLY.typeName);
		nameList.push(thiscomment[end-i].innerHTML);
	}
	
	
}