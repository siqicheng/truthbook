



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
	thisElem.parent().parent().parent().find('.numLikeSpan').html(Number(thisElem.parent().parent().parent().find('.numLikeSpan').html())+num);
	
}


/*********************************************************************************
 * 	Remove image click function and its help function 
 */

function removeImage(thisElem){
	eventRemove(thisElem);
	$('#eventsegment').masonry();
}

function eventRemove($removeBtn) {
	var rmelement = $removeBtn.parents(".eventpile");
	$("#eventsegment").masonry( 'remove', rmelement);
}










