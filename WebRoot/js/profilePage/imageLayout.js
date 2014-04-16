$(function(){
	getImagePreCheck();
});

function imageLengthJson(data){
	if(data == null){
		return -1;
	}
	if (data.message.length != undefined){
		return data.image.length;
	} else if (data != null) {
		return 1;
	}
}

function getImagePreCheck(){
	if($.cookie("truthbook").userId == $.cookie("truthbook_PageOwner_userId").userId){
		getAllImage();
	}else{
		friendRelationCheck();
	}
}

function friendRelationCheck(){
	var onAjaxSuccess = function(data,textStatus){
		if (data > 0 ){
			getAllImage();
			return true;
		}
		else{
			getGuestImage();
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取好友关系请求发送失败 Error: " + error);
		return false;
	};
	
	checkFriendRelationship($.cookie("truthbook").userId, $.cookie("truthbook_PageOwner_userId").userId, onAjaxSuccess, onAjaxError);
}

function getAllImage(){
	var onAjaxSuccess = function(data,textStatus){
		$.cookie("truthbook_Page_Image_Json", data);
		if (data != null ){
			$.cookie("truthbook_Page_Image_Pointer", 0);
			var numTotalImage = imageLengthJson(data);
			if(numTotalImage==1){
				drawOneImage();
			}else{
				drawNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,numToShow,numTotalImage);
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

function getGuestImage(){
//ToDo: Guest Image
}

function drawOneImage(){
//ToDo: 
}

function drawNextBatchImage(numOfNextBatch,numToShow,numTotalImage){
	var currentPointer = $.cookie("truthbook_Page_Image_Pointer"),
		imageData = $.cookie("truthbook_Page_Image_Json");
	for(var i = 0 ; i < numOfNextBatch ; i++){
		var url = imageData.image[currentPointer+i].url;
			discript = imageData.image[currentPointer+i].discript,
			uploaderName =  imageData.image[currentPointer+i].uploaderName,
			uploaderId = imageData.image[currentPointer+i].uploaderId,
			createDate = imageData.image[currentPointer+i].createDate,
			numOfComment = imageData.image[currentPointer+i].numOfComment;
		$("#eventsegment").append(thisImageHTML(url,discript,uploaderName,uploaderId,createDate,numOfComment));		
		
		if (isLastImage(i,currentPointer,numTotalImage)){	
			break;	
		}
		
	}
	
}

function isLastImage(i,currentPointer,numTotalImage){
	return (i+currentPointer) == numTotalImage;
}

function thisImageHTML(url,discript,uploaderName,uploaderId,createDate,numOfComment){
	html =  "<div class='eventpile'>" +
		    	"<div class='ui shape'>" +
		    		"<div class='sides'>" +
		    			"<div class='active side ui items'>" +
		    				"<div class='item'>" +    					
		    					"<div class='image'>\n"+
		    						"<img src='"+url+"'>"+
		    							"<a class='ui tiny circular button likebtn'>&ensp;<i class='heart tiny icon'></i></a>"+
		    					"</div>"+    					
		    					"<div class = 'content'>"+
		    						"<p class='description'>"+descript+"</p>"+
		    						"<div class='meta'>"+
		    							"By <a class='uploader'>"+uploaderName+"</a> "+createDate+
		    						"</div>"+
		    					"</div>"+   					
		    					"<div class='btnArea'>" +
		    						"<button class='ui tiny red inverted animated button commentToggle'>" +
		    							"<div class='visible content'>&ensp;<i class='comment icon'></i>&ensp;</div>" +
		    							"<div class='hidden content'>"+numOfComment+"</div>" +
		    						"</button>" +
		    						"<button class='ui tiny basic animated button eventRemove'>" +
		    							"<div class='visible content'>&ensp;<i class='remove icon'></i>&ensp;</div>" +
		    							"<div class='hidden content'>删除</div>" +
		    						"</button>" +
		    					"</div>" +    					
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




