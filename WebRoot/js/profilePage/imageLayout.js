$(function(){

	getImagePreCheck();

	showMoreButtonHandler();

});

function flipCardCheck(imageId){
	if ($.cookie("truthbook_thisImageId")==undefined||$.cookie("truthbook_thisImageId")==null)	return;
	if(imageId !=$.cookie("truthbook_thisImageId")) return;
	var imageToFlipId = $.cookie("truthbook_thisImageId");
//	$.cookie("truthbook_thisImageId", null,{expires: -1});
	flipImageByImageId(imageToFlipId);
}

function flipImageByImageId(imageId){
	showReply($("#imageId"+imageId).find(".likebtn"));
	//comment hasn't loaded problem
	$.cookie("truthbook_thisImageId", null,{expires: -1});
	$("#imageId"+imageId).find(".textarea").focus();
}

function needToLoadMoreImage(){
	if ($.cookie("truthbook_thisImageId")==undefined||$.cookie("truthbook_thisImageId")==null) return;
	recurFindTheImageToFlip($.cookie("truthbook_thisImageId"),1);
}

function recurFindTheImageToFlip(imageId,level){
	if(level == 10) {
		$.cookie("truthbook_thisImageId", null,{expires: -1});
		return;
	}
	if($("#imageId"+imageId).html()==undefined){
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE);
		itemInitialize("#eventsegment");
		recurFindTheImageToFlip(imageId,level+1);
		return;
	}
	return;
}

/*********************************************************************************	
 *	Home Page check
 *	1.	get all image if at home page
 *	2.	check friend relation if on other's page
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
 *	1.	is friend:	get all image without control panel
 *	2.	stranger:	get one image (no control panel, 
 *								   no comments can be seen, 
 *								   cannot add comment)
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
		if(isDebug)	drawConfirmPopUp("获取好友关系请求发送失败 Error: " + error);
		return false;
	};
	
	checkFriendRelationship($.cookie("truthbook").userId, $.cookie(
			"truthbook_PageOwner_userId").userId, onAjaxSuccess, onAjaxError);
}

/*********************************************************************************	
 *	Get all images when on home page or friend's page
 *	1.	separate unapproved image and approved image
 *	2.	the data and length are global variabels
 *	3.	check new image button 
 *	4.	draw approved image
 */

function getAllImage(userId,Control){
	var onAjaxSuccess = function(data,textStatus){
		//separate unapproved image and approved image
		var allImageData = approvedImageData(data,data.length);
		
		numApprovedImage = allImageData[0].length;
		numUnapprovImage = allImageData[1].length;
		
		approvedImage = imageInOrder(numApprovedImage, allImageData[0]);
		unapprovImage = imageInOrder(numUnapprovImage, allImageData[1]);
		
		//Has new image and on home page
		if (numUnapprovImage != 0 && Control == CONTROL.Self){		
			handleNewImageButton();
		}
		modifiedImageNum(numApprovedImage);
		if (numApprovedImage != 0 ){
			drawNextBatchImage(numApprovedImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,approvedImage,Control);
			return true;
		}
		else{
			disableShowMoreButton();			
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		if(isDebug)	drawConfirmPopUp("获取照片请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError);
}

/*********************************************************************************	
 *	Help function to separate new image and approved image
 */

function approvedImageData(data,numTotalImage){
	var approvedImageData = new Array();
	var unapprovImageData = new Array();
	for(var i = 0 ; i < numTotalImage ; i++){
		if (data[i].approved == "true"){
			approvedImageData.push(data[i]);
		} else {
			unapprovImageData.push(data[i]);
		}
	}
	return [approvedImageData,unapprovImageData];
}

/*********************************************************************************	
 *	draw guest image(just latest one right new)
 */

function getGuestImage(userId){
	var onAjaxSuccess = function(data,textStatus){
		disableShowMoreButton();
		if (data[0].imageUrl != undefined ){
			numApprovedImage = 1;
			drawGuestOneImage(data);
		}
		else{
			numApprovedImage = 0;		
			disableShowMoreButton();
		}
		modifiedImageNum(numApprovedImage);
	};
	var onAjaxError = function(xhr,status,error){
		if(isDebug) drawConfirmPopUp("获取照片请求发送失败 Error: " + error);
		return false;
	};
	getOneImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError);
}

/*********************************************************************************
 * 	When the user only allowed to see one image,
 */
function drawGuestOneImage(imageData){
	$.cookie("truthbook_Page_Image_Pointer", 1);
	prepareElement(imageData[0],true,CONTROL.No,COMMENT.No);
	itemInitialize("#eventsegment");
}

/*********************************************************************************
 * 	The function to execute right after get all the image info from the server.
 * 	1.	initialize the image pointer
 * 	2.	prepare the element
 * 	3.	use masonry to initialize the image layout
 * 	4.	add magnificPopup to current image
 */
function drawNextBatchImage(numOfImage,numToShow,imageData,Control){
	$.cookie("truthbook_Page_Image_Pointer", numToShow);
	var numToDraw = returnSmaller(numToShow,numOfImage);
	for(var i = 0 ; i < numToDraw ; i++){
		prepareElement(imageData[i],true,Control,COMMENT.Yes);
	}
	if (numOfImage<=numToShow)	disableShowMoreButton();
	itemInitialize("#eventsegment");
	needToLoadMoreImage();
}

/*********************************************************************************
 * 	The function similar to drawNextBatchImage().
 * 	1.	draw unapproved image
 */

function drawUnapproveImage(numOfImage,imageData){
	for(var i = 0 ; i < numOfImage ; i++){
		prepareUnapprovedElement(imageData[i],true);
	}
	newitemInitialize("#neweventsegment");
}

/*********************************************************************************
 * 	The HTML part of new image
 */
function thisUnapprovedImageHTML(url,description,descriptionDisplay,createDate,imageId,uploaderId){
	
	var displayDate = dateHandle(createDate);
	var urlLarge = getImageUrl(url,ImageType.Large);
	var urlMedium = getImageUrl(url,ImageType.Medium);
	
	html =  
	"<div class='eventpile' id = 'un_imageId"+imageId+"'>" +
		"<span class = 'imageId_span' style='display:none;'>"+imageId+"</span>"+
		"<span class = 'url_span' style='display:none;'>"+url+"</span>"+
		"<div class='ui shape'>" +
			"<div class='sides'>" +
		
				"<div class='active side ui items'>" +
					"<div class='item'>" + 	
						"<a class='image' href='"+urlLarge+"' title='"+description+"'>"+
							"<img src='"+urlMedium+"'>"+
						"</a>"+
						"<div class = 'discript content'>"+
							"<p class='description' style = 'display:"+descriptionDisplay+
								";word-break:break-all;margin-bottom: 10px;'>"+description+"</p>"+
						"</div>"+
						"<div class='meta' style = 'display:block;margin-top: 18px;' >"+
							"<a class='uploaderName' style='display:block;font-size:14px;margin-bottom:4px;'>By 某个关注你的人</a>"+
						"</div>"+
						"<div class='ui confirmBtn icon' style='display:block;text-align:center;margin-bottom:10px;margin-top:10px;'>" +
							"<div class='ui buttons'>"+
								"<div class='ui negative button'>残忍拒绝</div>"+
								"<div class='tiny or'></div>"+
								"<div class='ui positive button'>欣然接受</div>"+
							"</div>"+
						"</div>" +
						"<div class=\"extra\">"+
		    	        	"<span style='float: left;  text-align: left;'>"+displayDate+"</span>"+
		    	        "</div>"+              
		    	  "</div>" +
              "</div>" +
	        
              "<div class='side ui items'>" +
              	  "<div class='item'>" +
              	  	"<div class='ui segment acceptHead' style='margin-bottom: 0px; padding: 0px; height: 45px;border-bottom-right-radius:0px;border-bottom-left-radius:0px;box-shadow:0px 0px 0px 0px rgba(0, 0, 0, 0.1);'>" +
    					"<div class=\"ui center aligned header\" style='cursor:auto'>"+
    						""+
    					"</div>"+
					"</div>"+
					"<div class='ui minimal comments' style='padding-top: 10px;'>"+
						"<span class = 'uploaderId' style='display:none;'>"+uploaderId+"</span>"+
						"<div class=\"ui tiny center aligned header\" style='cursor:auto;'>"+
							"上传者：<span class=\"uploaderName\" style='color:#4C7A9F;'></span>"+
						"</div>"+
						"<div class='ui reply form' style='padding-left: 8px; width: 95%; padding-right: 10px; margin-top: 20px;'>"+
							"<div class='field'>"+
								"<textarea class='textarea' placeholder='你想说…' rows='8' style='resize:none;height:50px'></textarea>"+
							"</div>"+
							"<button class='ui fluid icon teal confirmSubmit button'>"+
								"确定"+
							"</button>"+
						"</div>"+
					"</div>"+
					
		    		"<div class=\"extra\">"+
		    	        "<span style='float: left;  text-align: left;'>"+displayDate+"</span>"+
		        	"</div>"+
		          "</div>" +
				"</div>" +
			
			"</div>" +
		"</div>" +
	"</div>";
return html;
}

/*********************************************************************************
 * 	The HTML part of approved image
 */
function thisImageHTML(url,description,descriptionDisplay,uploaderName,uploaderId,createDate,numOfComment,display,imageId,numLike,userId){
	
	var displayDate = dateHandle(createDate);
	var createDateStd = createDate.substr(0,4)+"年"+createDate.substr(5,2)+"月"+createDate.substr(8,2)+"日";	
	var urlLarge = getImageUrl(url,ImageType.Large);
	var	urlMedium = getImageUrl(url,ImageType.Medium);
	
	html =  "<div class='eventpile' id = 'imageId"+imageId+"' style='display : "+display+";' >" +
				"<span class = 'imageId_span' style='display:none;'>"+imageId+"</span>"+
				"<span class = 'userId_span' style='display:none;'>"+userId+"</span>"+
				"<span class = 'url_span' style='display:none;'>"+url+"</span>"+
		    	"<div class='ui shape'>" +
		    		"<div class='sides'>" +
		    		
		    			"<div class='active side ui items'>" +
		    				"<div class='item'>" +    					
		    					
		    					"<a class='image' href='"+urlLarge+"' title='"+description+"'>"+
		    						"<img src='"+urlMedium+"'>"+
		    						"<div class='imgbtnArea'>" +
			    						"<div class='ui tiny button likebtn' style='margin-right: 2px'>"+
			    							"<i class='heart tiny icon'></i>"+
			    						"</div>"+
			    						"<div class='ui tiny green inverted button commentbtn commentShow'>" +
			    							"<i class='comment icon'></i><span class='numOfComment_inline'>"+numOfComment+"</span>"+
			    						"</div>" +
			    					"</div>"+
		    					"</a>"+
		    					
		    					"<div class = 'discript content'>"+
		    						"<p class='description' style = 'display:"+descriptionDisplay+";word-break:break-all;margin-bottom: 10px;'>"+description+"</p>"+
		    						"<div class='meta' style = 'display:block;margin-top: 18px;' >"+
		    							"<span style='font-size:14px;'>By </span><a class='uploaderName' style='display:inline;font-size:14px;margin-bottom:4px;'>"+uploaderName+"</a>"+
		    							"<span class='uploaderId' style='display:none;'>" + uploaderId + "</span> "+
		    						"</div>"+
		    						"<div class='ui editBtn icon' style='display:none; margin:0 auto;cursor:pointer;width:10%'>" +
		    							"<i class='double angle down large icon'></i>"+
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
					    	        "<span class = 'shortDate' style='float: right;  text-align: right;margin-right: 4%'>"+displayDate+"</span>"+
					    	        "<span class= 'stdDate' style='display:none;float: right;  text-align: right;margin-right: 4%'>"+createDateStd+"</span>"+
			    	        	"</div>"+
		                     
			    	        "</div>" +
		                  "</div>" +
		    					                  
		       
		                  
		    			"<div class='side ui items'>" +
		    				"<div class='item'>" +
		    					"<div class='ui segment replyHead' style='margin-bottom: 0px; padding: 0px; height: 45px;border-bottom-right-radius:0px;border-bottom-left-radius:0px;box-shadow:0px 0px 0px 0px rgba(0, 0, 0, 0.1);'>" +
			    					"<div class=\"ui tiny right floated aligned header\">"+
			    					"</div>"+
			    					"<div class=\"ui tiny left floated aligned header commentReturn\">"+
			    						"<div class='ui commentToggle' style='cursor:pointer;'>" +
			    							"<i class='angle left icon'></i>返回"+
			    						"</div>" +
			    					"</div>"+
			    					"<div class=\"ui small floated center aligned header\" style='margin-left: 45px;'>"+
			    						"所有评论"+
			    					"</div>"+
		    					"</div>"+
		    					
		    					"<div class='ui minimal comments' style='padding-top: 10px;'>"+
			    						"<div class='commentwrap' style='max-height:450px;overflow-y:auto;width:102%;overflow-x:hidden;'>"+
			    						
			    						"</div>"+
			    						"<div class='ui reply form' style='padding-left: 8px; width: 95%; padding-right: 10px; margin-top: 20px;'>"+
			    							"<div class='field' >"+
			    								"<textarea class='textarea' placeholder='你想说…' rows='5' style='resize:none;'></textarea>"+
			    							"</div>"+
			    							"<span class = 'replyToId' style='display:none;'></span>"+
			    							"<span class = 'replyToName' style='display:none;'></span>"+
			    							"<button class='ui fluid labeled icon teal commentSubmit button'>"+
			    								"<i class=\"icon edit\"></i>添加评论"+
			    							"</button>"+
			    						"</div>"+
			    				"</div>"+
//		    					"</div>"+
			    					
		    				"</div>" +
		    			"</div>" +
		    			
		    		"</div>" +
		   		"</div>" +
		   	"</div>";
	return html;
}
