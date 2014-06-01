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
		$("#itemId"+imageId).find(".commentSubmit").attr("disabled","disabled");
		submitComment(imageId,imageOwnerId);
		$("#itemId"+imageId).find(".commentSubmit").removeAttr("disabled");

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
	
	
	var faceHTML = "<div class=\"ui three column grid\" style=\"width: 254px;margin-left: -3;margin-right: 0px;margin-left: -5;margin-left: 0px;padding-left: -3;\">";
	for(var set = 0;set<FACE_SET;set++){
		var lengthImage = face[set].length;
		var isFaceHide = set == DEFAULT_SET_NUMBER? "":"none"; 
		for(var i=0;i<lengthImage;i++){
			var code = face[set][i].code.split("_")[1];
			faceHTML+="<div class=\"column set"+set+"\" style=\"display:"+isFaceHide+";width: 60px;margin-top: 0px;margin-bottom: 8px;cursor:pointer;\" onClick='addFace("+set+","+code+","+imageId+")'>" +
							"<img id='' class=\"ui medium image\" src=\""+face[set][i].image+"\" style=\"display:block;width:55px; height: 55px;\">" +
							"<span style='font-size:10px;padding-top:2px;text-align:center; display:block;'>"+face[set][i].content+"</span>" +
					  "</div>";
		}
	}
	faceHTML+="</div>";

	faceHTML+="<div class='facemenu' style='text-align:center'>";
	var defaultSet = "actived red";
	var otherSet = "blank disabled";
	for(var set = 0;set<FACE_SET;set++){
		if(set == DEFAULT_SET_NUMBER){
			faceHTML+="<i class='set"+set+" circle small icon "+defaultSet+"' style='cursor:pointer'></i>";
		}else{
			faceHTML+="<i class='set"+set+" circle small icon "+otherSet+"' style='cursor:pointer'></i>";
		}
	}
	faceHTML+="</div>";
	
	
	$("#itemId"+imageId).find(".functionList .face.icon").popup({
	    on: 'click',
	    position : 'right center',
	    transition: 'fade down',
	    html : faceHTML,
	    onShow:addFacemenuHandler
	});
}

function addFacemenuHandler(){
	$(".facemenu .icon").hover(
		function(){
			if(!$(this).hasClass("actived")){
				$(this).removeClass("disabled");
				$(this).addClass("red");
			}
		},
		function(){
			if(!$(this).hasClass("actived")){
				$(this).removeClass("red");
				$(this).addClass("disabled");
			}
		}
	);
	$(".facemenu .icon").click(
		function(){
			if($(".facemenu .icon").hasClass("actived")){
				$(".facemenu .icon").removeClass("actived");
				$(".facemenu .icon").removeClass("red");
				$(".facemenu .icon").addClass("blank");
				$(".facemenu .icon").addClass("disabled");
			}
			$(this).addClass("actived");
			$(this).addClass("red");
			$(this).removeClass("blank");
			$(this).removeClass("disabled");
			
			$(".popup .three.column.grid .column").hide();
			var set = $(this).attr("class").split(" ")[0];
			$(".popup .three.column.grid ."+set).show();
			
		}
	);
}









