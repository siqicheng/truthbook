

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
			$("#imageId"+imageId).find(".numOfComment_inline").html(numTotalComment);
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
		getThisComment_All_onTimeline(imageId,onAjaxSuccess);
//		drawConfirmPopUp("获取评论请求发送失败 Error: " + error);
		return false;
	};	
	
	getAllCommentAPI(imageId,onAjaxSuccess,onAjaxError);
}


function getThisComment_Part_onTimeline(imageId,showCommentNumber){//,totalCommentNumber){
	var onAjaxSuccess = function(data,textStatus){
		if (data != null){
			var numTotalComment = commentLengthJson(data)-1;
			if(numTotalComment == 0){
				var totalCommentNumber = data.imageComment.id;
			}else{
				var totalCommentNumber = data.imageComment[numTotalComment].id;
			}
			$("#itemId"+imageId).find(".loadAllComments .numToShow").html(totalCommentNumber- NUM_SHOW_COMMENT_ON_TIMELINE);
			if ((totalCommentNumber-numTotalComment)<=0){
				$("#itemId"+imageId).find(".loadAllComments").hide();
			}
			if (numTotalComment == -1){
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
	
//	Only valid for server side using UTC	
//	alert(translate_timezone("Fri May 23 20:37:39 +0000 2014",8,1));//2014年5月24日 04:37:39 星期六 当前时区：+0800	
//	createDate = "2014-05-24T00:20:36+08:00";
//	t=	["2014年5月24日", "8:20:36", "周六", "当前时区：+0800"]
//	h=  ["8", "20", "36"]
	
	if(createDate == "just now") return "just now";
	
	var date = new Date();
	var day_now = date.getDate();
	var month_now = Number(date.getMonth()+1);//if (month_now < 10) month_now="0"+Number(date.getMonth()+1);
	var year_now = date.getFullYear();
	
	var modifiedTime = translate_timezone(formatTheServerDate(createDate),parseInt(date.toTimeString().substr(12,5))/100,1);
	var t = modifiedTime.split(" ");
	var h = t[1].split(":");
	
	var year_upload = t[0].substr(0,4);
	var month_upload = t[0].substring(t[0].indexOf("年")+1,t[0].indexOf("月"));
	var day_upload = t[0].substring(t[0].indexOf("月")+1,t[0].indexOf("日"));
	var hour_upload = h[0];
	var min_upload = h[1];
	var second_upload = h[2];
	
	var defaultDisplayDate = month_upload+"月"+day_upload+"日 "+t[2] + " " + hour_upload+":"+min_upload;
	
	if(year_upload != year_now || month_upload != month_now){
		return defaultDisplayDate;
	} else {
		var hour_now = date.getHours();
		var min_now = date.getMinutes();
		var second_now = date.getSeconds();

		if (day_now>day_upload){
			if(day_now-day_upload==1){
				return ("昨天 "+hour_upload+":"+min_upload);
			} else if(day_now-day_upload==2){
				return ("前天 "+hour_upload+":"+min_upload);
			} else {
				return (month_upload+"月"+day_upload+"日 "+hour_upload+":"+min_upload);
			}
		}
		if (hour_now>hour_upload){
			return ("今天 "+hour_upload+":"+min_upload);
		}
		if (min_now>min_upload){
			return (min_now - min_upload)+"分钟前";
		}
		if (second_now>second_upload){
			return (second_now - second_upload)+"秒钟前";
		}
		return defaultDisplayDate;
	}

}

