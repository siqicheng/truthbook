function addImageButtonHandler(imageId,control,comment){
	
	$("#imageId"+imageId).find(".image").hover(function(){
	    $(this).children(".imgbtnArea").fadeIn("fast");
	    $(this).children("img").fadeTo("fast",0.9);
			},
			function(){
	    $(this).children(".imgbtnArea").fadeOut("fast");
	    $(this).children("img").fadeTo("fast",1);
		}
	);
	
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
	$("#un_imageId"+imageId).find(".confirmBtn .negative").click(function(){		
		rejectImage($(this),imageId);
	});
	
	$("#un_imageId"+imageId).find(".confirmBtn .positive").click(function(){
		acceptImage($(this),imageId);
	});
	
	$("#un_imageId"+imageId).find(".acceptImageReturn").hover(	
			function(){$(this).css("color","#33B2E1");},
			function(){$(this).css("color","");}
	);
	
	$("#un_imageId"+imageId).find(".confirmSubmit").click(function(){
		if ($("#un_imageId"+imageId).find(".acceptHead .center.aligned.header").html()=="改进意见"){
			rejectCommentMessage(imageId,$(this));
		}	else {
			acceptCommentMessage(imageId,$(this));
		}	
	});
	
}

function rejectImage(thisElem,imageId){
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			thisElem.parents('.ui.shape').find(".acceptHead .center.aligned.header").html("改进意见");
			thisElem.parents('.ui.shape').find(".comments .tiny.center.aligned").html("关注你的人：<br>你不喜欢哪点我改还不行嘛");
			thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").attr("placeholder","（不填对方将不会收到任何通知）");
			flipTheImageCard(thisElem);
			deleteThisImageFromUnapprovedList(imageId);
		}else{
			drawConfirmPopUp("拒绝照片失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("拒绝照片请求发送失败 Error: "+error);
	};
	
	deleteImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError);
}

function acceptImage(thisElem,imageId){
	
	var onGetNameAjaxSuccess = function(data, textStatus) {
		if (data != null){
			thisElem.parents('.ui.shape').find(".acceptHead .center.aligned.header").html("谜底揭晓");
			thisElem.parents('.ui.shape').find(".comments .tiny.center.aligned .uploaderName").html(data.uploaderName);
			thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").attr("placeholder","感谢一下吧，或者。。。让他等着");
			addThisImageToHomePage(imageId);
			flipTheImageCard(thisElem);//flip only change #eventsegment
			deleteThisImageFromUnapprovedList(imageId);
			
		}else{
			drawConfirmPopUp("获取姓名失败");
		}
	};
	var onGetNameAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("获取姓名请求发送失败 Error: "+error);
	};
	
	var onAjaxSuccess = function(data, textStatus) {
		if (data == true){
			modifiedImageNum(1);
			getImageByImageIdAPI(imageId,onGetNameAjaxSuccess,onGetNameAjaxError);
			
		}else{
			drawConfirmPopUp("接受照片失败");
		}
	};
	var onAjaxError = function(xhr, textStatus, error) {
		drawConfirmPopUp("接受照片请求发送失败 Error: "+error);
	};
	
	approveImageByImageIdAPI(imageId,onAjaxSuccess,onAjaxError);
}

function rejectCommentMessage(imageId,thisElem){
	if(thisElem.parents('.ui.shape').find(".comments .reply.form .textarea").val() != ""){
		//Todo:send why reject Message
	}	
	hiddenThisImage(thisElem,imageId);
}

function acceptCommentMessage(imageId,thisElem){
	//Todo:send acceptMessage
	
	hiddenThisImage(thisElem,imageId);
}

function modifiedImageNum(num){
	numImage = Number($("#photos_num").html()) + num;
	$("#photos_num").html(numImage);
}


function hiddenThisImage(thisElem,imageId){
	rmelement = thisElem.parents(".eventpile");
	$("#neweventsegment").masonry( 'remove', rmelement);
	$("#neweventsegment").masonry('on', 'removeComplete', function( msnryInstance, rmelement ) {
		$('#neweventsegment').masonry();
		itemInitialize("#neweventsegment");
	});

	if(numUnapprovImage == 0){		
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
}


function addThisImageToHomePage(imageId){
	for(var i = 0 ; i < numUnapprovImage ; i++){
		if( unapprovImage[i].imageId == imageId){
			approvedImage=[].concat(unapprovImage[i],approvedImage);
			numApprovedImage = approvedImage.length;
			break;
		}
	}
	var element = prepareElement(approvedImage[0],false,CONTROL.Self,COMMENT.Yes);

	$("#eventsegment").masonry( 'prepended', element );
	$.cookie("truthbook_Page_Image_Pointer", $.cookie("truthbook_Page_Image_Pointer")+1);
	itemInitialize("#eventsegment");
}




function deleteThisImageFromUnapprovedList(imageId){
	for(var i = 0 ; i < numUnapprovImage ; i++){
		if( unapprovImage[i].imageId == imageId){
			unapprovImage.splice(i,1);
			break;
		}
	}
	numUnapprovImage = unapprovImage.length;
}

function deleteThisImageFromApprovedList(imageId){
	for(var i = 0 ; i < numApprovedImage ; i++){
		if( approvedImage[i].imageId == imageId){
			approvedImage.splice(i,1);
			break;
		}
	}
	numApprovedImage = approvedImage.length;
	var currPoint = $.cookie("truthbook_Page_Image_Pointer")-1;
	$.cookie("truthbook_Page_Image_Pointer", currPoint);
	modifiedImageNum(-1);
}









