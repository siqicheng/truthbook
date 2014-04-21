$(function(){
	getImagePreCheck();
	showMoreButtonHandler();

});

/*********************************************************************************	
 *	Homepage check
 */

function getImagePreCheck(){
	if($.cookie("truthbook").userId == $.cookie("truthbook_PageOwner_userId").userId){
		getAllImage($.cookie("truthbook_PageOwner_userId").userId,CONTROL.Self);
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
			getAllImage($.cookie("truthbook_PageOwner_userId").userId,CONTROL.No);
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

function getAllImage(userId,Control){
	var onAjaxSuccess = function(data,textStatus){
		var numTotalImage = data.length;
		if (numTotalImage != 0 ){	
			$.cookie("truthbook_Page_Image_Num", numTotalImage);
			drawNextBatchImage(numTotalImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,data,Control);
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
		if (data.imageUrl != undefined ){
//			$.cookie("truthbook_Page_Image_Num", 1);
//			$.cookie("truthbook_Page_Image_Pointer", 0);
//			drawNextBatchImage(1,1,1,data);
			drawGuestOneImage(data);
			return true;
		}
		else{
			disableShowMoreButton();
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
	addImageButtonHandler(imageId,CONTROL.No);
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
function drawNextBatchImage(numOfNextBatch,numToShow,numTotalImage,imageData,Control){
	$.cookie("truthbook_Page_Image_Pointer", numToShow);
	
	var	imageIdinorder = imageInOrder(numTotalImage, imageData);
		
	for(var i = 0 ; i < numOfNextBatch ; i++){
		var url = imageData[imageIdinorder[i][1]].imageUrl;
			description = imageData[imageIdinorder[i][1]].description,
			uploaderName =  imageData[imageIdinorder[i][1]].uploaderName,
			uploaderId = imageData[imageIdinorder[i][1]].uploaderId,
			createDate = imageData[imageIdinorder[i][1]].createDate,
			numOfComment = imageData[imageIdinorder[i][1]].commentCnt,
			imageId = imageData[imageIdinorder[i][1]].imageId,
			numLike = imageData[imageIdinorder[i][1]].like,
			display = i < numToShow ?"inline":"none";	
		
		if (numLike=="") numLike = "0";
		description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
		
		$("#eventsegment").append(thisImageHTML(url,description,descriptionDisplay,uploaderName,
								uploaderId,createDate,numOfComment,display,imageId,numLike));
		
		addImageButtonHandler(imageId,Control);
	}
	if (numTotalImage<=numToShow)	disableShowMoreButton();
	itemInitialize();
	return;
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
		    					
		    					"<a class='image'>"+
		    						"<img src='"+url+"'>"+
		    						"<div class='imgbtnArea'>" +
			    						"<div class='ui tiny button likebtn' style='margin-right: 2px'>"+
			    							"<i class='heart tiny icon'></i>"+
			    						"</div>"+
			    						"<div class='ui tiny green inverted button commentbtn commentToggle'>" +
			    							"<i class='comment icon'></i>"+numOfComment+
			    						"</div>" +
			    					"</div>"+
		    					"</a>"+
		    					
		    					"<div class = 'discript content'>"+
		    						"<p class='description' style = 'display:"+descriptionDisplay+";word-break:break-all;'>"+description+"</p>"+
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
