
function setInitialPortrait(){
	var portraitUrl = $.cookie("truthbook_PageOwner_userId").defaultPortrait;
	portraitUrl = getImageUrl(portraitUrl,ImageType.Small);
	$("#portraitImage").attr("src",portraitUrl);
	$("#portraitImage").magnificPopup({
		items: {
				src:  getImageUrl($.cookie("truthbook").defaultPortrait,ImageType.Large)
		},
		type: 'image',
		image: {
			verticalFit: true
		}
	});


}


function setPortraitImageForThisPage(){
	var userId = $.cookie("truthbook").userId;
		
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			$.cookie("truthbook",data);
			var portraitUrl = data.defaultPortrait;
			portraitUrl = getImageUrl(portraitUrl,ImageType.Small);
			$("#portraitImage").attr("src",portraitUrl);
		}else{

		}
  		$("#portraitImage").magnificPopup({
			items: {
					src:  getImageUrl($.cookie("truthbook").defaultPortrait,ImageType.Large)
			},
			type: 'image',
			image: {
				verticalFit: true
			}
  		});
  	
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	getUserAPI(userId, onAjaxSuccess, onAjaxError);
}


