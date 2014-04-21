


function setPortraitImageForThisPage(){
	var userId = $.cookie("truthbook_PageOwner_userId").userId
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			var portraitUrl = data.image.imageUrl;
			$("#portraitImage").attr("src",portraitUrl);
		}else{
			$("#portraitImage").attr("src",DefaultPortrait);
		}
		
  		$("#portraitImage").magnificPopup({
			items: {
					src:  $("#portraitImage").attr("src")
			},
			type: 'image',
//			image: {
//				verticalFit: false
//			}
  		});
  	
	};
	var onAjaxError = function(xhr,status,error){
		$("#portraitImage").attr("src",DefaultPortrait);
		drawConfirmPopUp("获取头像请求发送失败 Error: " + error);
		return false;
	};
	getDefaultPortraitAPI(userId,onAjaxSuccess,onAjaxError)
}


