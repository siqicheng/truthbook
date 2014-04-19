$(function(){
	getImagePreCheck();
	
	imageButtonHandler();

});

//function imageLengthJson(data){
//	if(data == null){
//		return -1;
//	}
//	if (data.image.length != undefined){
//		return data.image.length;
//	} else if (data != null) {
//		return 1;
//	}
//}

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
		var numTotalImage = data.length;
		if (numTotalImage != 0 ){	
			$.cookie("truthbook_Page_Image_Num", numTotalImage);
			if(numTotalImage==1){
				drawOneImage(data);
			}else{
				$.cookie("truthbook_Page_Image_Pointer", 0);
				drawNextBatchImage(numTotalImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,data);
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
		var numTotalImage = data.length;
		if (numTotalImage != 0 ){
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
	var url = imageData.imageUrl,
		description = imageData.description,
		uploaderName =  imageData.uploaderName,
		uploaderId = imageData.uploaderId,
		createDate = imageData.createDate,
		numOfComment = imageData.commentCnt,
		imageId = imageData.imageId,
		numLike = imageData.like,
		display = "inline";
	
	if (numLike=="") numLike = "0";
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	$("#eventsegment").append(thisImageHTML(url,description,descriptionDisplay,uploaderName,uploaderId,
											createDate,numOfComment,display,imageId,numLike));	
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
	
	$("#imageId"+imageId).find(".discript.content").click(function(){
		$(this).parent().children(".btnArea").toggle();
//		$(this).parent().children('.extra').toggle();
		$('#eventsegment').masonry();
	});
	
	$("#imageId"+imageId).find('.returnToSender')
	  .popup({
		    on: 'hover',
		    content: '分享给发送者'
	});
	$("#imageId"+imageId).find('.uploadFor')
	  .popup({
		    on: 'hover',
		    content: '为发送者上传'
	});
	$("#imageId"+imageId).find('.setPortrait')
	  .popup({
		    on: 'hover',
		    content: '设置为头像'
	});
	$("#imageId"+imageId).find('.eventRemove')
	  .popup({
		    on: 'hover',
		    content: '删除照片'
	});
	
	$("#imageId"+imageId).find(".eventRemove").click(function(){
		removeImage($(this));
	});
	
	$("#imageId"+imageId).find(".likebtn").click(function(){
		likeThisImage($(this),imageId);
	});


}




/*********************************************************************************
 * 	The whole HTML part to draw
 */
function thisImageHTML(url,description,descriptionDisplay,uploaderName,uploaderId,createDate,numOfComment,display,imageId,numLike){
	
	displayDate = dateHandle(createDate);
	
	html =  "<div class='eventpile' id = 'imageId"+imageId+"' style='display : "+display+";' >" +
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
		    							"By <a class='uploader'>"+uploaderName+"</a> "+
		    						"</div>"+
//		    						"<div class='' style = 'display:block'>"+
//		    							"<i class='angle down icon'></i>"+
//		    						"</div>"+
		    					"</div>"+
		    					"<div class='btnArea' style='display:none;'>"+
			                        "<a class='returnToSender' style='padding-right: 17px; padding-left: 17px;margin-left: 8px;'>" +
			                        	"<i class='share large icon'></i>" +
			                        "</a>" +
			                        "<a class='uploadFor' style='padding-right: 17px; padding-left: 17px;'>" +
		                        		"<i class='cloud upload large icon'></i>" +
		                        	"</a>" +
		                        	"<a class='setPortrait' style='padding-right: 17px; padding-left: 17px;'>" +
	                        			"<i class='user basic large icon'></i>" +
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


function imageButtonHandler(){	
	$("#showMoreButton").click(function(){
//		$('#eventsegment').masonry('destroy');
//		drawNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		itemInitialize();
	});
	
}



