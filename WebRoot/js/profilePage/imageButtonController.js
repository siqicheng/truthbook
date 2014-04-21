function addImageButtonHandler(imageId,control){
	
	$("#imageId"+imageId).find(".likebtn").click(function(){
		likeThisImage($(this),imageId);
	});
	
	$("#imageId"+imageId).find(".commentToggle").click(function(){	
		showReply($(this));
	});
	
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
			$(this).parent().parent().children(".btnArea").toggle();
	//		$(this).parent().children('.extra').toggle();
			$('#eventsegment').masonry();
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

}

function addImageControlButtonPopup(className,displayContent,imageId){
	$("#imageId"+imageId).find("."+ className)
	  .popup({
		    on: 'hover',
		    content: displayContent
	});
}

