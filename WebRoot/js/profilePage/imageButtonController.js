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
	
	$("#imageId"+imageId).find(".commentShow").click(function(event){	
		event.stopPropagation();
		showReply($(this));
//		$("#imageId"+imageId).find(".textarea").focus();
		return false;
	});
	
	$("#imageId"+imageId).find(".commentReturn").click(function(event){	
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
			$(this).parents(".eventpile").find(".extra .shortDate").toggle();
			$(this).parents(".eventpile").find(".extra .stdDate").toggle();
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
	
	$("#imageId"+imageId).find(".functionList .icon").hover(
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
	
	$("#imageId"+imageId).find(".functionList .at.icon").click(function(){
		var currentValue = $("#imageId"+imageId).find(".field .textarea").val();
		if(currentValue[currentValue.length-1]!="@"){
			$("#imageId"+imageId).find(".field .textarea").val(currentValue + "@");
			
			var e = jQuery.Event("keyup");//模拟一个键盘事件 
			e.keyCode = 13;//keyCode=13是回车
			$("#imageId"+imageId).find(".field .textarea").trigger(e);
			currentValue = $("#imageId"+imageId).find(".field .textarea").val();
		}
		$("#imageId"+imageId).find(".field .textarea").val("").focus().val(currentValue);
	});
	
	
	var lengthImage = face.length;

	var faceHTML = "<div class=\"ui three column grid\" style=\"width: 254px;margin-left: -3;margin-right: 0px;margin-left: -5;margin-left: 0px;padding-left: -3;\">";
	for(var i=0;i<lengthImage;i++){
		var code = face[i].code.split("_")[1];
		faceHTML+="<div class=\"column\" style=\"width: 60px;margin-top: 0px;margin-bottom: 8px;cursor:pointer;\" onClick='addFace("+code+","+imageId+")'>" +
						"<img id='' class=\"ui medium image\" src=\""+face[i].image+"\" style=\"display:block;width:55px; height: 55px;\">" +
						"<span style='font-size:10px;padding-top:2px;text-align:center; display:block;'>"+face[i].content+"</span>" +
				  "</div>";
	}
	faceHTML+="</div>";
	
	$("#imageId"+imageId).find(".functionList .face.icon").popup({
	    on: 'click',
	    position : 'top center',
	    transition: 'fade down',
	    html : faceHTML
	});

}

function addImageControlButtonPopup(className,displayContent,imageId){
	$("#imageId"+imageId).find("."+ className)
	  .popup({
		    on: 'hover',
		    content: displayContent
	});
}
