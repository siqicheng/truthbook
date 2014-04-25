

function prepareElement(data,isAppend,Control,Comment){
	var url = data.imageUrl;
		description = data.description,
		uploaderName =  data.uploaderName,
		uploaderId = data.uploaderId,
		createDate = data.createDate,
		numOfComment = data.commentCnt,
		imageId = data.imageId,
		numLike = data.like,
		descriptionDisplay = "",
		display = "inline";	
	
	if (numLike=="") numLike = "0";
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	var html = thisImageHTML(url,description,descriptionDisplay,uploaderName,
			uploaderId,createDate,numOfComment,display,imageId,numLike);
	if (isAppend == true){
		$("#eventsegment").append(html);
	}else{
		$("#eventsegment").prepend(html);
	}
	
	addImageButtonHandler(imageId,Control,Comment);
	if(Comment == COMMENT.Yes){
		getThisComment_All(imageId,Control);
	} else {
		strangerHandler(imageId);
	}
	
	var element = $("#eventsegment").find("#imageId"+imageId);
	return element;
}

function prepareUnapprovedElement(data,isAppend){
	var url = data.imageUrl;
		description = data.description,
		createDate = data.createDate,
		imageId = data.imageId,
		descriptionDisplay = "";
		
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	var html = thisUnapprovedImageHTML(url,description,descriptionDisplay,createDate,imageId);
	if (isAppend == true){
		$("#neweventsegment").append(html);
	}else{
		$("#neweventsegment").prepend(html);
	}
	
	addUnapprovedImageButtonHandler(imageId);
	
	var element = $("#neweventsegment").find("#un_imageId"+imageId);
	return element;
}


/*********************************************************************************	
 *	Handle new buttons
 */

function handleNewImageButton(){
	showNewImageButton(numUnapprovImage);
	$("#newPhotoButton").click(function(){
		hideNewImageButton();
		showReturnHomeButton();
		$("#neweventwrap").slideToggle("slow",function(){
		});	
		drawUnapproveImage(numUnapprovImage,unapprovImage);
		
	});
	$("#approvedPhotoButton").click(function(){
		hideReturnHomeButton();
		showNewImageButton(numUnapprovImage);
		$("#neweventwrap").slideToggle("slow");
		
		$("#neweventsegment").masonry( 'destroy');
		$("#neweventsegment").html("");
	});
}





function showNewImageButton(numUnapprovImage){
	$("#newPhotoButton").removeClass(" hidden");
	$("#newPhotoButton").addClass(" visible");
	$("#numOfUnapprovedImage").html(numUnapprovImage);
	addFriendTransition("#newPhotoButton");
}

function hideNewImageButton(){
	$("#newPhotoButton").removeClass(" visible ");
	$("#newPhotoButton").addClass(" hidden ");
}

function showReturnHomeButton(){
	$("#approvedPhotoButton").removeClass(" hidden");
	$("#approvedPhotoButton").addClass(" visible");
	addFriendTransition("#approvedPhotoButton");	
}

function hideReturnHomeButton(){
	$("#approvedPhotoButton").removeClass(" visible ");
	$("#approvedPhotoButton").addClass(" hidden ");
}



function imageInOrder(numTotalImage,data){
	var imageIdinorder = [];
	for (var i = 0 ; i < numTotalImage;i++){
		imageIdinorder [i] = [];
		imageIdinorder [i][0] = data[i].imageId;
		imageIdinorder [i][1] = i;
	}
	imageIdinorder.sort(function(x,y){return (y[0]-x[0]);});
	var orderedData = new Array();
	for	(var i = 0 ; i < numTotalImage;i++){
		orderedData.push(data[imageIdinorder[i][1]]);
	}
	return orderedData;
}

function itemInitialize(id){
	$(id).masonry({		
		itemSelector: '.eventpile',
		gutter: 11});

	$(id).imagesLoaded( function() {
		$(id).masonry();
	});
	
	addGallery(id);
}

function addGallery(id){
	$(id).find(".eventpile .item .image").magnificPopup({
		gallery:{
			enabled:true,
			preload:[0,2],
		},
		type: 'image',
		image: {
			verticalFit: true
		},
		zoom:{
			enabled: true,
			duration: 500, // don't foget to change the duration also in CSS
			opener: function(element) {
				return element.find('img');
				}
		},
}); 
}

function dateHandle(createDate){
	date = new Date();
	day = date.getDate();
	month = Number(date.getMonth()+1);if (month < 10) month="0"+Number(date.getMonth()+1);
	year = date.getFullYear();
	
	today = year+"-"+month; 
	uploadDate = createDate.substr(0,createDate.indexOf(" ")-3);
	defaultUploadDate = createDate.substr(0,createDate.indexOf(" "));
	defaultDisplayDate = defaultUploadDate.substr(0,4)+"年"+defaultUploadDate.substr(5,2)+"月"+defaultUploadDate.substr(8,2)+"日";
	if(uploadDate != today){	
		return defaultDisplayDate;
	} else {
		hour = date.getHours();
		minute = date.getMinutes();
		second = date.getSeconds();
		
		upload_day = createDate.substr(createDate.indexOf(" ")-2,2);
		upload_hour = createDate.substr(createDate.indexOf(" ")+1,2);
		upload_minute = createDate.substr(createDate.indexOf(" ")+4,2);
		upload_second = createDate.substr(createDate.indexOf(" ")+7,2);

		if (day>upload_day){
//			return defaultDisplayDate;
			return (day - upload_day)+"天前";
		}
		if (hour>upload_hour){
			return (hour - upload_hour)+"小时前";
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

function returnSmaller(one,two){
	if (one > two){
		return  two;
	} else {
		return  one;
	}
}

