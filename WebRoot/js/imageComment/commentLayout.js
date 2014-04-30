

function commentLengthJson(data){
	if(data == null){
		return -1;
	}
	if (data.imageComment.length != undefined){
		return data.imageComment.length;
	} else if (data != null) {
		return 1;
	}
}

function getThisComment_All(imageId,Control){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null){
			var numTotalComment = commentLengthJson(data);
			if (numTotalComment == 1){
				var commentContent = data.imageComment.comment.commentContent,
					repliedByCommentId = data.imageComment.comment.repliedByCommentId,
					repliedByName = data.imageComment.comment.repliedByCommentName,
					repliedByProtrait = data.imageComment.comment.repliedByCommentPortrait,
					repliedToCommentId = data.imageComment.comment.repliedToCommentId,
					repliedToName = data.imageComment.comment.repliedToCommentName,
					commentId = data.imageComment.comment.commentId,
					
					createDate = data.imageComment.comment.createDate;
					
				repliedToCommentId!= null ? replyToDisplay = "inline":replyToDisplay = "none";
				repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
				if (Control == CONTROL.Self || repliedByCommentId == $.cookie("truthbook").userId){
					deleteDisplay = "inline";
				} else {
					deleteDisplay = "none";
				}
				repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);
					
				$("#imageId"+imageId).find(".commentwrap").append(thisCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
				
			} else {
				for (var i=0;i<numTotalComment;i++){
					var commentContent = data.imageComment[i].comment.commentContent,
						repliedByCommentId = data.imageComment[i].comment.repliedByCommentId,
						repliedByName = data.imageComment[i].comment.repliedByCommentName,
						repliedByProtrait = data.imageComment[i].comment.repliedByCommentPortrait,
						repliedToCommentId = data.imageComment[i].comment.repliedToCommentId,
						repliedToName = data.imageComment[i].comment.repliedToCommentName,
						commentId = data.imageComment[i].comment.commentId,

						createDate = data.imageComment[i].comment.createDate;
					
					repliedToCommentId!=null ? replyToDisplay = "inline":replyToDisplay = "none";
					repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
					if (Control == CONTROL.Self || repliedByCommentId == $.cookie("truthbook").userId){
						deleteDisplay = "inline";
					} else {
						deleteDisplay = "none";
					}
					repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

					$("#imageId"+imageId).find(".commentwrap").append(thisCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
					
				}			
			}
			
			addCommentButtonHandler(imageId);
			
			

		} else {
			//没有评论
		}
		flipCardCheck(imageId);
		return true;
	};
	var onAjaxError = function(xhr,status,error){
		getAllCommentAPI(imageId,onAjaxSuccess);
//		drawConfirmPopUp("获取评论请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllCommentAPI(imageId,onAjaxSuccess,onAjaxError);
}

function getThisComment_All_onTimeline(imageId){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null){
			var numTotalComment = commentLengthJson(data);
			if (numTotalComment == 1){
				var commentContent = data.imageComment.comment.commentContent,
					repliedByCommentId = data.imageComment.comment.repliedByCommentId,
					repliedByName = data.imageComment.comment.repliedByCommentName,
					repliedByProtrait = data.imageComment.comment.repliedByCommentPortrait,
					repliedToCommentId = data.imageComment.comment.repliedToCommentId,
					repliedToName = data.imageComment.comment.repliedToCommentName,
					commentId = data.imageComment.comment.commentId,
					imageOwnerId = data.imageComment.image.user.userId,
					createDate = data.imageComment.comment.createDate;
					
				repliedToCommentId!= null ? replyToDisplay = "inline":replyToDisplay = "none";
				repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
				if (imageOwnerId == $.cookie("truthbook").userId || repliedByCommentId == $.cookie("truthbook").userId){
					deleteDisplay = "inline";
				} else {
					deleteDisplay = "none";
				}
				repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);
					
				$("#itemId"+imageId).find(".commentwrap").append(thistimelineCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
				
			} else {
				for (var i=0;i<numTotalComment;i++){
					var commentContent = data.imageComment[i].comment.commentContent,
						repliedByCommentId = data.imageComment[i].comment.repliedByCommentId,
						repliedByName = data.imageComment[i].comment.repliedByCommentName,
						repliedByProtrait = data.imageComment[i].comment.repliedByCommentPortrait,
						repliedToCommentId = data.imageComment[i].comment.repliedToCommentId,
						repliedToName = data.imageComment[i].comment.repliedToCommentName,
						commentId = data.imageComment[i].comment.commentId,
						imageOwnerId = data.imageComment[i].image.user.userId,
						createDate = data.imageComment[i].comment.createDate;
					
					repliedToCommentId!=null ? replyToDisplay = "inline":replyToDisplay = "none";
					repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
					if (imageOwnerId == $.cookie("truthbook").userId || repliedByCommentId == $.cookie("truthbook").userId){
						deleteDisplay = "inline";
					} else {
						deleteDisplay = "none";
					}
					repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

					$("#itemId"+imageId).find(".commentwrap").append(thistimelineCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
					
				}			
			}
			
			addCommentButtonHandlerOnTimeline(imageId);
			return true;
		} else {
			//没有评论
			return true;
		}

	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取评论请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllCommentAPI(imageId,onAjaxSuccess,onAjaxError);
}


function getThisComment_Part_onTimeline(imageId,showCommentNumber,totalCommentNumber){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null){
			var numTotalComment = commentLengthJson(data);
			console.log(numTotalComment);
			if ((totalCommentNumber-numTotalComment)<=0)
				$("#itemId"+imageId).find(".loadAllComments").hide();
			if (numTotalComment == 1){
				var commentContent = data.imageComment.comment.commentContent,
					repliedByCommentId = data.imageComment.comment.repliedByCommentId,
					repliedByName = data.imageComment.comment.repliedByCommentName,
					repliedByProtrait = data.imageComment.comment.repliedByCommentPortrait,
					repliedToCommentId = data.imageComment.comment.repliedToCommentId,
					repliedToName = data.imageComment.comment.repliedToCommentName,
					commentId = data.imageComment.comment.commentId,
					imageOwnerId = data.imageComment.image.user.userId,
					createDate = data.imageComment.comment.createDate;
					
				repliedToCommentId!= null ? replyToDisplay = "inline":replyToDisplay = "none";
				repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
				if (imageOwnerId == $.cookie("truthbook").userId || repliedByCommentId == $.cookie("truthbook").userId){
					deleteDisplay = "inline";
				} else {
					deleteDisplay = "none";
				}
				repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);
					
				$("#itemId"+imageId).find(".commentwrap").append(thistimelineCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
			} else {
				for (var i=numTotalComment-1;i>=0;i--){
					var commentContent = data.imageComment[i].comment.commentContent,
						repliedByCommentId = data.imageComment[i].comment.repliedByCommentId,
						repliedByName = data.imageComment[i].comment.repliedByCommentName,
						repliedByProtrait = data.imageComment[i].comment.repliedByCommentPortrait,
						repliedToCommentId = data.imageComment[i].comment.repliedToCommentId,
						repliedToName = data.imageComment[i].comment.repliedToCommentName,
						commentId = data.imageComment[i].comment.commentId,
						imageOwnerId = data.imageComment[i].image.user.userId,
						createDate = data.imageComment[i].comment.createDate;
					
					repliedToCommentId!=null ? replyToDisplay = "inline":replyToDisplay = "none";
					repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
					if (imageOwnerId == $.cookie("truthbook").userId || repliedByCommentId == $.cookie("truthbook").userId){
						deleteDisplay = "inline";
					} else {
						deleteDisplay = "none";
					}
					repliedByProtrait = getImageUrl(repliedByProtrait,ImageType.Small);

					$("#itemId"+imageId).find(".commentwrap").append(thistimelineCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
				}			
			}
			
			addCommentButtonHandlerOnTimeline(imageId);
			return true;
		} else {
			$("#itemId"+imageId).find(".loadAllComments").hide();
			return true;
		}

	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取评论请求发送失败 Error: " + error);
		return false;
	};	
	
	getPartOfCommentAPI(imageId,showCommentNumber,onAjaxSuccess,onAjaxError);
}

function addCommentButtonHandlerOnTimeline(imageId){
	$("#itemId"+imageId).find(".actions .reply").click(function(){
		thisComment = $(this).parent().parent().parent();
		replySomeone(imageId,thisComment.find(".repliedByName_span").html(),thisComment.find(".repliedByCommentId_span").html());
	});
	
	$("#itemId"+imageId).find(".actions .delete").click(function(){
		removeComment(imageId,$(this).parent().parent().parent().find(".commentId_span").html());
	});
	
	$("#itemId"+imageId).find(".commentwrap .comment .avatar.tiny").click(function(){
		var thisCommentByUserId = $(this).parent().find(".repliedByCommentId_span").html();
		console.log(thisCommentByUserId);
		goOthersPage(thisCommentByUserId);
	});
}

function addCommentButtonHandler(imageId){
	$("#imageId"+imageId).find(".actions .reply").click(function(){
		thisComment = $(this).parent().parent().parent();
		replySomeone(imageId,thisComment.find(".repliedByName_span").html(),thisComment.find(".repliedByCommentId_span").html());
	});
	
	$("#imageId"+imageId).find(".actions .delete").click(function(){
		removeComment(imageId,$(this).parent().parent().parent().find(".commentId_span").html());
	});
	
	
	
}

function thisCommentHTML(commentId,commentContent,repliedByCommentId,repliedByName,repliedByProtrait,
							repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay){
	
	var displayDate = commentDateHandle(createDate);
	
	html = 	"<div class=\"comment\" id=\"commentId" + commentId + "\">"+
				"<span class = 'repliedByCommentId_span' style='display:none;'>"+repliedByCommentId+"</span>"+
				"<span class = 'repliedByName_span' style='display:none;'>"+repliedByName+"</span>"+
				"<span class = 'repliedToCommentId_span' style='display:none;'>"+repliedToCommentId+"</span>"+
				"<span class = 'commentId_span' style='display:none;'>"+commentId+"</span>"+
				"<a class=\"avatar tiny\" style=\"padding-top: 6px;\">"+
					"<img src=\""+repliedByProtrait+"\" style='width:35px;height:35px;'>"+
				"</a>"+
				"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
					"<a class=\"author\" style='font-weight:bold;color:#4C7A9F;font-size:12px;'>" + repliedByName + "</a>"+
					
					"<div class='metadata' style='display:"+replyToDisplay+";margin-left: 4px;font-size:12px;'><span class='date'>to</span></div>"+
						"<a class='to author' style='display:"+replyToDisplay+";font-weight:bold;color:#4C7A9F;font-size:12px;'>"+repliedToName+"</a><span style='font-size:12px;'> :</span>"+
					"<div class=\"text\" style='margin-bottom: 0px; margin-top: 0px;font-size:14px;'>"+
						commentContent+
					"</div>"+
					"<div class=\"actions\" style='display:inline;'>"+
			              "<a class=\"reply \" style='display:"+replyDisplay+";font-size:12px;'>回复</a>"+
			              "<a class=\"delete \" id='delete"+commentId+"' style='display:"+deleteDisplay+";font-size:12px;'>删除</a>"+  
		            "</div>"+
		            "<span class=\"date\" style='font-size:12px;padding-top: 2px;float:right;text-align:right;color:#999999;'>" + displayDate + "</span>"+
				"</div>"+
			"</div>";
	return html;
}

function commentDateHandle(createDate){
	if(createDate == "just now") return "just now";
	date = new Date();
	day = date.getDate();
	month = Number(date.getMonth()+1);if (month < 10) month="0"+Number(date.getMonth()+1);
	year = date.getFullYear();
	
	thisMonth = year+"-"+month; 
	uploadDate = createDate.substring(0,createDate.indexOf("T")-3);
	defaultUploadDate = createDate.substring(0,createDate.indexOf("T"));
	defaultDisplayDate = defaultUploadDate.substr(0,4)+"年"+defaultUploadDate.substr(5,2)+"月"+defaultUploadDate.substr(8,2)+"日";	
	if(uploadDate != thisMonth){	
		return defaultDisplayDate;
	} else {
		hour = date.getHours();
		minute = date.getMinutes();
		second = date.getSeconds();
		
		upload_day = createDate.substr(createDate.indexOf("T")-2,2);
		upload_hour = createDate.substr(createDate.indexOf("T")+1,2);
		upload_minute = createDate.substr(createDate.indexOf("T")+4,2);
		upload_second = createDate.substr(createDate.indexOf("T")+7,2);

		if (day>upload_day){
			if(day-upload_day==1){
				return ("昨天 "+upload_hour+":"+upload_minute);
			} else {
				var month_display = defaultUploadDate.substr(5,2);
				if (Number(month_display)<10){
					month_display = defaultUploadDate.substr(6,1);
				}
				return (month_display+"月"+defaultUploadDate.substr(8,2)+"日 "+upload_hour+":"+upload_minute);
			}
		}
		if (hour>upload_hour){
			return ("今天 "+upload_hour+":"+upload_minute);
		}
		if (minute>upload_minute){
			return (minute - upload_minute)+"分钟前";
		}
		if (second>upload_second){
			return (second - upload_second)+"秒钟前";
		}
		return defaultDisplayDate;
	}

}

