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
		allImageData = approvedImageData(data,data.length);	
		imageData = allImageData[0];
		unapprovImage = allImageData[1];
		var numUnappImage = unapprovImage.length;
		var numTotalImage = imageData.length;
		
		if (numUnappImage != 0 && Control == CONTROL.Self){
			showNewImageButton(numUnappImage);
			$("#newPhotoButton").click(function(){
				hideNewImageButton();
				showReturnHomeButton();
				$('#eventsegment').masonry('destroy');
				$("#eventsegment").html("");
				drawUnapproveImage(numUnappImage,unapprovImage);
			});
			$("#approvedPhotoButton").click(function(){
//				hideReturnHomeButton();
//				showNewImageButton();
				
				goHomePage();
			});
			
		}
		
		
		$.cookie("truthbook_Page_Image_Num", numTotalImage);
		changeImageNum();
		if (numTotalImage != 0 ){
			drawNextBatchImage(numTotalImage,NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE,numTotalImage,imageData,Control);
			return true;
		}
		else{
			disableShowMoreButton();			
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取照片请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllImageByUserIdAPI(userId,onAjaxSuccess,onAjaxError);
}

function approvedImageData(data,numTotalImage){
	approvedImageData = new Array();
	unapprovImageData = new Array();
	for(var i = 0 ; i < numTotalImage ; i++){
		if (data[i].approved == "true"){
			approvedImageData.push(data[i]);
		} else {
			unapprovImageData.push(data[i]);
		}
	}
	return [approvedImageData,unapprovImageData];
}

function getGuestImage(userId){
	var onAjaxSuccess = function(data,textStatus){
		disableShowMoreButton();
		if (data[0].imageUrl != undefined ){
			$.cookie("truthbook_Page_Image_Num", 1);
			changeImageNum();
			drawGuestOneImage(data);
			return true;
		}
		else{
			$.cookie("truthbook_Page_Image_Num", 0);
			changeImageNum();
			disableShowMoreButton();
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
	addImageButtonHandler(imageId,CONTROL.No,COMMENT.No);
	strangerHandler(imageId);
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
		
		addImageButtonHandler(imageId,Control,COMMENT.Yes);
		getThisComment_All(imageId,Control);
	}
	
	if (numTotalImage<=numToShow)	disableShowMoreButton();
	itemInitialize();
	return;
}

function drawUnapproveImage(numUnappImage,unapprovImage){
	var	imageIdinorder = imageInOrder(numUnappImage, unapprovImage);	
	for(var i = 0 ; i < numUnappImage ; i++){
		var url = unapprovImage[imageIdinorder[i][1]].imageUrl;
			description = unapprovImage[imageIdinorder[i][1]].description,
//			uploaderName =  unapprovImage[imageIdinorder[i][1]].uploaderName,
			uploaderId = unapprovImage[imageIdinorder[i][1]].uploaderId,
			createDate = unapprovImage[imageIdinorder[i][1]].createDate,
//			numOfComment = unapprovImage[imageIdinorder[i][1]].commentCnt,
			imageId = unapprovImage[imageIdinorder[i][1]].imageId,
//			numLike = unapprovImage[imageIdinorder[i][1]].like,
			display = i < numUnappImage ?"inline":"none";	
		
		description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
		
		$("#eventsegment").append(thisUnapprovedImageHTML(url,description,descriptionDisplay,uploaderId,createDate,imageId));
		
		addUnapprovedImageButtonHandler(imageId);
	}
	itemInitialize();
}



function thisUnapprovedImageHTML(url,description,descriptionDisplay,uploaderId,createDate,imageId){
	
	displayDate = dateHandle(createDate);
	
	html =  "<div class='eventpile' id = 'imageId"+imageId+"' style='display : "+display+";' >" +
	"<span class = 'imageId_span' style='display:none;'>"+imageId+"</span>"+
	"<span class = 'url_span' style='display:none;'>"+url+"</span>"+
	"<div class='ui shape'>" +
		"<div class='sides'>" +
		
			"<div class='active side ui items'>" +
				"<div class='item'>" +    					
					
					"<a class='image' href='"+url+"'>"+
						"<img src='"+url+"'>"+
					"</a>"+
					
					"<div class = 'discript content'>"+
						"<p class='description' style = 'display:"+descriptionDisplay+";word-break:break-all;margin-bottom: 10px;'>"+description+"</p>"+
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
    					"<div class=\"ui tiny right floated aligned header\">"+
    					"</div>"+
    					"<div class=\"ui tiny left floated aligned header acceptImageReturn\">"+
    						"<div class='ui commentToggle' style='cursor:pointer;'>" +
    							"<i class='angle left icon'></i>返回"+
    						"</div>" +
    					"</div>"+
    					"<div class=\"ui small floated center aligned header\" style='margin-left: 45px;'>"+
    						""+
    					"</div>"+
					"</div>"+
					"<div class='ui minimal comments' style='padding-top: 10px;'>"+
						"<div class='ui reply form' style='padding-left: 8px; width: 95%; padding-right: 10px; margin-top: 20px;'>"+
							"<div class='field' style='height: 80px;'>"+
								"<textarea class='textarea' placeholder='你想说…' rows='8' style='resize:none;height: 80px;'></textarea>"+
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
		    					
		    					"<a class='image' href='"+url+"'>"+
		    						"<img src='"+url+"'>"+
		    						"<div class='imgbtnArea'>" +
			    						"<div class='ui tiny button likebtn' style='margin-right: 2px'>"+
			    							"<i class='heart tiny icon'></i>"+
			    						"</div>"+
			    						"<div class='ui tiny green inverted button commentbtn commentToggle'>" +
			    							"<i class='comment icon'></i><span class='numOfComment_inline'>"+numOfComment+"</span>"+
			    						"</div>" +
			    					"</div>"+
		    					"</a>"+
		    					
		    					"<div class = 'discript content'>"+
		    						"<p class='description' style = 'display:"+descriptionDisplay+";word-break:break-all;margin-bottom: 10px;'>"+description+"</p>"+
		    						"<div class='meta' style = 'display:block;margin-top: 18px;' >"+
		    							"<a class='uploaderName' style='display:block;font-size:14px;margin-bottom:4px;'>By "+uploaderName+"</a>"+
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
					    	        "<span style='float: right;  text-align: right;margin-right: 5%'>"+displayDate+"</span>"+
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
			    						
//			    						"<div class=\"comment\">"+
//				    			        	"<a class=\"avatar tiny\">"+
//				    			        		"<img src=\"http://localhost:8080/truthbook/Uploaded/csq_to_siqicheng_at_2014-04-22_13-50-36.jpg\""+
//				    			        		"style='width:35px;height:35px;'>"+
//				    			        	"</a>"+
//				    			        	"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
//				    			        		"<a class=\"author\" style='font-weight:bold;'>李开复</a>"+
//				    			        		"<div class=\"metadata\">"+
//				    			        			"<span class=\"date\">2 days ago</span>"+
//				    			        		"</div>"+
//				    			        		"<div class=\"text\" style='margin-bottom: 4px; margin-top: 4px;font-size:13px;'>"+
//				    			        			"我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。。我卖的是一百字的心灵鸡汤。我卖的是一百字"+
//				    			        		"</div>"+
//				    			        	"</div>"+
//				    			        "</div>"+
//				    			        			        
//				    
//			    						"<div class=\"comment\">"+
//				    			        	"<a class=\"avatar tiny\">"+
//				    			        		"<img src=\""+DefaultImg+"\" style='width:35px;height:35px;'>"+
//				    			        	"</a>"+
//				    			        	"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
//				    			        		"<a class=\"author\" style='font-weight:bold;'>薛蛮子</a>"+
//				    			        		"<div class='metadata' style='display:inline;margin-left: 4px;font-size:12px;'><span class='date'>to</span></div>"+
//				    							"<a class='to author' style='display:inline;font-weight:bold;'>李开复</a>"+
//				    			        		
//				    			        		"<div class=\"metadata\">"+
//				    			        			"<span class=\"date\">2 days ago</span>"+
//				    			        		"</div>"+
//				    			        		"<div class=\"text\" style='margin-bottom: 4px; margin-top: 4px;font-size:13px;'>"+
//				    			        			"我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字"+
//				    			        		"</div>"+
//				    			        	"</div>"+
//			    			        	"</div>"+
//			    			        	
//			    						"<div class=\"comment\">"+
//			    			        	"<a class=\"avatar tiny\">"+
//			    			        		"<img src=\""+DefaultImg+"\" style='width:35px;height:35px;'>"+
//			    			        	"</a>"+
//			    			        	"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
//			    			        		"<a class=\"author\" style='font-weight:bold;color:#4C7A9F;font-size:10px;'>薛蛮子</a>"+
//			    			        		"<div class='metadata' style='display:inline;margin-left: 4px;font-size:12px;'><span class='date'>to</span></div>"+
//			    							"<a class='to author' style='display:inline;font-weight:bold;color:#4C7A9F;font-size:10px;'>李开复</a>"+
//			    			        		
//			    			        		"<div class=\"metadata\">"+
//			    			        			"<span class=\"date\">2 days ago</span>"+
//			    			        		"</div>"+
//			    			        		"<div class=\"text\" style='margin-bottom: 4px; margin-top: 4px;font-size:13px;'>"+
//			    			        			"我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字"+
//			    			        		"</div>"+
//			    			        	"</div>"+
//		    			        	"</div>"+
//		    						"<div class=\"comment\">"+
//		    			        	"<a class=\"avatar tiny\">"+
//		    			        		"<img src=\""+DefaultImg+"\" style='width:35px;height:35px;'>"+
//		    			        	"</a>"+
//		    			        	"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
//		    			        		"<a class=\"author\" style='font-weight:bold;'>薛蛮子</a>"+
//		    			        		"<div class='metadata' style='display:inline;margin-left: 4px;font-size:12px;'><span class='date'>to</span></div>"+
//		    							"<a class='to author' style='display:inline;font-weight:bold;'>李开复</a>"+
//		    			        		
//		    			        		"<div class=\"metadata\">"+
//		    			        			"<span class=\"date\">2 days ago</span>"+
//		    			        		"</div>"+
//		    			        		"<div class=\"text\" style='margin-bottom: 4px; margin-top: 4px;font-size:13px;'>"+
//		    			        			"我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字我放出来了才四十个字"+
//		    			        		"</div>"+
//		    			        	"</div>"+
//	    			        	"</div>"+
			    			    
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
