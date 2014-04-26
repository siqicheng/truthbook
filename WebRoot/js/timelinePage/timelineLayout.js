/*********************************************************************************
 * 	The whole HTML part to draw
 */
function thistimelineItemHTML(url,discription,uploaderName,uploaderId,createDate,numOfComment,display,imageId,imageOwnerId,imageOwnerName,numLike){
	
	displayDate = dateHandle(createDate);
	userId = $.cookie("truthbook").userId;
	numOfCommentShow = numOfComment - 2;

	html = 	"<div class='timelineItem'>\n" +
			"\t<div class='timelineSider'>\n" +
			"\t\t<div class='timelineBookmark'>\n" +
			"\t\t\t<div class='timelineBookmarkInfo'>\n" +
			"\t\t\t\t<a href='"+imageId+"' class='timelineBookmarkInfoUsername'>"+imageOwnerName+"</a>\n" +
			"\t\t\t\t<span class='timelineBookmarkInfoTimestamp'>"+createDate+"</span>\n" +
			"\t\t\t</div>\n" +
			"\t\t\t<div class='timelineBookmarkAvatar'>\n" +
			"\t\t\t\t<img class='ui avatar image' src='"+DefaultImg+"'>\n" +
			"\t\t\t</div>\n" +
			"\t\t</div>\n" +
			"\t</div>\n" +
			"\t<div class='timelineCenter'>\n" +
			"\t\t<div class='ui items'>\n" +
			"\t\t\t<div class='item'>\n" +
			"\t\t\t\t<a class='image' href='"+url+"'>\n" +
			"\t\t\t\t\t<img src='"+url+"'>\n" +
			"\t\t\t\t\t<div class='imgbtnArea'>\n" +
			"\t\t\t\t\t\t<div class='ui tiny button likebtn'><i class='heart tiny icon'></i></div>\n" +
			"\t\t\t\t\t</div>\n" +
			"\t\t\t\t</a>\n" +
			"\t\t\t\t<div class = 'discript content'>\n" +
		    "\t\t\t\t\t<p class='description'>"+description+"</p>\n" +
		    "\t\t\t\t\t<div class='meta'>\n" +
		    "\t\t\t\t\t\t<a class='uploaderName'>By"+uploaderName+"</a>\n" +
		    "\t\t\t\t\t\t<span class='uploaderId' style='display:none;'>"+uploaderId+"</span>\n" +
		    "\t\t\t\t\t</div>\n" +
		    "\t\t\t\t</div>\n"+
		    "\t\t\t\t<div class='ui minimal comments'>\n"+
			"\t\t\t\t\t<div class='commentwrap'>\n"+
			"\t\t\t\t\t\t<div class='comment loadAllComments'>\n"+
			"\t\t\t\t\t\t\t<div class='content'>\n"+
			"\t\t\t\t\t\t\t\t<div class='text'>显示剩余"+numOfCommentShow+"条评论</div>\n"+
			"\t\t\t\t\t\t\t</div>\n"+
			"\t\t\t\t\t\t</div>\n"+
			    	// 			<div class="comment" id="commentId1">
								// 	<a class="avatar tiny" href="">
								// 		<img src="img/logo.ico">
								// 	</a>
								// 	<div class="content">
								// 		<a class="author">repliedByName</a>
								// 		<div class='metadata' style='display:inline;'><span>to</span></div>
								// 		<a class='to author' style='display:inline;'>repliedToName</a>
								// 		<div class="text">
								// 			我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。我卖的是一百字的心灵鸡汤。。我卖的是一百字的心灵鸡汤。我卖的是一百字
								// 		</div>
								// 		<div class="actions" style='display:inline;'>
								//         	<a class="reply" style='display:inline;'>回复</a>
								//         	<a class="delete" id='delete1' style='display:inline;'>删除</a>
							 //         </div>
							 //            <span class="date">1天前</span>
								// 	</div>
							// </div>
			"\t\t\t\t\t</div>\n" +
			"\t\t\t\t</div>\n" +
			"\t\t\t\t<div class='ui reply form'>\n"+
		    "\t\t\t\t\t<div class='field' >\n"+
		    "\t\t\t\t\t\t<textarea class='textarea' placeholder='你想说…' wrap='off' rows='1'></textarea>\n"+
		    "\t\t\t\t\t</div>\n"+
		    "\t\t\t\t\t<span class = 'replyToId' style='display:none;'></span>\n"+
		    "\t\t\t\t\t<span class = 'replyToName' style='display:none;'></span>\n"+
		    "\t\t\t\t\t<button class='ui fluid labeled icon teal commentSubmit button'><i class='icon edit'></i>添加评论</button>\n"+
		    "\t\t\t\t</div>\n"+
		    "\t\t\t\t<div class='extra'>\n"+
		    "\t\t\t\t\t<span class='numLikeSpan'>"+numLike+"</span><span>个赞</span>\n"+
		    "\t\t\t\t</div>\n"+		    		
			"\t\t\t</div>\n"+
			"\t\t</div>\n"+
			"\t</div>\n"+			
			"</div>\n"
	return html;
}

function thisCommentHTML(commentId,commentContent,repliedByCommentId,repliedByName,repliedByProtrait,repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay){	
	html = 	"<div class='comment' id='commentId"+commentId+"'>\n"+
			"\t<span class = 'repliedByCommentId_span' style='display:none;'>"+repliedByCommentId+"</span>\n"+
			"\t<span class = 'repliedByName_span' style='display:none;'>"+repliedByName+"</span>\n"+
			"\t<span class = 'repliedToCommentId_span' style='display:none;'>"+repliedToCommentId+"</span>\n"+
			"\t<span class = 'commentId_span' style='display:none;'>"+commentId+"</span>\n"+
			"\t<a class='avatar tiny'>\n"+
			"\t\t<img src='"+DefaultImg+"'>\n"+
			"\t</a>\n"+
			"\t<div class='content'>\n"+
			"\t\t<a class='author'>" + repliedByName + "</a>\n"+					
			"\t\t<div class='metadata' style='display:"+replyToDisplay+"'><span>to</span></div>\n"+
			"\t\t<a class='to author' style='display:"+replyToDisplay+"'>"+repliedToName+"</a>\n"+
			"\t\t<div class='text'>\n"+
					commentContent+"\n"+
			"\t\t</div>\n"+
			"\t\t<div class='actions' style='display:inline;'>\n"+
			"\t\t\t<a class='reply' style='display:"+replyDisplay+"'>回复</a>\n"+
			"\t\t\t<a class='delete' id='delete"+commentId+"' style='display:"+deleteDisplay+"'>删除</a>\n"+  
		    "\t\t</div>\n"+
		    "\t\t<span class='date'>" + createDate + "</span>\n"+
			"\t</div>\n"+
			"</div>\n";
	return html;
}