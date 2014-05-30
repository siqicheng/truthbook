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
		var element = prepareFeed(allTimelineItem[currPointer],true,COMMENT.Yes);
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
 *	9.	add message 	
 * 	submit comment click function and its help function 
 */

function submitComment(imageId,imageOwnerId){
	var thisText = $("#itemId"+imageId).find(".textarea");
	var thisReplyForm = thisText.parent().parent();
	var atListLength = $("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed .atName").length;
    var faceImage = $("#itemId"+imageId).find(".faceDisplay").html(); 

	if (thisText.val() != "" || atListLength != 0 || faceImage !=0){
		var userId = imageOwnerId,
			content = thisText.val(),
			repliedToId	= thisReplyForm.children(".replyToId").html(),
			repliedById = $.cookie("truthbook").userId;
		var atList = [];
		var preAtContent="",preAtContentToDisplay="";
		for(var i=0;i<atListLength;i++){
			atList[i]=[];
			atList[i][0]=$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed .atName")[i].innerHTML;
			atList[i][1]=$("#itemId"+imageId).find(".atNotationRegion .atUserIcon")[i].classList[1];
			preAtContent += "@"+atList[i][0]+"(#"+atList[i][1]+") ";
			preAtContentToDisplay += "<span class='nameOnAtList_span' " +
					"style='font-weight:bold;color:#4C7A9F;cursor:pointer;' " +
					"onClick='goOthersPage("+atList[i][1]+")'>@"+atList[i][0]+" </span>";
		}
		content = preAtContent+content.substring(content.indexOf("：")+1);
		
		if(faceImage!=""){
			preFaceContent = $("#itemId"+imageId).find(".faceDisplay").children().attr("id");
			preFaceContentToDisplay = "<img src=\""+face[preFaceContent.split("_")[1]].image+"\" style='display:block;padding-bottom:5px;padding-left:20px;'>";
			preFaceContent +=" ";
			content = preFaceContent + content;
		}
		
		var onAjaxSuccess = function(data, textStatus) {
			if (data != null){
				var commentId = data;
				var onAddCommitToImageAjaxSuccess = function(data, textStatus) {
					if (data == true){
						submitCommentStart(commentId,imageId,thisText,thisReplyForm,userId,preAtContentToDisplay,atList,preFaceContentToDisplay);				
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
			fullCommentAPI(userId,content,repliedToId,repliedById,onAjaxSuccess,onAjaxError);
		}
	} else {
		cleanTheTempVar(thisReplyForm);
		thisText.attr("placeholder","有些话不知道要怎么说出来...");
		thisText.focus();
	}
}

function submitCommentStart(commentId,imageId,thisText,thisReplyForm,imageOwnerId,preAtContentToDisplay,atList,preFaceContentToDisplay){	
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
	
	commentContent = preFaceContentToDisplay + preAtContentToDisplay + commentContent;
	repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

	recurCleanAtZone(imageId,atList);
	
	
	$("#itemId"+imageId).find(".commentwrap").append(thisCommentHTML_timeline(commentId,commentContent,
			repliedByCommentId,repliedByName,repliedByProtrait,
			repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
	
	//Add delete handler
	$("#delete"+commentId).click(function(){
		removeComment(imageId,commentId);
	});
	
	
	resetTextarea(thisText);
	cleanTheTempVar(thisReplyForm);
	moveDownScroll($("#itemId"+imageId).find(".commentwrap"));
	
	$("#itemId"+imageId).find(".atNotationRegion .atZoneTitle").hide("slow");
	$("#itemId"+imageId).find(".enterHint").hide("slow");
	atNotationFlag_timeline = 0;
	
	$("#itemId"+imageId).find(".faceDisplay").html("");
	
//	cleanTheAtZone(imageId,atList);
	var thisOwnerId = imageOwnerId;
	var uploaderId = $("#itemId"+imageId).find(".uploaderId").html();
	sendMessageToAboveAll($("#itemId"+imageId).find(".commentwrap").find(".repliedByCommentId_span"),imageId,thisOwnerId,uploaderId,atList);
}

function cleanTheAtZone(imageId,atList){
	for(var i=0;i<atList.length;i++){
		try{
			var rmelement = $("#itemId"+imageId).find(".atUserIcon."+atList[i][1]);
			$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
			$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
				$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
			});	
		}catch(e){
		}
	}
	$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
}

function recurCleanAtZone(imageId,atList){
	if(atList.length == 0) {
		var atList = [];
		var atListLength = $("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed .atName").length;
		for(var i=0;i<atListLength;i++){
			atList[i]=[];
			atList[i][0]=$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed .atName")[i].innerHTML;
			atList[i][1]=$("#itemId"+imageId).find(".atNotationRegion .atUserIcon")[i].classList[1];
		}
		cleanTheAtZone(imageId,atList);
		$("#itemId"+imageId).find(".atNotationRegion .atzone").html("");
		return;
	}
	var pickANumber = Math.floor(Math.random()*10)%(atList.length);
	var rmelement = $("#itemId"+imageId).find(".atUserIcon."+atList[pickANumber][1]);
	
	$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
	$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
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

function thisCommentHTML_timeline(commentId,commentContent,repliedByCommentId,repliedByName,repliedByProtrait,
		repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay){

var displayDate = commentDateHandle(createDate);

commentContent = addAtDisplay(commentContent);


html = 	"<div class=\"comment newcomment\" id=\"commentId" + commentId + "\">"+
"<span class = 'repliedByCommentId_span' style='display:none;'>"+repliedByCommentId+"</span>"+
"<span class = 'repliedByName_span' style='display:none;'>"+repliedByName+"</span>"+
"<span class = 'repliedToCommentId_span' style='display:none;'>"+repliedToCommentId+"</span>"+
"<span class = 'commentId_span' style='display:none;'>"+commentId+"</span>"+
"<a class=\"avatar tiny\" style=\"padding-top: 6px;\">"+
"<img src=\""+repliedByProtrait+"\" style='width:35px;height:35px;'>"+
"</a>"+
"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
"<a class=\"author firstAuthor\" style='font-weight:bold;color:#4C7A9F;font-size:12px;'>" + repliedByName + "</a>"+

"<div class='metadata' style='display:"+replyToDisplay+";margin-left: 4px;font-size:12px;'><span class='date_timeline'>to</span></div>"+
	"<a class='to author' style='display:"+replyToDisplay+";font-weight:bold;color:#4C7A9F;font-size:12px;'>"+repliedToName+"</a><span style='font-size:12px;'> :</span>"+
"<div class=\"text\" style='margin-bottom: 0px; margin-top: 0px;font-size:14px;'>"+
	commentContent+
"</div>"+
"<div class=\"actions\" style='display:inline;'>"+
      "<a class=\"reply \" style='display:"+replyDisplay+";font-size:12px;'>回复</a>"+
      "<a class=\"delete \" id='delete"+commentId+"' style='display:"+deleteDisplay+";font-size:12px;'>删除</a>"+  
"</div>"+
"<span class=\"date\" style='font-size:12px;padding-top: 2px;float:right;text-align:right;color:#999999;'>" + displayDate + "</span>"+
"</div>"+
"</div>";
return html;
}

/*********************************************************************************
 *	10.	check @ function 
 * 	check @ function and its help function 
 */
function checkAtSomeone_timeline(textarea){
	var textInput = textarea.value;
//	console.log(textInput.replace(/(\r)*\n/g,"<br/>"));
	
	var imageId = textarea.classList[1];

	if(textInput.indexOf("@")==-1){
		hideEnterHintMessage(textarea,imageId);
		$("#itemId"+imageId).find(".atNotationRegion .atzone.candidate").html("");
		atNotationFlag_timeline=0;
		return;
	}else{
		atNotationFlag_timeline = 1;
		enableAtzoneTitle(textarea,imageId);
		if(textInput[textInput.indexOf("@")+1]==undefined){
			$("#itemId"+imageId).find(".confirmInput.enterHint").hide();
		}
	}
	
	var textInputfull = textInput.replace(/(\r)*\n/g,"<br/>");
	var lastChar = textInputfull.substr(textInput.length-1);
	var numOfChoices = $("#itemId"+imageId).find(".atNotationRegion .atzone.candidate .atUserIcon").length;
	var maxChoiceNumber = returnSmaller(numOfChoices,9);
	
	if(lastChar=="<br/>"){
		textarea.value=textInput.substr(0,textInput.lastIndexOf("@"));
		hideEnterHintMessage(textarea,imageId);
		addAtzoneController(textarea,imageId);
		atNotationFlag_timeline=0;
		return;
	}
	
	if(lastChar<=maxChoiceNumber && lastChar>0){
		textarea.value=textInput.substr(0,textInput.lastIndexOf("@"));
		//cleanothercandidate
		elem = $("#itemId"+imageId).find(".atNotationRegion .atzone.candidate .atNameOrder."+lastChar).parents(".atUserIcon");		
		$("#itemId"+imageId).find(".atNotationRegion .atzone.candidate").html("");
		$("#itemId"+imageId).find(".atNotationRegion .atzone.candidate").html(elem);
		addAtzoneController(textarea,imageId);
		atNotationFlag_timeline=0;
		hideEnterHintMessage(textarea,imageId);
		return;
	}
	
	textarea.parentElement.parentElement.children[0].children[1].innerHTML = "";
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
		orderNumber += addThisUserToAtzone(textarea,userFriendsLists.nFriends[i],orderNumber);
	}
	for(var i=0;i<userFriendsLists.eFriends.length;i++){
		if(userFriendsLists.eFriends[i].fullName.substr(0,name.length) != name && bonusForAll == 0){
			continue;
		}
		orderNumber += addThisUserToAtzone(textarea,userFriendsLists.eFriends[i],orderNumber);
	}
}


function enableEnterHintMessage(textarea,imageId){
	$("#itemId"+imageId).find(".confirmInput.enterHint").show();
}

function hideEnterHintMessage(textarea,imageId){
	$("#itemId"+imageId).find(".confirmInput.enterHint").hide();
	if(textarea.parentElement.parentElement.children[0].children[2].children.length==0 &&
			textarea.parentElement.parentElement.children[0].children[1].children.length==0	){
		hideAtzoneTitle(textarea,imageId);
	}
}

function enableAtzoneTitle(textarea,imageId){
	$("#itemId"+imageId).find(".atZoneTitle.enterHint").show();
}

function hideAtzoneTitle(textarea,imageId){
	$("#itemId"+imageId).find(".atZoneTitle.enterHint").hide();
}

function addAtzoneController(textarea,imageId){
	var existAtFlag = 0;
	if(textarea.parentElement.parentElement.children[0].children[2].innerHTML !=""){
		existAtFlag=1;
	}
	
	var elementLength = $("#itemId"+imageId).find(".atNotationRegion .atzone.candidate .atUserIcon").length;
	$("#itemId"+imageId).find(".atNotationRegion .atzone.candidate .atUserIcon .atNameOrder").attr("style","display:none");
	var elem = $("#itemId"+imageId).find(".atNotationRegion .atzone.candidate").html();
	$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").append(elem);
	$("#itemId"+imageId).find(".atNotationRegion .atzone.candidate").html("");
	var allElementLength = $("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed .atUserIcon").length;
	deleteNode = $("#itemId"+imageId).find(".confirmed .atusername");
	
	if (existAtFlag == 1){
		$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
	}
	
	for(var i=0;i<allElementLength;i++){
		var atUserId = textarea.parentElement.parentElement.children[0].children[2].children[i].children[0].classList[3];
		addDeleteNodeHander(textarea,deleteNode,atUserId,imageId,i,elementLength);
		handAtDelete(textarea,imageId,atUserId);
	}
}

function handAtDelete(textarea,imageId,atUserId){
	$("#itemId"+imageId).find(".atUserIcon."+atUserId).click(function(){
		var rmelement = $("#itemId"+imageId).find(".atUserIcon."+atUserId);
		$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry( 'remove', rmelement);
		$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
			$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
//			atzoneInitialize(imageId);
			if(textarea.parentElement.parentElement.children[0].children[2].innerHTML ==""){
				$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry('destroy');
			}
		});
	});
}

function addDeleteNodeHander(textarea,deleteNode,atUserId,imageId,i,elementLength){
	if(i==0){
		atzoneInitialize(imageId);
		$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
	}else{
		var element = $("#itemId"+imageId).find(".atNotationRegion .ui.label.atusername."+atUserId).parent();
		$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry();
	}
	deleteNode.find(".icon."+atUserId).parents(".atusername").addClass("red");


}

function addThisUserToAtzone(textarea,thisUser,order){
	if(existThisUserInAtzone(textarea,thisUser)) return 0;
	var orderDisplay = order>9 ? "none": "inline";
	var html = 
		"<div class='atUserIcon "+thisUser.userId+"' style='display:inline'>"+
			"<a class=\"ui label atusername "+thisUser.userId+"\" style='margin: 4px;'>"+
			"<span class='atNameOrder "+order+"' style='display:"+orderDisplay+"'>"+order+" </span>" +
			"<span class='atName' style='display:inline'>"+thisUser.fullName+"</span>"+
				"<i class=\"delete icon "+thisUser.userId+"\" style='display:inline'></i>"+
			"</a>"+
		"</div>";
	textarea.parentElement.parentElement.children[0].children[1].innerHTML += html;
	return 1;
}

function existThisUserInAtzone(textarea,thisUser){
	try{	
		var newUserLength = textarea.parentElement.parentElement.children[0].children[1].children.length;
		for(var i=0;i<newUserLength;i++){
			var userId = textarea.parentElement.parentElement.children[0].children[2].children[i].children[0].classList[3];
			if(userId==thisUser.userId){
				return true;
			}
		}
	}
	catch(e){
	}
	try{
		var addedUserLength = textarea.parentElement.parentElement.children[0].children[2].children.length;
		for(var i=0;i<addedUserLength;i++){
			var userId = textarea.parentElement.parentElement.children[0].children[2].children[i].children[0].classList[3];
			if(userId==thisUser.userId){
				return true;
			}
		}
	}
	catch(e){
	}
	var imageId = textarea.classList[1];
	enableEnterHintMessage(textarea,imageId);
	return false;

}



function atzoneInitialize(imageId){
	$("#itemId"+imageId).find(".atNotationRegion .atzone.confirmed").masonry({		
		itemSelector: '.atUserIcon',
        columnWidth: 5,
		gutter: 4});
}

/*********************************************************************************
 * 	face handler.
 */

function addFace(code,imageId){
	var elem = "<img id='"+face[code].code+"' class=\"ui image\" src=\""+face[code].image+"\" style=\"margin:0 auto;width:70px; height: 70px;cursor:pointer;\">";
	$("#itemId"+imageId).find(".functionList .face.icon").popup('toggle');
	$("#itemId"+imageId).find(".faceDisplay").html(elem);
	$("#itemId"+imageId).find(".faceDisplay .image").popup({
	    on: 'hover',
	    position : 'left center',
	    content	:	"关闭",
	    transition: 'fade down'
	});
}
function cleanFace(thisDiv){
	$(".faceDisplay .image").popup('toggle');
	thisDiv.innerHTML="";
}
