$(function(){
	getAllTimeline($.cookie("truthbook").userId);
	loadMoreButtonHandler();
	scrollToTopButtonHandler();
});

function getAllTimeline(userId) {
	var onAjaxSuccess = function (data, textStatus){
		if (data){
			var allTimelineData = timelineToArray(data);
			numTimelineItem = allTimelineData.length;
			allTimelineItem = timelineInOrder(numTimelineItem, allTimelineData);
//			allTimelineItem = allTimelineData;
			// Get ordered timeline item Array
			if(numTimelineItem != 0){
				drawNextBatchFeed(numTimelineItem, NUM_FIRST_BATCH_ITEM_ON_TIMELINE, allTimelineItem);
				return true;
			}
			else{
//				disableShowMoreButton();
				return true;			
			}
		}
		else {
			$(".timelineContainer").html("<div style='text-align:center;margin-top:30%'>"+ 
					NO_TIMELINE_ITEM + "</div>\n");
		}
	};
	var onAjaxError = function(xhr, status, error){
		if(isDebug) drawConfirmPopup("获取新鲜事请求发送失败 Error: "+ error);
		return false;
	};
	getAllTimelineByUserIdAPI(userId, onAjaxSuccess, onAjaxError);
}

function drawNextBatchFeed(numTimelineItem,numToShow,imageData){
	$.cookie("truthbook_Timeline_Item_Pointer", numToShow);
	var numToDraw = returnSmaller(numToShow, numTimelineItem);
	for(var i=0; i<numToDraw; i++){
		prepareFeed(imageData[i],true,COMMENT.Yes);
	}
//	if (numTimelineItem <= numToShow) disableShowMoreButton();
	timelineInitialize(".timelineWrapper");
}



/*********************************************************************************
 * 	The whole HTML part to draw
 */
function thistimelineItemHTML(url,description,uploaderName,uploaderId,createDate,numOfComment,imageId,imageOwnerId,imageOwnerName,imageOwnerPortrait,numLike){
	
	var displayDate = commentDateHandle(createDate);
//	var userId = $.cookie("truthbook").userId;
	var numOfCommentShow = numOfComment;// - NUM_SHOW_COMMENT_ON_TIMELINE;
	var urlLarge = getImageUrl(url,ImageType.Large);
	var urlMedium = getImageUrl(url,ImageType.Medium);
	html = 	"<div class='timelineItem' id = 'itemId"+imageId+"'>\n" +
			"\t<span class = 'imageId_span' style='display:none;'>"+imageId+"</span>\n"+
			"\t<span class = 'url_span' style='display:none;'>"+url+"</span>\n"+
			"\t<span class = 'imageOwnerId_span' style='display:none;'>"+imageOwnerId+"</span>\n"+
			"\t<div class='timelineSider'>\n" +
			"\t\t<div class='timelineBookmark'>\n" +
			"\t\t\t<div class='timelineBookmarkInfo'>\n" +
			"\t\t\t\t<a class='timelineBookmarkInfoUsername'>"+imageOwnerName+"</a>\n" +
			"\t\t\t\t<span class='timelineBookmarkInfoTimestamp'>"+displayDate+"</span>\n" +
			"\t\t\t</div>\n" +
			"\t\t\t<div class='timelineBookmarkAvatar'>\n" +
			"\t\t\t\t<img class='ui avatar image' src='"+imageOwnerPortrait+"'>\n" +
			"\t\t\t</div>\n" +
			"\t\t</div>\n" +
			"\t</div>\n" +
			"\t<div class='timelineCenter'>\n" +
			"\t\t<div class='ui items'>\n" +
			"\t\t\t<div class='item'>\n" +
			"\t\t\t\t<a class='image' href='"+urlLarge+"' title='"+description+"'>\n" +
			"\t\t\t\t\t<img src='"+urlMedium+"'>\n" +
			"\t\t\t\t\t<div class='imgbtnArea'>\n" +
			"\t\t\t\t\t\t<div class='ui tiny button likebtn'><i class='heart tiny icon'></i></div>\n" +
			"\t\t\t\t\t</div>\n" +
			"\t\t\t\t</a>\n" +
			"\t\t\t\t<div class = 'discript content'>\n" +
		    "\t\t\t\t\t<p class='description'>"+description+"</p>\n" +
		    "\t\t\t\t\t<div class='meta'>\n" +
		    "\t\t\t\t\t\t<a class='uploaderName'>By "+uploaderName+"</a>\n" +
		    "\t\t\t\t\t\t<span class='uploaderId' style='display:none;'>"+uploaderId+"</span>\n" +
		    "\t\t\t\t\t</div>\n" +
		    "\t\t\t\t</div>\n"+
		    "\t\t\t\t<div class='ui minimal comments'>\n"+
			"\t\t\t\t\t<div class='commentwrap'>\n"+
			"\t\t\t\t\t\t<div class='comment loadAllComments'>\n"+
			"\t\t\t\t\t\t\t<div class='content'>\n"+
			"\t\t\t\t\t\t\t\t<div class='text'>显示剩余<span class='numToShow'>"+numOfCommentShow+"</span>条评论</div>\n"+
			"\t\t\t\t\t\t\t</div>\n"+
			"\t\t\t\t\t\t</div>\n"+
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

function thistimelineCommentHTML(commentId,commentContent,repliedByCommentId,repliedByName,repliedByProtrait,repliedToCommentId,repliedToName,createDate,replyToDisplay,replyDisplay,deleteDisplay){	
	var displayDate = commentDateHandle(createDate);
	html = 	"<div class='comment newcomment' id='commentId"+commentId+"'>\n"+
			"\t<span class = 'repliedByCommentId_span' style='display:none;'>"+repliedByCommentId+"</span>\n"+
			"\t<span class = 'repliedByName_span' style='display:none;'>"+repliedByName+"</span>\n"+
			"\t<span class = 'repliedToCommentId_span' style='display:none;'>"+repliedToCommentId+"</span>\n"+
			"\t<span class = 'commentId_span' style='display:none;'>"+commentId+"</span>\n"+
			"\t<a class='avatar tiny'>\n"+
			"\t\t<img src='"+repliedByProtrait+"'>\n"+
			"\t</a>\n"+
			"\t<div class='content'>\n"+
			"\t\t<a class='author firstAuthor'>" + repliedByName + "</a>\n"+					
			"\t\t<div class='metadata' style='display:"+replyToDisplay+"'><span>to</span></div>\n"+
			"\t\t<a class='to author' style='display:"+replyToDisplay+"'>"+repliedToName+"</a>\n"+
			"\t\t<div class='text'>\n"+
					commentContent+"\n"+
			"\t\t</div>\n"+
			"\t\t<div class='actions' style='display:inline;'>\n"+
			"\t\t\t<a class='reply' style='display:"+replyDisplay+"'>回复</a>\n"+
			"\t\t\t<a class='delete' id='delete"+commentId+"' style='display:"+deleteDisplay+"'>删除</a>\n"+  
		    "\t\t</div>\n"+
		    "\t\t<span class='date'>" + displayDate + "</span>\n"+
			"\t</div>\n"+
			"</div>\n";
	return html;
}