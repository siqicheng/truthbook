

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
					repliedByName = data.imageComment.comment.repliedByName,
					repliedByProtrait = data.imageComment.comment.repliedByProtrait,
					repliedToCommentId = data.imageComment.comment.repliedToCommentId,
					repliedToName = data.imageComment.comment.repliedToName,
					commentId = data.imageComment.comment.commentId,
					
					createDate = data.imageComment.comment.createDate;
					
				repliedToCommentId!= null ? replyToDisplay = "inline":replyToDisplay = "none";
				repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
				if (Control == CONTROL.Self || repliedByCommentId == $.cookie("truthbook").userId){
					deleteDisplay = "inline";
				} else {
					deleteDisplay = "none";
				}
					
					
				$("#imageId"+imageId).find(".commentwrap").append(thisCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
				
			} else {
				for (var i=0;i<numTotalComment;i++){
					var commentContent = data.imageComment[i].comment.commentContent,
						repliedByCommentId = data.imageComment[i].comment.repliedByCommentId,
						repliedByName = data.imageComment[i].comment.repliedByName,
						repliedByProtrait = data.imageComment[i].comment.repliedByProtrait,
						repliedToCommentId = data.imageComment[i].comment.repliedToCommentId,
						repliedToName = data.imageComment[i].comment.repliedToName,
						commentId = data.imageComment[i].comment.commentId,

						createDate = data.imageComment[i].comment.createDate;
					
					repliedToCommentId!=null ? replyToDisplay = "inline":replyToDisplay = "none";
					repliedByCommentId != $.cookie("truthbook").userId ? replyDisplay = "inline":replyDisplay = "none";
					if (Control == CONTROL.Self || repliedByCommentId == $.cookie("truthbook").userId){
						deleteDisplay = "inline";
					} else {
						deleteDisplay = "none";
					}
					
					$("#imageId"+imageId).find(".commentwrap").append(thisCommentHTML(commentId,commentContent,
						repliedByCommentId,repliedByName,repliedByProtrait,
						repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay));
					
				}			
			}
			
			addCommentButtonHandler(imageId);
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
	
	html = 	"<div class=\"comment\" id=\"commentId" + commentId + "\">"+
				"<span class = 'repliedByCommentId_span' style='display:none;'>"+repliedByCommentId+"</span>"+
				"<span class = 'repliedByName_span' style='display:none;'>"+repliedByName+"</span>"+
				"<span class = 'repliedToCommentId_span' style='display:none;'>"+repliedToCommentId+"</span>"+
				"<span class = 'commentId_span' style='display:none;'>"+commentId+"</span>"+
				"<a class=\"avatar tiny\" style=\"padding-top: 6px;\">"+
					"<img src=\""+DefaultImg+"\" style='width:35px;height:35px;'>"+
				"</a>"+
				"<div class=\"content\" style='margin-left: 40px; padding-left: 4px; padding-top: 2px; padding-right: 8px;'>"+
					"<a class=\"author\" style='font-weight:bold;color:#4C7A9F;font-size:12px;'>" + repliedByName + "</a>"+
					
					"<div class='metadata' style='display:"+replyToDisplay+";margin-left: 4px;font-size:12px;'><span class='date'>to</span></div>"+
					"<a class='to author' style='display:"+replyToDisplay+";font-weight:bold;color:#4C7A9F;font-size:12px;'>"+repliedToName+"</a>"+
					"<div class=\"text\" style='margin-bottom: 0px; margin-top: 0px;font-size:14px;'>"+
						commentContent+
					"</div>"+
					"<div class=\"actions\" style='display:inline;'>"+
			              "<a class=\"reply \" style='display:"+replyDisplay+";font-size:12px;'>回复</a>"+
			              "<a class=\"delete \" id='delete"+commentId+"' style='display:"+deleteDisplay+";font-size:12px;'>删除</a>"+  
		            "</div>"+
		            "<span class=\"date\" style='font-size:12px;padding-top: 2px;float:right;text-align:right;color:#999999;'>" + createDate + "</span>"+
				"</div>"+
			"</div>";
	return html;
}

