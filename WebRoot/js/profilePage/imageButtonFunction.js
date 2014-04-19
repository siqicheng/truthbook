



/*********************************************************************************
 * 	Like this image click function and its help function 
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
 * 	Show reply of this image click function and its help function 
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
 * 	Return to sender click function and its help function 
 */

function returnToSender(thisElem){
	disableThisPopup("returnToSender");
}

/*********************************************************************************
 * 	UploadFor click function and its help function 
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
 * 	Set Portrait click function and its help function 
 */

function setPortrait(thisElem){
	disableThisPopup("setPortrait");
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
		}
	};
	var onSetAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("设置头像请求发送失败 Error: "+error);
	};
	
	
	
	addPortraitAPI(userId,imageId,onAjaxSuccess,onAjaxError);
	
}




/*********************************************************************************
 * 	Remove image click function and its help function 
 */

function removeImage(thisElem){
	disableThisPopup("eventRemove");
	eventRemove(thisElem);
	$('#eventsegment').masonry();
}

function eventRemove($removeBtn) {
	var rmelement = $removeBtn.parents(".eventpile");
	$("#eventsegment").masonry( 'remove', rmelement);
}


/*********************************************************************************
 * 	Remove all the popup after someone click the buttons.
 */

function disableThisPopup(thisElem){
	$("."+thisElem)
	  .popup('hide')
	;
}







