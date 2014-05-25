
function setInitialPortrait(){
	var portraitUrl = $.cookie("truthbook_PageOwner_userId").defaultPortrait;
	if($.cookie("truthbook_PageOwner_userId").isActivated == "false"){
		portraitSmall = DefaultQuotePortrait;
		portraitMedium = DefaultQuotePortrait;
	}else{
		portraitSmall = getImageUrl(portraitUrl,ImageType.Small);
		portraitMedium = getImageUrl(portraitUrl,ImageType.Large);
	}
	
	$("#portraitImage").attr("src",portraitSmall);
	$("#portraitLarge").attr("href",portraitMedium);
	$("#portraitLarge").magnificPopup({
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


function setPortraitImageForThisPage(){
	var userId = $.cookie("truthbook").userId;
		
	var onAjaxSuccess = function(data,textStatus){
		if (data != null ){
			$.cookie("truthbook",data);
			 $.cookie("truthbook_PageOwner_userId",data);//on own page
			var portraitUrl = data.defaultPortrait;
			portraitSmall = getImageUrl(portraitUrl,ImageType.Small);
			portraitMedium = getImageUrl(portraitUrl,ImageType.Large);
			
			$("#portraitImage").attr("src",portraitSmall);
			$("#portraitLarge").attr("href",portraitMedium);
			
		}else{

		}
		$("#portraitLarge").magnificPopup({
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
  	
	};
	var onAjaxError = function(xhr,status,error){
		drawConfirmPopUp("获取用户请求发送失败 Error: " + error);
		return false;
	};
	getUserAPI(userId, onAjaxSuccess, onAjaxError);
}


