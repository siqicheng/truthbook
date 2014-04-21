/*
 *	All the buttons' function on an Image Item.
 *	1.	Like/Dislike :	One can click multiple times when refresh the page	
 *	2.	Show reply contents on the back
 *	3.	Return to sender
 *	4.	Upload image for sender
 *	5.	Set as portrait
 *	6.	Remove image 
 *
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
	
	var onAjaxSuccess = function(data, textStatus) {
		setPortraitAPI(userId,imageId,onSetAjaxSuccess,onSetAjaxError);
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("添加头像请求发送失败 Error: "+error);
	};
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
	
	addPortraitAPI(userId,imageId,onAjaxSuccess,onAjaxError);
	
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
			$('#eventsegment').masonry();
			$.cookie("truthbook_Page_Image_Num", $.cookie("truthbook_Page_Image_Num")-1);
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
 * 	Remove all the popup after someone click above buttons.
 */

function disableThisPopup(thisElem){
	$("."+thisElem)
	  .popup('hide')
	;
}







