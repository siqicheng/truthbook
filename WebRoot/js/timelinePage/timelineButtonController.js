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
	
	$("#itemId"+imageId).find(".functionList .icon").hover(
			function(){
				if($(this).hasClass("face")) $(this).addClass("smile");
				$(this).css("color","#009FDA");
				$(this).css("-webkit-transform","scale(1.5)");
				$(this).css("-moz-transform","scale(1.5)");
				$(this).css("-o-transform","scale(1.5)");
				$(this).css("-ms-transform","scale(1.5)");
				$(this).css("transform","scale(1.5)");
			},
			function(){
				if($(this).hasClass("face")) $(this).removeClass("smile");
				$(this).css("color","");
				$(this).css("-webkit-transform","scale(1.0)");
				$(this).css("-moz-transform","scale(1.0)");
				$(this).css("-o-transform","scale(1.0)");
				$(this).css("-ms-transform","scale(1.0)");
				$(this).css("transform","scale(1.0)");
			}
	);
	
	$("#itemId"+imageId).find(".functionList .at.icon").click(function(){
		var currentValue = $("#itemId"+imageId).find(".field .textarea").val();
		if(currentValue[currentValue.length-1]!="@"){
			$("#itemId"+imageId).find(".field .textarea").val(currentValue + "@");
			
			var e = jQuery.Event("keyup");//模拟一个键盘事件 
			e.keyCode = 13;//keyCode=13是回车
			$("#itemId"+imageId).find(".field .textarea").trigger(e);
			currentValue = $("#itemId"+imageId).find(".field .textarea").val();
		}
		$("#itemId"+imageId).find(".field .textarea").val("").focus().val(currentValue);
	});
	
	
	var lengthImage = face.length;

	var faceHTML = "<div class=\"ui four column grid\" style=\"width: 254px;margin-left: -3;margin-right: 0px;margin-left: -5;margin-left: 0px;margin-bottom:5px;padding-left: -3;\">";
	for(var i=0;i<lengthImage;i++){
		var code = face[i].code.split("_")[1];
		faceHTML+="<div class=\"column\" style=\"width: 60px;margin-top: 0px;margin-bottom: 8px;cursor:pointer;\" onClick='addFace("+code+","+imageId+")'>" +
						"<img id='' class=\"ui medium image\" src=\""+face[i].image+"\" style=\"display:block;width:55px; height: 55px;\">" +
						"<span style='font-size:10px;padding-top:2px;text-align:center; display:block;'>"+face[i].content+"</span>" +
				  "</div>";
	}
	faceHTML+="</div>";
	
	$("#itemId"+imageId).find(".functionList .face.icon").popup({
	    on: 'click',
	    position : 'top center',
	    transition: 'fade down',
	    html : faceHTML
	});
}