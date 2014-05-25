function timelineToArray(data, numTotalFeed){
	var timelineData = new Array();
	if(!data.image.length) {
		timelineData.push(data.image);
	}
	else{
		var numData = data.image.length;
		for(var i=0; i < numData; i++){
			timelineData.push(data.image[i]);
		}
	}
	return timelineData;
}

function timelineInOrder(numTotalFeed,data){
	var timelineIdinorder = [];
	for (var i = 0 ; i < numTotalFeed;i++){
		timelineIdinorder [i] = [];
		timelineIdinorder [i][0] = data[i].imageId;
		timelineIdinorder [i][1] = i;
	}
	timelineIdinorder.sort(function(x,y){return (y[0]-x[0]);});
	var orderedData = new Array();
	for	(var i = 0 ; i < numTotalFeed;i++){
		orderedData.push(data[timelineIdinorder[i][1]]);
	}
	return orderedData;
}

function prepareFeed(data,isAppend,Comment){
//	console.log(data);
	var url = data.imageUrl,
		description = data.content,
		uploaderName =  data.uploaderName,
		uploaderId = data.uploaderId,
		createDate = data.createDate,
//		numOfComment = data.commentCnt,
		numOfComment = 0,
		imageId = data.imageId,
		numLike = data.liked,
		imageOwnerId = data.user.userId,
		imageOwnerName = data.user.fullName,
		imageOwnerPortrait = data.user.defaultPortrait,
		descriptionDisplay = "",
		display = "inline";	
	var	commentContent = "";
	imageOwnerPortrait = getImageUrl(imageOwnerPortrait,ImageType.Small);
//	if (numLike=="") numLike = "0";
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	var html = thistimelineItemHTML(url,description,uploaderName,
			uploaderId,createDate,numOfComment,imageId,imageOwnerId,imageOwnerName,
			imageOwnerPortrait,numLike);
	if (isAppend == true){
		$(".timelineWrapper").append(html);
	}else{
		$(".timelineWrapper").prepend(html);
	}
	
	timelineButtonHandler(imageId,Comment,imageOwnerId);
	if(Comment == COMMENT.Yes){
		getThisComment_Part_onTimeline(imageId,NUM_SHOW_COMMENT_ON_TIMELINE);//,numOfComment);
	} else {
//		strangerHandler(imageId);
	}
	
	var element = $("#timelineContainer").find("#itemId"+imageId);
	return element;
}

function timelineInitialize(id){
	$(id+" .timelineItem:first-child").addClass("timelineFirst");
	$(id).find(".timelineItem .timelineCenter .item .image").magnificPopup({
		type: 'image',
		image: {
			verticalFit: false
		},
		zoom:{
			enabled: true,
			duration: 500, // don't foget to change the duration also in CSS
			opener: function(element) {
				return element.find('img');
				}
		},		
	})
}