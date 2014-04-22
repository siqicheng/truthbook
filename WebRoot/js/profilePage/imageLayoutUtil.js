
function changeImageNum(){
	numImage = Number($("#photos_num").html()) + $.cookie("truthbook_Page_Image_Num");
	$("#photos_num").html(numImage);
}

function imageInOrder(numTotalImage,data){
	var imageIdinorder = [];
	for (var i = 0 ; i < numTotalImage;i++){
		imageIdinorder [i] = [];
		imageIdinorder [i][0] = data[i].imageId;
		imageIdinorder [i][1] = i;
	}
	imageIdinorder.sort(function(x,y){return (y[0]-x[0]);});
	return imageIdinorder;
}

function itemInitialize(){
	
	$('#eventsegment').masonry({		
		itemSelector: '.eventpile',
		gutter: 11});

	$('#eventsegment').imagesLoaded( function() {
		$('#eventsegment').masonry();
	});
		
	//buttons on images show on/off
	$("#eventsegment .eventpile .item .image").hover(function(){
		    $(this).children(".imgbtnArea").fadeIn("fast");
		    $(this).children("img").fadeTo("fast",0.9);
				},
				function(){
		    $(this).children(".imgbtnArea").fadeOut("fast");
		    $(this).children("img").fadeTo("fast",1);
			}
		);
	//遍历所有图片元素后为它们加上magnificPopup插件的初始化选项
	$("#eventsegment").find(".eventpile").slice(0, $.cookie("truthbook_Page_Image_Pointer")).find(".item .image").magnificPopup({
//				items: {
// 					src:  $($num_items[i]).attr("src")
//				},
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
