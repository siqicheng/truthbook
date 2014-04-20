$(function(){
	getImagePreCheck();
	
	imageButtonHandler();

});

function imageButtonHandler(){	
	$("#showMoreButton").click(function(){
//		$('#eventsegment').masonry('destroy');
//		drawNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		itemInitialize();
	});
	
}

function setPortraitImageForThisPage(){
	var userId = $.cookie("truthbook_PageOwner_userId").userId
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			var portraitUrl = data.image.imageUrl;
			$("#portraitImage").attr("src",portraitUrl);
		  		$("#portraitImage").magnificPopup({
					items: {
	 					src:  $("#portraitImage").attr("src")
					},
					type: 'image',
//					image: {
//						verticalFit: false
//					}
			}); 
			
		}else{
			$("#portraitImage").attr("src",DefaultPortrait);
		}
	};
	var onAjaxError = function(xhr,status,error){
		$("#portraitImage").attr("src",DefaultPortrait);
		drawConfirmPopUp("获取头像请求发送失败 Error: " + error);
		return false;
	};
	getDefaultPortraitAPI(userId,onAjaxSuccess,onAjaxError)
}


/*********************************************************************************	
 *	Homepage check
 */

function getImagePreCheck(){
	if($.cookie("truthbook").userId == $.cookie("truthbook_PageOwner_userId").userId){
		getAllImage($.cookie("truthbook_PageOwner_userId").userId);
	}else{
		friendRelationCheck();
	}
}

/*********************************************************************************	
 *	Friend relation check
 */

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
	
	checkFriendRelationship($.cookie("truthbook").userId, $.cookie(
			"truthbook_PageOwner_userId").userId, onAjaxSuccess, onAjaxError);
}

/*********************************************************************************	
 *	Get all images when on homepage or friend's page
 */

function getAllImage(userId){
	var onAjaxSuccess = function(data,textStatus){
		var numTotalImage = data.length;
		if (numTotalImage != 0 ){	
			$.cookie("truthbook_Page_Image_Num", numTotalImage);
			$.cookie("truthbook_Page_Image_Pointer", 0);
			drawNextBatchImage(numTotalImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,data);
			return true;
		}
		else{
			disableShowMoreButton();
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
		disableShowMoreButton();
		if (data[0].imageUrl != undefined ){
			drawNextBatchImage(1,1,1,data);
//			drawGuestOneImage(data);
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
function drawGuestOneImage(imageData){
	var url = imageData[0].imageUrl,
		description = imageData[0].description,
		uploaderName =  imageData[0].uploaderName,
		uploaderId = imageData[0].uploaderId,
		createDate = imageData[0].createDate,
		numOfComment = imageData[0].commentCnt,
		imageId = imageData[0].imageId,
		numLike = imageData[0].like,
		display = "inline";
	
	if (numLike=="") numLike = "0";
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	$("#eventsegment").append(thisImageHTML(url,description,descriptionDisplay,uploaderName,uploaderId,
											createDate,numOfComment,display,imageId,numLike));
	addImageButtonHandler(imageId);
	itemInitialize();
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
		var url = imageData[imageIdinorder[i+currentPointer][1]].imageUrl;
			description = imageData[imageIdinorder[i+currentPointer][1]].description,
			uploaderName =  imageData[imageIdinorder[currentPointer+i][1]].uploaderName,
			uploaderId = imageData[imageIdinorder[currentPointer+i][1]].uploaderId,
			createDate = imageData[imageIdinorder[currentPointer+i][1]].createDate,
			numOfComment = imageData[imageIdinorder[currentPointer+i][1]].commentCnt,
			imageId = imageData[imageIdinorder[currentPointer+i][1]].imageId,
			numLike = imageData[imageIdinorder[currentPointer+i][1]].like,
			display = i < numToShow ?"inline":"none";	
		
			
		if (numLike=="") numLike = "0";
		description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
		
		$("#eventsegment").append(thisImageHTML(url,description,descriptionDisplay,uploaderName,
								uploaderId,createDate,numOfComment,display,imageId,numLike));
		
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
		imageIdinorder [i][0] = data[i].imageId;
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
	showLoadingButton();
	var numLeft = numTotalImage;
	var i = 0;
	for (;i<numTotalImage;i++){
		if ($("#eventsegment").children(".eventpile")[i].style.display == "none"){
			break;
		}
	}
	var j = 0;
	if(i==numTotalImage){
		disableShowMoreButton();
		return;
	}
	
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
	showRefreshButton();
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

function showRefreshButton(){
	$("#showMoreButton").children(".basic.fluid.button").html("<i class=\"double angle down large icon\"></i>");
}

function showLoadingButton(){
	$("#showMoreButton").children(".basic.fluid.button").html("<i class=\"loading large icon\"></i>");
}

function addImageButtonHandler(imageId){
	
	$("#imageId"+imageId).find(".likebtn").click(function(){
		likeThisImage($(this),imageId);
	});
	
	$("#imageId"+imageId).find(".commentToggle").click(function(){	
		showReply($(this));
	});
	
	$("#imageId"+imageId).find(".uploaderName").click(function(){
		goOthersPage($(this).parent().find(".uploaderId").html());
	});
	
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

function addImageControlButtonPopup(className,displayContent,imageId){
	$("#imageId"+imageId).find("."+ className)
	  .popup({
		    on: 'hover',
		    content: displayContent
	});
}



/*********************************************************************************
 * 	The whole HTML part to draw
 */
function thisImageHTML(url,description,descriptionDisplay,uploaderName,uploaderId,createDate,numOfComment,display,imageId,numLike){
	
	displayDate = dateHandle(createDate);
	userId = $.cookie("truthbook").userId;
	
	html =  "<div class='eventpile' id = 'imageId"+imageId+"' style='display : "+display+";' >" +
				"<span class = 'imageId_span' style='display:none;'>"+imageId+"</span>"+
				"<span class = 'userId_span' style='display:none;'>"+userId+"</span>"+
				"<span class = 'url_span' style='display:none;'>"+url+"</span>"+
		    	"<div class='ui shape'>" +
		    		"<div class='sides'>" +
		    		
		    			"<div class='active side ui items'>" +
		    				"<div class='item'>" +    					
		    					
		    					"<div class='image'>"+
		    						"<img src='"+url+"'>"+
		    						"<div class='imgbtnArea'>" +
			    						"<div class='ui tiny button likebtn' style='margin-right: 2px'>"+
			    							"<i class='heart tiny icon'></i>"+
			    						"</div>"+
			    						"<div class='ui tiny green inverted button commentbtn commentToggle'>" +
			    							"<i class='comment icon'></i>"+numOfComment+
			    						"</div>" +
			    					"</div>"+
		    					"</div>"+    					
		    					"<div class = 'discript content'>"+
		    						"<p class='description' style = 'display:"+descriptionDisplay+"'>"+description+"</p>"+
		    						"<div class='meta' style = 'display:block' >"+
		    							"By <a class='uploaderName'><font size=\"4px\">"+uploaderName+"</font></a>" + 
		    							"<span class='uploaderId' style='display:none;'>" + uploaderId + "</span> "+
		    						"</div>"+
		    						"<div class='ui editBtn icon' style='display:none; margin-left:10px;cursor:pointer;width:20%'>" +
		    							"<i class='double angle down icon'></i>"+
		    						"</div>" +
		    					"</div>"+

		    					"<div class='btnArea' style='display:none;'>"+
			                        "<a class='returnToSender' style='padding-right: 17px; padding-left: 17px;margin-left: 8px;'>" +
			                        	"<i class='share large icon'></i>" +
			                        "</a>" +
			                        "<a class='uploadFor' style='padding-right: 17px; padding-left: 17px;'>" +
		                        		"<i class='cloud upload large icon'></i>" +
		                        	"</a>" +
		                        	"<a class='setPortrait' style='padding-right: 17px; padding-left: 17px;'>" +
	                        			"<i class='user large icon'></i>" +
	                        		"</a>" +
			                        "<a class='eventRemove' style='padding-right: 17px; padding-left: 17px;'>" +
		                        		"<i class='remove sign large icon'></i>" +
		                        	"</a>" +
		                        "</div>" +
					    		"<div class=\"extra\">"+
					    			"<span class='numLikeSpan' style='float: left;  text-align: left;'>"+numLike+"</span><span>个赞</span>"+
					    	        "<span style='float: right;  text-align: right;margin-right: 3%'>"+displayDate+"</span>"+
			    	        	"</div>"+
		                     
			    	        "</div>" +
		                  "</div>" +
		    			
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

function dateHandle(createDate){
	date = new Date();
	day = date.getDate();
	month = Number(date.getMonth()+1);if (month < 10) month="0"+Number(date.getMonth()+1);
	year = date.getFullYear();
	
	today = year+"-"+month; 
	uploadDate = createDate.substr(0,createDate.indexOf(" ")-3);
	defaultUploadDate = createDate.substr(0,createDate.indexOf(" "));
	defaultDisplayDate = defaultUploadDate.substr(0,4)+"年"+defaultUploadDate.substr(5,2)+"月"+defaultUploadDate.substr(8,2)+"日";
	if(uploadDate != today){	
		return defaultDisplayDate;
	} else {
		hour = date.getHours();
		minute = date.getMinutes();
		second = date.getSeconds();
		
		upload_day = createDate.substr(createDate.indexOf(" ")-2,2);
		upload_hour = createDate.substr(createDate.indexOf(" ")+1,2);
		upload_minute = createDate.substr(createDate.indexOf(" ")+4,2);
		upload_second = createDate.substr(createDate.indexOf(" ")+7,2);

		if (day>upload_day){
//			return defaultDisplayDate;
			return (day - upload_day)+"天前";
		}
		if (hour>upload_hour){
			return (hour - upload_hour)+"小时前";
		}
		if (minute>upload_minute){
			return (minute - upload_minute)+"分钟前";
		}
		if (second>upload_second){
			return (minute - upload_second)+"秒钟前";
		}
		return defaultDisplayDate;
	}
}






