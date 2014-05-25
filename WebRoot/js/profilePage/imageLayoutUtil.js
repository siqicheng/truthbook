
function modifiedImageNum(num){
	numImage = Number($("#photos_num").html()) + num;
	$("#photos_num").html(numImage);
}


function prepareElement(data,isAppend,Control,Comment){
	var url = data.imageUrl,
		userId = data.user.userId,//this is different from the former version output
		description = data.content,
		uploaderName =  data.uploaderName,
		uploaderId = data.uploaderId,
		createDate = data.createDate,
		numOfComment = data.commentCnt,
		imageId = data.imageId,
		numLike = data.liked,
		descriptionDisplay = "",
		display = "inline";	
	
	if (numLike=="") numLike = "0";
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	var html = thisImageHTML(url,description,descriptionDisplay,uploaderName,
			uploaderId,createDate,numOfComment,display,imageId,numLike,userId);
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
		description = data.content,
		createDate = data.createDate,
		uploaderId = data.uploaderId,
		imageId = data.imageId,
		descriptionDisplay = "";
		
	description=="" ? descriptionDisplay = "none": descriptionDisplay ="block";
	
	var html = thisUnapprovedImageHTML(url,description,descriptionDisplay,createDate,imageId,uploaderId);
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
	$("#newPhotoBar").click(function(){
		hideNewImageButton();
		showReturnHomeButton();
		$("#neweventwrap").slideToggle("slow",function(){
			});	
		drawUnapproveImage(numUnapprovImage,unapprovImage);	
		
	});
	$("#newPhotoReturnBar").click(function(){
		hideReturnHomeButton();
		showNewImageButton(numUnapprovImage);
		$("#neweventwrap").slideToggle("slow");		
		$("#neweventsegment").masonry( 'destroy');
		$("#neweventsegment").html("");
	});
}





function showNewImageButton(numUnapprovImage){
	$("#newPhotoBar").show();
//	$("#newPhotoButton").removeClass(" hidden");
//	$("#newPhotoButton").addClass(" visible");
	$("#numOfUnapprovedImage").html(numUnapprovImage);
//	addFriendTransition("#newPhotoButton");
}

function hideNewImageButton(){
//	$("#newPhotoButton").removeClass(" visible ");
//	$("#newPhotoButton").addClass(" hidden ");
	$("#newPhotoBar").hide();
}

function showReturnHomeButton(){
//	$("#approvedPhotoButton").removeClass(" hidden");
//	$("#approvedPhotoButton").addClass(" visible");
//	addFriendTransition("#approvedPhotoButton");
	$("#newPhotoReturnBar").show();
}

function hideReturnHomeButton(){
//	$("#approvedPhotoButton").removeClass(" visible ");
//	$("#approvedPhotoButton").addClass(" hidden ");
	$("#newPhotoReturnBar").hide();
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
function newitemInitialize(id){
	$(id).masonry({		
		itemSelector: '.eventpile',
		gutter: 0});

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
			titleSrc: 'title',
			verticalFit: false
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

function dateHandle(createDate,defaultFlag){
//	Only valid for server side using UTC	
//	alert(translate_timezone("Fri May 23 20:37:39 +0000 2014",8,1));//2014年5月24日 04:37:39 星期六 当前时区：+0800	
//	createDate = "2014-05-24T00:20:36+08:00";
//	t=	["2014年5月24日", "8:20:36", "星期六", "当前时区：+0800"]
//	h=  ["8", "20", "36"]

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
		 
//	var defaultUploadDate = createDate.substring(0,createDate.indexOf("T"));
	var defaultDisplayDate = t[0]+" "+t[2];
	
	if(defaultFlag==true){
		return defaultDisplayDate;
	}
	
	if(year_upload != year_now || month_upload != month_now){
		return defaultDisplayDate;
	} else {
		var hour_now = date.getHours();
		var min_now = date.getMinutes();
		var second_now = date.getSeconds();
		
//		upload_day = createDate.substr(createDate.indexOf("T")-2,2);
//		upload_hour = createDate.substr(createDate.indexOf("T")+1,2);
//		upload_minute = createDate.substr(createDate.indexOf("T")+4,2);
//		upload_second = createDate.substr(createDate.indexOf("T")+7,2);
		
		if (day_now>day_upload){
			return (day_now - day_upload)+"天前";
		}
		if (hour_now>hour_upload){
			return (hour_now - hour_upload)+"小时前";
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




