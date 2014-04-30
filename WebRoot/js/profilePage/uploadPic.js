$(function() {
	resetUpload();
//Initializations BEGIN

	/*照片预览旋转bug */
	$("#picInput").change(function(e) {
		var file = e.target.files[0],
			options = {
				canvas: true,
				minWidth: 287
			};
		loadImage.parseMetaData(file, function(data) {
			if(data.exif) {
				options.orientation = data.exif.get('Orientation');
			}
		});
		loadImage(file,
			function(img) {
				$("#imgPrev").html(img);
				$("#imgPrev canvas").addClass('ui image');
			},
			options
		);
	});
	
	/*upload sidebar效果初始化*/
	$('#upload')
		.sidebar({
			onShow: function(){
	//			selected_num=-1;
				$("#upload_menu").toggle();
				$("#close_sidebar_btn").slideDown();
				},
			onHide: function(){
	//			selected_bool = false;
				resetUpload();
				$("#upload_menu").slideDown();
				$("#close_sidebar_btn").toggle();
				}
			})
		.sidebar('attach events', '#close_sidebar_btn', 'hide')
		.sidebar('attach events', '.open_popup_link', 'hide');
	
	/*新建词条按钮初始化*/
	$("#upload_for_new_btn").click(function(){
		showSidebar();
	});
	
	/*  选人表单验证规则&初始化  */
	$("#choosePeople").form({
		username:{
			identifier : "fullName",
			rules:[{
				type: "empty",
				prompt: "请输入对方姓名"
			}]
		},
		school:{
			identifier: "school",
			rules:[{
				type: "empty",
				prompt: "请输入对方学校"
			}]
		},
		entryTime:{
			identifier: "entryTime",
			rules:[{
				type: "empty",
				prompt: "哪年入的校呢？"
			},
			{
				type: "isYear",
				prompt: "请输入正确的入学年份"
			},
			{
				type: "earlyYear[1976]",
				prompt: "这个年份略早了吧？"
			},
			{
				type: "lateYear[2015]",
				prompt: "这个年份略迟了吧？"
			}]
		}
	},
	{
		on: "submit"
	});

	/*选人表单回车提交验证*/
	$("#choosePeople")
	.submit(function() {
		var isValidForm = $("#choosePeople").form(" form");
		if(isValidForm) {
			nextstep1Function();
		};
		return false;
	});

	/*upload step按钮(选人、选图）功能定义*/
	$("#step1").click(function() {
		gotoChoosePeople();
	});
	$("#step2").click(function() {
		if($("#step2").attr("class") != "ui disabled step") {
			gotoChoosePic();
		}
	});

	/*选择图片fileupload插件初始化*/
	$("#picInput").fileupload(
		{
			url: "upload",
			dataType: "json",
			add: function(e, data) {
				picData = data;
			},
			done: function(e, data) {
				gotoComplete();
			},
			progressall: function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$("#uploadProgress .bar").css(
					"width",
					progress + "%"
				);
			},
			start: function (e) {
			    console.log('Uploads started');
			},
			stop: function (e) {
			    console.log('Uploads finished');
			},
			submit: function(e, data) {
				$("#choosePic .two.buttons").hide();
				$("#uploadProgress").show();
			},
			fail: function(e, data) {
				console.log(data.textStatus);
				console.log(data.errorThrown);
			},
			disableImageMetaDataSave: true,
			imageOrientation: true,
			previewOrientation: 0
		}
	);

	/*完成按钮初始化*/
	$("#complete .black.button").click(function() {
		$.magnificPopup.close();
		$(".sidebar").sidebar("hide");
	});
//initializations END


	/*选人form下一步功能定义*/
	$("#nextstep1").click(function() {
		nextstep1Function();
	});
	

	/*重选词条按钮：以上都不是*/
	$("#nextstep2_for_new_quote").click(function() {
		picReceiver = NEW_QUOTE;
		gotoChoosePic();
	});
	

	/*重选词条按钮：下一步*/
	$("#nextstep2").click(function() {
		if(picReceiver != null) {
			if(picReceiver.isActivated == "false"){
				gotoChoosePic();
				return;
			};
			if(picReceiver.userId == $.cookie("truthbook").userId) {
				drawConfirmPopUp("不能为自己传照片哦");
				return;
			}
			var userId = $.cookie("truthbook").userId,
				onSuccess = function(data, textStatus) {
					if(data>0) {
						gotoChoosePic();
					} else {
						var header = "你和他/她还不是好友",
							content = "加为好友之前无法为他/她上传照片，是否加为好友",
							negativeBtn = "取消",
							negativeBtnHidden = "不能为他/她上传照片",
							positiveBtn = "发送好友申请",
							positiveBtnHidden = "等待通过后再传照片",
							approveFunction = function() {
								friendRequestSend(picReceiver);
								$("#testModal").modal("hide");
							},
							denyFunction = function() {
								$("#testModal").modal("hide");
							};
						testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, positiveBtnHidden, approveFunction, denyFunction);
					}
				},
				onError = function(xhr, status, error) {
					console.log("Check friend relationship failed with error: " + error);
				};
				checkFriendRelationship(picReceiver.userId, userId, onSuccess, onError);
		} else {
			$("#rechooseError").show();
		}
	});
	
	/*确认上传按钮*/
	$("#submitBtn").click(function() {
		if($("#imgPrev img").attr("src") == DefaultPreviewImg) {
			drawConfirmPopUp("请选择要上传的图片");
			return;
		};
		if($("#picDescription").val().length>200) {
			drawConfirmPopUp("图片描述超出字数限制");
			return;
		};
		if(picReceiver == NEW_QUOTE) {
			var data = $("#choosePeople").serialize(),
				onSuccess = function(data, textStatus) {
					picReceiver = data;
					var userId = $.cookie("truthbook").userId,
						onSuccess = function() {
							completeMessage("新建词条完成！", "赶快去通知好友来玩吧！");
							uploadPic();
							refreshTopbarFriendsLists($.cookie("truthbook").userId);
							refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
							console.log("Add friend success");
						};
					addFriendAPI(data.userId, userId, type_nFriends, "true");
					addFriendAPI(userId, data.userId, type_nFriends, "false", onSuccess);
				},
				onError = function(xhr, status, error) {
					console.log("Register new quote failed with error: " + error);
					return false;
				};
			registerNewQuote(data, onSuccess, onError);
		} else if(picReceiver.isActivated == "false") {
			console.log("Upload pic for " + picReceiver);
			var userId = $.cookie("truthbook").userId,
				onSuccess = function(data, textStatus) {
					completeMessage("为已有词条上传照片完成！", "这个人太懒了，赶快去叫他/她来玩！");
					if(data>0) {;
						uploadPic();
					} else {
						var userId = $.cookie("truthbook").userId,
							onSuccess = function(data, textStatus) {
								refreshTopbarFriendsLists($.cookie("truthbook").userId);
								refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
								uploadPic();
							};
						addFriendAPI(picReceiver.userId, userId, type_nFriends, "true");
						addFriendAPI(userId, picReceiver.userId, type_nFriends, "false", onSuccess);
					}
				},
				onError = function(xhr, status, error) {
					console.log("Check friend relationship failed with error: " + error);
				};
			checkFriendRelationship(picReceiver.userId, userId, onSuccess, onError);
		} else {
			console.log("upload pic for " + picReceiver);
			completeMessage("为好友上传完成！", "赶快去通知好友来看吧！");
			var userId = $.cookie("truthbook").userId;
			uploadPic();
		};
	});

	/*选人到选图片*/
	function nextstep1Function() {
		var isValidForm = $("#choosePeople").form("validate form");
		if($("#choosePeople .message").html() != "") {
			$("#choosePeople .message").show();
		};
		if(picReceiver != null) {
			gotoChoosePic();
			return;
		};
		if(isValidForm == true) {
			var user = $("#fullName").val();
//			$("#previewMessage").html("你将传给<b>"+user+"</b>的照片如下：");
			var data = $("#choosePeople").serialize();
			console.log("choose people form data : " + data);
	//		Verify user quote: (fullName,school,entryTime) exist
			var onSuccess = function(data,textStatus) {
				console.log("Verify people exists : " + data);
				var len =userLengthJson(data);
				if(len >= 1) {
					console.log("find one or more candidates");
					var rechooseMessage, html;
					uploadCandidates = new Array();	//存在用户的候选数组
					if(len>1){
						rechooseMessage = "我们找到了好多<b>"+user+"</b>：";
					} else {
						if(data.user.userId == $.cookie("truthbook").userId) {
							drawConfirmPopUp("不能为自己传照片哦");
							return;
						}
						rechooseMessage = "我们找到了一个<b>"+user+"</b>：";
					}
					html = "";
					for(var i=0;i<len;i++){
						if(len>1){
							uploadCandidates[i]=data.user[i];
						} else {
							uploadCandidates[i]=data.user;
						}
						var content = "uploaded by: ";
						var portrait = DefaultPortrait;
						if(uploadCandidates[i].isActivated == "false"){
							portrait = DefaultQuotePortrait; //TODO: 改成词条专用头像src
							
							onSuccess = function(data, textStatus) {
								var num = userLengthJson(data);
								if(num>1) {
									for(var i=0; i<3; i++) {
										if(data.user[i] == undefined){
											break;
										};
										content += data.user[i].fullName + "     ";
									}
								} else {
									content += data.user.fullName;
								}
							};
							onError = function(xhr, error, status) {
								console.log("Get uploader name failed with error: " + error);
							};
							getFriendsSync(uploadCandidates[i].userId, 1, onSuccess, onError);
						} else {
							if(uploadCandidates[i].defaultPortrait != undefined) {
								portrait = getImageUrl(uploadCandidates[i].defaultPortrait, ImageType.Small);
							};
							content = uploadCandidates[i].school + " " + uploadCandidates[i].entryTime;
						};
						html = html + "<div class=\"ui item segment rechooseitem\">" +
									"<a class=\"ui corner green label\" style=\"display:none\">" +
									"<i class=\"checkmark small icon\"></i> </a>" +
		 							"<img class=\"ui avatar image\" src=" + portrait +">" + 
		 							"<div class=\"content\">" +
		  							"<div class=\"header\">" + uploadCandidates[i]["fullName"] + "</div>" + content +
		  							"</div></div>";
					}
//					html = html + "</div>";
					$("#rechooseMessage").html(rechooseMessage);
					$("#rechooselist").html(html);
					$(".ui.item.rechooseitem").click(function(){
						$(this).siblings().children(".label").hide();
						$(this).children(".label").show();
						var selected_num=$(this).index();
						var portrait;
						if(uploadCandidates[selected_num].defaultPortrait != undefined) {
							portrait = uploadCandidates[selected_num].defaultPortrait;
							var mediumPortrait = getImageUrl(portrait, ImageType.Medium);
							$("#peoplePrev").attr('src', mediumPortrait);
						} else {
							if(uploadCandidates[selected_num].isActivated == "false") {
								portrait = DefaultQuotePortrait;
							} else {
								portrait = DefaultPortrait;
							}
							$("#peoplePrev").attr('src', portrait);
						}
						picReceiver = uploadCandidates[selected_num];
						console.log("User choosed picReceiver: ");
						console.log(picReceiver);
						$("#rechooseError").hide();
					});
					gotoRechoose();
				} else if(len == -1) {
					picReceiver = NEW_QUOTE;
					gotoChoosePic();
				};
			};
			var onError = function(xhr,status,error){
				console.log("Verify receiver failed with error:" + error);
				return false;
			};
			verifyUserExists(data, onSuccess, onError);
		};
	}
});


/*直接为好友上传function*/
function upload_choosepic(people) {
	picReceiver = people;
	upload_for_friend = true;
	$("#fullName").val(people["fullName"]);
	$("#school").val(people["school"]);
	$("#entryTime").val(people["entryTime"]);
	$("#fullName").attr("disabled", "disabled");
	$("#school").attr("disabled", "disabled");
	$("#entryTime").attr("disabled", "disabled");
//	$("#previewMessage").html("你将传给<b>"+people.fullName+"</b>的照片如下：");
	gotoChoosePic();
	showSidebar();
}

/*完成时显示的消息控制*/
function completeMessage(header, content) {
	$("#complete .header").html(header);
	$("#complete p").html(content);
	
}

/*图片上传*/
function uploadPic() {
	var userId=$.cookie("truthbook").userId;
	picData.formData = [
	                  {
	                      name: 'userid',
	                      value: userId
	                  },
	                  {
	                      name: 'receiverid',
	                      value: picReceiver.userId
	                  },
	                  {
	                	  name: 'description',
	                	  value: $("#picDescription").val()
	                  }
	              ];
	picData.submit();
}

/*Help functions*/

/*重置upload*/
function resetUpload() {
	picReceiver = null;
	picData = undefined;
	upload_for_friend = false;
	gotoChoosePeople();
	$("#fullName").val("");
	$("#school").val("");
	$("#entryTime").val("");
	$("#imgPrev").html('<img class="ui image" src="' + DefaultPreviewImg +'"/>');
	$("#uploadProgress .bar").css("width", "0%");
	$("#fullName").removeAttr("disabled");
	$("#school").removeAttr("disabled");
	$("#entryTime").removeAttr("disabled");
}

/*step之间的跳转*/
function gotoChoosePeople() {
	if(! upload_for_friend) {picReceiver = null;};
	$(".ui.step").attr("class", "ui disabled step");
	$(".ui.step").css("cursor", "default");
	$("#step1").attr("class", "ui active step");
	$("#step1").css("cursor", "pointer");
	$(".ui.form.uploadForm").hide();
	$("#choosePeople .message").hide();
	$("#choosePeople .field").removeClass("error");
	$("#choosePeople").show();
};
function gotoRechoose() {
	$(".ui.step").attr("class", "ui disabled step");
	$("#step1").attr("class", "ui active step");
	$("#peoplePrev").attr('src', DefaultPortrait); //TODO: 改成默认重选提示图片
	$(".ui.form.uploadForm").hide();
	$("#rechoosePeople").show();
}
function gotoChoosePic() {
	$("#choosePic .item .meta").html("By "+$.cookie("truthbook").fullName);
	$(".ui.form.uploadForm").hide();
	$("#choosePic").show();
	$("#imgPrev").html('<img class="ui image" src="' + DefaultPreviewImg +'"/>');
	$("#uploadProgress .bar").css("width", "0%");
	$('#picDescription').val("");
	$("#choosePic .two.buttons").show();
	$("#uploadProgress").hide();
	$("#step1").attr("class", "ui step");
	$("#step2").attr("class", "ui active step");
	$("#step3").attr("class", "ui disabled step");
	$(".ui.step").css("cursor", "pointer");
	$("#step3").css("cursor", "default");
}
function gotoComplete() {
	$(".ui.form.uploadForm").hide();
	$("#complete").show();
	$(".ui.step").attr("class", "ui step");
	$("#step3").attr("class", "ui active step");
	$(".ui.step").css("cursor", "pointer");
}
