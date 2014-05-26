function timelineButtonHandler(imageId, comment, imageOwnerId){
	
	$("#itemId"+imageId).find(".image").hover(function(){
	    $(this).children(".imgbtnArea").fadeIn("fast");
	    $(this).children("img").fadeTo("fast",0.9);
			},
			function(){
	    $(this).children(".imgbtnArea").fadeOut("fast");
	    $(this).children("img").fadeTo("fast",1);
		}
	);
	
	$("#itemId"+imageId).find(".likebtn").click(function(event){
		event.stopPropagation();
		likeThisImage($(this),imageId);
		return false;
	});
	
	$("#itemId"+imageId).find(".commentSubmit").click(function(){
		submitComment(imageId,imageOwnerId);
	});
	
	$("#itemId"+imageId).find(".loadAllComments").click(function(){
		$(this).parent().html("");
		getThisComment_All_onTimeline(imageId);
	});
	
	$("#itemId"+imageId).find(".uploaderName").click(function(){
		goOthersPage($(this).parent().find(".uploaderId").html());
	});
	
	$("#itemId"+imageId).find(".timelineBookmarkInfoUsername").click(function(){
		goOthersPage(imageOwnerId);
	});
	
	$("#itemId"+imageId).find(".timelineBookmarkAvatar").click(function(){
		goOthersPage(imageOwnerId);
	});
}
