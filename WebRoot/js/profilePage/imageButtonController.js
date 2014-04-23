function addImageButtonHandler(imageId,control,comment){
	
	$("#imageId"+imageId).find(".likebtn").click(function(event){
		event.stopPropagation();
		likeThisImage($(this),imageId);
		return false;
	});
	
	$("#imageId"+imageId).find(".commentToggle").click(function(event){	
		event.stopPropagation();
		showReply($(this));
		return false;
	});
	
	$("#imageId"+imageId).find(".commentReturn").hover(	
			function(){$(this).css("color","#33B2E1");},
			function(){$(this).css("color","");}
	);
	
	
	$("#imageId"+imageId).find(".uploaderName").click(function(){
		goOthersPage($(this).parent().find(".uploaderId").html());
	});
	
	if (control == CONTROL.Self){	
		$("#imageId"+imageId).find(".discript.content").hover(	
				function(){	$(this).find(".editBtn").show();
							$('#eventsegment').masonry();},
				function(){	$(this).find(".editBtn").hide();
							$('#eventsegment').masonry();}
		);
		
		$("#imageId"+imageId).find(".editBtn").click(function(){	
			if($(this).find(".down").attr("class") == undefined){
				$(this).find(".double").addClass("down");
				$(this).find(".double").removeClass("up");
			}else{
				$(this).find(".double").addClass("up");
				$(this).find(".double").removeClass("down");
			}
			$(this).parent().parent().children(".btnArea").slideToggle("fast",function(){
				$('#eventsegment').masonry();
			});
	//		$(this).parent().children('.extra').toggle();
			
		});
		
		$("#imageId"+imageId).find(".editBtn").hover(	
				function(){$(this).css("color","#33B2E1");},
				function(){$(this).css("color","");}
		);
		
		addImageControlButtonPopup("returnToSender","分享给发送者",imageId);
		addImageControlButtonPopup("uploadFor","为发送者上传",imageId);
		addImageControlButtonPopup("setPortrait","设置为头像",imageId);
		addImageControlButtonPopup("eventRemove","删除照片",imageId);
		
		$("#imageId"+imageId).find(".returnToSender").click(function(){
			returnToSender($(this));
		});	
		
		$("#imageId"+imageId).find(".uploadFor").click(function(){
			uploadFor($(this));
		});	
		
		$("#imageId"+imageId).find(".setPortrait").click(function(){
			setPortrait($(this));
		});
		
		$("#imageId"+imageId).find(".eventRemove").click(function(){
			removeImage($(this));
		});
	}
	if(comment == COMMENT.Yes){
		$("#imageId"+imageId).find(".commentSubmit").click(function(){
			submitComment(imageId);
		});
	} else {
		$("#imageId"+imageId).find(".commentSubmit").click(function(){
			promptAddFriend(imageId);
		});
	}

	

}

function addImageControlButtonPopup(className,displayContent,imageId){
	$("#imageId"+imageId).find("."+ className)
	  .popup({
		    on: 'hover',
		    content: displayContent
	});
}


function addUnapprovedImageButtonHandler(imageId){
	$("#imageId"+imageId).find(".confirmBtn .negative").click(function(){
		flipTheImageCard($(this));
		rejectImage($(this),imageId);
	});
	
	$("#imageId"+imageId).find(".confirmBtn .positive").click(function(){
		flipTheImageCard($(this));
		acceptImage($(this),imageId);
	});
	
	$("#imageId"+imageId).find(".acceptImageReturn").hover(	
			function(){$(this).css("color","#33B2E1");},
			function(){$(this).css("color","");}
	);
	$("#imageId"+imageId).find(".acceptImageReturn").click(function(){
		flipTheImageCard($(this));
	});
	
	$("#imageId"+imageId).find(".confirmSubmit").click(function(){
		if ($("#imageId"+imageId).find(".acceptHead .center.aligned.header").html()=="拒绝理由"){
			rejectComment(imageId,$(this));
		}	else {
			acceptComment(imageId,$(this));
		}	
	});
	
}

function rejectImage(thisElem,imageId){
	thisElem.parents('.ui.shape').find(".acceptHead .center.aligned.header").html("拒绝理由");
	thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").attr("placeholder","告诉他/她哪里拍得不好（可选：不填对方将不会收到任何通知）");
}

function acceptImage(thisElem,imageId){
	thisElem.parents('.ui.shape').find(".acceptHead .center.aligned.header").html("确认接受");
	thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").attr("placeholder","感谢一下吧。。。（可选）");
}

function rejectComment(imageId,thisElem){
	if(thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").val() != ""){
		//Todo:send why reject Message
	}	
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			hiddenThisImage(thisElem,imageId,1);
		}else{
			drawConfirmPopUp("拒绝照片失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("拒绝照片请求发送失败 Error: "+error);
	};
	
	deleteImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError);
}

function acceptComment(imageId,thisElem){
	//Todo:send acceptMessage
	
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			addImageNum();
			hiddenThisImage(thisElem,imageId,0);
		}else{
			drawConfirmPopUp("接受照片失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("接受照片请求发送失败 Error: "+error);
	};
	
	approveImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError);
}

function addImageNum(){
	numImage = Number($("#photos_num").html()) + 1;
	$("#photos_num").html(numImage);
}

function hiddenThisImage(thisElem,imageId,isDele){
	rmelement = thisElem.parents(".eventpile");
	$("#neweventsegment").masonry( 'remove', rmelement);
	$('#neweventsegment').masonry();
	
	var length = unapprovImage.length;
	var tempData = new Array();
	for(var i = 0 ; i < length ; i++){
		if( unapprovImage[i].imageId != imageId){
			tempData.push(unapprovImage[i]);
		}else{
			if(isDele == 0){
				imageData=[].concat(unapprovImage[i],imageData);
				numTotalImage = imageData.length;
				$("#eventsegment").masonry('destroy');
				$("#eventsegment").html("");
			}
		}
	}
	unapprovImage = tempData;
	numUnappImage = unapprovImage.length;

	
	if(numUnappImage == 0){		
		hideReturnHomeButton();
		hideNewImageButton()
		$("#neweventwrap").transition({
			animation : 'horizontal flip out', 
			duration  : '1s',
			complete  : function() {
				$("#neweventwrap").hide();
		}
		});
	}
	
	if(isDele == 0){
		var millisecondsToWait = 200;
		setTimeout(function() {
			drawNextBatchImage(numTotalImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,imageData,CONTROL.Self);
		}, millisecondsToWait);
		
	}

}














