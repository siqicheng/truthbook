$(function(){
	getImagePreCheck();
	
	$('.testitemload').click(function(){
//		$('#eventsegment').masonry('destroy');
//		drawNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		itemInitialize();
	});
	
});

function imageLengthJson(data){
	if(data == null){
		return -1;
	}
	if (data.image.length != undefined){
		return data.image.length;
	} else if (data != null) {
		return 1;
	}
}

function getImagePreCheck(){
	if($.cookie("truthbook").userId == $.cookie("truthbook_PageOwner_userId").userId){
		getAllImage($.cookie("truthbook_PageOwner_userId").userId);
	}else{
		friendRelationCheck();
	}
}

function friendRelationCheck(){
	var onAjaxSuccess = function(data,textStatus){
		if (data > 0 ){
			getAllImage($.cookie("truthbook_PageOwner_userId").userId);
			return true;
		}
		else{
			getGuestImage($.cookie("truthbook_PageOwner_userId").userId);
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取好友关系请求发送失败 Error: " + error);
		return false;
	};
	
	checkFriendRelationship($.cookie("truthbook").userId, $.cookie("truthbook_PageOwner_userId").userId, onAjaxSuccess, onAjaxError);
}

function getAllImage(userId){
	var onAjaxSuccess = function(data,textStatus){
//		$.cookie("truthbook_Page_Image_Json", data);
		if (data != null ){
			var numTotalImage = imageLengthJson(data);
			$.cookie("truthbook_Page_Image_Num", numTotalImage);
			if(numTotalImage==1){
				drawOneImage(data);
			}else{
				$.cookie("truthbook_Page_Image_Pointer", 0);
				drawNextBatchImage(numTotalImage,NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,data);
			}
			return true;
		}
		else{
			drawConfirmPopUp("木有照片");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取照片请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError);
}

function getGuestImage(userId){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			drawOneImage(data);
			return true;
		}
		else{
			drawConfirmPopUp("他木有照片");
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取照片请求发送失败 Error: " + error);
		return false;
	};
	getOneImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError);
}

/*********************************************************************************
 * 	When the user only have one image or only allowed to see one image,
 * 	Use this to draw one segement and do not draw the show more button.
 */
function drawOneImage(imageData){
	var url = imageData.image.imageUrl,
		discript = "waiting for back end",//imageData.image.discript,
		uploaderName =  "waiting for back end",//imageData.image.uploaderName,
		uploaderId = imageData.image.uploaderId,
		createDate = imageData.image.createDate,
		numOfComment = "waiting for back end",//imageData.image.numOfComment,
		imageId = imageData.image.imageId,
		display = "inline";
	$("#eventsegment").append(thisImageHTML(url,discript,uploaderName,uploaderId,
											createDate,numOfComment,display,imageId));	
}

/*********************************************************************************
 * 	The function to execute right after get all the image info from the server.
 * 
 * 	Two Usage:
 * 			1.	numOfNextBatch == numToShow (10~20) < numTotalImage : 
 * 					Import n images from cookie at a time and show them all
 * 					ShowMore Button click will call drawNextBatchImage()
 * 		   *2.	numOfNextBatch == numTotalImage > numToShow (10~20) :
 * 					Import all images and show partial of them
 * 					ShowMore Button click will call showNextBatchImage()
 */
function drawNextBatchImage(numOfNextBatch,numToShow,numTotalImage,imageData){
	var currentPointer = $.cookie("truthbook_Page_Image_Pointer");
	if (currentPointer == -1) {
		itemInitialize();
		return;
	}

	var	imageIdinorder = imageInOrder(numTotalImage, imageData);
		
	for(var i = 0 ; i < numOfNextBatch ; i++){
		var url = imageData.image[imageIdinorder[i+currentPointer][1]].imageUrl;
			discript = imageData.image[imageIdinorder[i+currentPointer][1]].discript,
			uploaderName =  imageData.image[imageIdinorder[currentPointer+i][1]].uploaderName,
			uploaderId = imageData.image[imageIdinorder[currentPointer+i][1]].uploaderId,
			createDate = imageData.image[imageIdinorder[currentPointer+i][1]].createDate,
			numOfComment = imageData.image[imageIdinorder[currentPointer+i][1]].numOfComment,
			imageId = imageData.image[imageIdinorder[currentPointer+i][1]].imageId,
			display = i < numToShow ?"inline":"none";	

		$("#eventsegment").append(thisImageHTML(url,discript,uploaderName,
								uploaderId,createDate,numOfComment,display,imageId));
		
		addImageButtonHandler(imageId);
		
		if (isLastImage(i,currentPointer,numTotalImage)){
			$.cookie("truthbook_Page_Image_Pointer", -1);
			itemInitialize();
//			disableShowMoreButton();
			return;	
		}
	}
		
	itemInitialize();
	
	$.cookie("truthbook_Page_Image_Pointer",currentPointer+numOfNextBatch);
	return;
}

function imageInOrder(numTotalImage,data){
	var imageIdinorder = [];
	for (var i = 0 ; i < numTotalImage;i++){
		imageIdinorder [i] = [];
		imageIdinorder [i][0] = data.image[i].imageId;
		imageIdinorder [i][1] = i;
	}
	imageIdinorder.sort(function(x,y){return (y[0]-x[0]);});
	return imageIdinorder;
}


/*********************************************************************************
 * 	In usage 2, search the whole images div and find the first hidden image
 * 				show the next numToShow image or the rest if the rest is few.
 * 	Return the number of the image left hidden.
 */
function showNextBatchImage(numToShow,numTotalImage){
	var numLeft = numTotalImage;
	var i = 0;
	for (;i<numTotalImage;i++){
		if ($("#eventsegment").children(".eventpile")[i].style.display == "none"){
			break;
		}
	}
	var j = 0
	for(;j<numToShow;j++){
		$("#eventsegment").children(".eventpile")[i+j].style.display = "inline";
		if (i+j == numTotalImage - 1){
			numLeft = 0;
			break;
		}
	}
	if (numTotalImage-i-1-numToShow==0 || numLeft == 0){
		disableShowMoreButton();
	}
	return;
	
}



/*********************************************************************************
 * 	In usage 1, check the cookie pointer position. 
 */
function isLastImage(i,currentPointer,numTotalImage){
	return (i+currentPointer) == (numTotalImage-1);
}

function disableShowMoreButton(){
	$("#showMoreButton").hide();
}

function addImageButtonHandler(imageId){
	$("#imageId"+imageId).find(".commentToggle").click(function(){		
		$(this).parents('.ui.shape')
		.shape('setting', {
			onChange: function(){
				$('#eventsegment').masonry();
			},
			duration:500
		})
		.shape('flip over');			
	});
	
	$("#imageId"+imageId).find(".eventRemove").click(function(){
		eventRemove($(this));
		$('#eventsegment').masonry();
	});
}

function eventRemove($removeBtn) {
	var rmelement = $removeBtn.parents(".eventpile");
	$("#eventsegment").masonry( 'remove', rmelement);
}

/*********************************************************************************
 * 	The whole HTML part to draw
 */
function thisImageHTML(url,discript,uploaderName,uploaderId,createDate,numOfComment,display,imageId){
	html =  "<div class='eventpile' id = 'imageId"+imageId+"' style='display : "+display+";' >" +
		    	"<div class='ui shape'>" +
		    		"<div class='sides'>" +
		    			"<div class='active side ui items'>" +
		    				"<div class='item'>" +    					
		    					"<div class='image'>\n"+
		    						"<img src='"+url+"'>"+
		    						"\t\t\t\t<div class='imgbtnArea'>\n" +
		    						"\t\t\t\t\t<div class='ui tiny button likebtn'><i class='heart tiny icon'></i></div>\n"+
		    						"\t\t\t\t\t<div class='ui tiny red inverted button commentbtn commentToggle'>\n" +
		    						"\t\t\t\t\t\t<i class='comment icon'></i>"+numOfComment+"</div>\n" +
		    						"\t\t\t\t</div>\n"+
		    						"</div>"+    					
		    					"<div class = 'content'>"+
		    						"<p class='description'>"+discript+"</p>"+
		    						"<div class='meta'>"+
		    							"By <a class='uploader'>"+uploaderName+"</a> "+createDate+
		    						"</div>"+
		    					"</div>"+   					
		    					"\t\t\t<div class='btnArea'>\n" +
		                        "\t\t\t<div class='ui tiny basic animated button rePost'>\n" +
		                        "\t\t\t\t<div class='visible content'><i class='reply mail icon'></i></div>\n" +
		                        "\t\t\t\t<div class='hidden content'>返还照片</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t\t<div class='ui tiny basic animated button uploadFor'>\n" +
		                        "\t\t\t\t<div class='visible content'><i class='cloud upload icon'></i></div>\n" +
		                        "\t\t\t\t<div class='hidden content'>为其上传</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t\t<div class='ui tiny basic animated button setPortrait'>\n" +
		                        "\t\t\t\t<div class='visible content'><i class='smile icon'></i></div>\n" +
		                        "\t\t\t\t<div class='hidden content'>设为头像</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t\t<div class='ui tiny basic animated button eventRemove'>\n" +
		                        "\t\t\t\t<div class='visible content'><i class='remove icon'></i></div>\n" +
		                        "\t\t\t\t<div class='hidden content'>删除照片</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t\t</div>\n" +
		                        "\t\t</div>\n" +
		    			
		    			"<div class='side ui items'>" +
		    				"<div class='item'>" +
		    					"<h2 class='ui header'>所有评论</h2>" +
		    					"<div class='ui minimal comments'>"+//comment+
		    						"<form class='ui reply form'>"+
		    							"<div class='field'><textarea placeholder='你想说…'></textarea></div>"+
		    							"<div class='ui small teal button'>添加评论</div>"+
		    							"</form>"+
		    					"</div>"+
		    					"<div class='btnArea'>" +
		    						"<button class='ui tiny basic animated button commentToggle'>" +
		    							"<div class='visible content'>&ensp;<i class='angle left icon'></i>&ensp;</div>" +
		    							"<div class='hidden content'>返回</div>" +
		    						"</button>" +
		    					"</div>" +   				
		    				"</div>" +
		    			"</div>" +   			
		    		"</div>" +
		   		"</div>" +
		   	"</div>";
	return html;
}



