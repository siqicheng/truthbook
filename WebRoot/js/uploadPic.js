$(function() {
	/*选人表单验证规则*/
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
		} else {
			return false;
		}
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

	/*upload 下一步功能定义*/
	$("#nextstep1").click(function() {
		nextstep1Function();
	});

	$("#nextstep2").click(function() {
		if(picReceiver == NEW_QUOTE) {
			gotoChoosePic();
			return;
		};
		if(picReceiver != null) {
			if(picReceiver.isActivated == "false"){
				gotoChoosePic();
				return;
			};
			var userId = $.cookie("truthbook").userId,
				onSuccess = function(data, textStatus) {
					if(data>0) {
						gotoChoosePic();
					} else {
						header = "你和他/她还不是好友",
						content = "加为好友之前无法为他/她上传照片，是否加为好友",
						negativeBtn = "取消",
						positiveBtn = "发送好友申请";
						approveFunction = function() {
							//发送好友申请
							alert("已发送好友申请");
							$("testModal").modal("hide");
						},
						denyFunction = function() {
							$("testModal").modal("hide");
						};
						testModalPopup(header, content, negativeBtn, positiveBtn, approveFunction, denyFunction);
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

	$("#nextstep3").click(function() {
		/*uploading picture unfinished*/
		gotoConfirm();
	});

	$("#submitBtn").click(function() {
		if(picReceiver == NEW_QUOTE) {
			var data = $("#choosePeople").serialize(),
				onSuccess = function(data, textStatus) {
					var userId = $.cookie("truthbook").userId,
						onSuccess = function() {
							drawConfirmPopUp("新建词条完成！赶快去通知好友来玩吧！");
							freshFriendsLists(userId);
							console.log("Add friend success");
						};
					addFriendAPI(data.userId, userId, type_nFriends, "true");
					addFriendAPI(userId, data.userId, type_nFriends, "false", onSuccess);
					//上传照片
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
					if(data>0) {
						//上传照片
						drawConfirmPopUp("为已有词条上传照片完成！这个人太懒了，赶快去叫他/她来玩！");
					} else {
						var userId = $.cookie("truthbook").userId,
							onSuccess = function(data, textStatus) {
								//上传照片
								drawConfirmPopUp("为已有词条上传照片完成！这个人太懒了，赶快去叫他/她来玩！");
							};
						addFriendAPI(picReceiver.userId, userId, type_nFriends);
						addFriendAPI(userId, picReceiver.userId, type_nFriends, onSuccess);
					}
				},
				onError = function(xhr, status, error) {
					console.log("Check friend relationship failed with error: " + error);
				};
			checkFriendRelationship(picReceiver.userId, userId, onSuccess, onError);
		} else {
			console.log("upload pic for " + picReceiver);
			var userId = $.cookie("truthbook").userId;
			//上传照片
		};
		$.magnificPopup.close();
		$(".sidebar").sidebar("hide");
		resetUpload();
	});

	function nextstep1Function() {
		var isValidForm = $("#choosePeople").form("validate form");
		if(picReceiver != null) {
			gotoChoosePic();
			return;
		};
		if(isValidForm == true) {
			var user = $("#fullName").val();
			$("#previewmessage").html("你将传给<b>"+user+"</b>的照片如下：");
			var data = $("#choosePeople").serialize();
			console.log("choose people form data : " + data);
	//		Verify user quote: (fullName,school,entryTime) exist
			var onSuccess = function(data,textStatus) {
				console.log("Varify people exists : " + data);
				var len =userLengthJson(data);
				if(len >= 1) {
					console.log("find one or more candidates");
					var rechooseMessage, html;
					uploadCandidates = new Array();	//存在用户的候选数组
					if(len>1){
						rechooseMessage = "我们找到了好多<b>"+user+"</b>：";
					} else {
						rechooseMessage = "我们找到了一个<b>"+user+"</b>：";
					}
					html = "";
					for(var i=0;i<len;i++){
						if(len>1){
							uploadCandidates[i]=data.user[i];
						} else {
							uploadCandidates[i]=data.user;
						}
						html = html + "<div class=\"ui item segment rechooseitem\">" +
									"<a class=\"ui corner green label\" style=\"display:none\">" +
									"<i class=\"checkmark small icon\"></i> </a>" +
		 							"<img class=\"ui avatar image\" src=" + DefaultImg +">" + 
		 							"<div class=\"content\">" +
		  							"<div class=\"header\">" + uploadCandidates[i]["fullName"] + "</div>" + uploadCandidates[i]["school"] + "\t" + uploadCandidates[i]["entryTime"] +
		  							"</div></div>";
					}
					html = html + "<div class=\"ui item segment rechooseitem\">" +
					"<a class=\"ui corner green label\" style=\"display:none\">" +
					"<i class=\"checkmark small icon\"></i> </a>" +
						"<img class=\"ui avatar image\" src=" + DefaultImg +">" + 
						"<div class=\"content\">" +
						"<div class=\"header\">继续新建词条</div>以上都不是？</div></div>";
					$("#rechooseMessage").html(rechooseMessage);
					$("#rechooselist").html(html);
					$(".ui.item.rechooseitem").click(function(){
						$(this).siblings().children(".label").hide();
						$(this).children(".label").show();
						var selected_num=$(this).next().index()-1;
						if(selected_num > -2) {
							picReceiver = uploadCandidates[selected_num];
						} else {
							picReceiver = NEW_QUOTE;
						}
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
				console.log("Varify receiver failed with error:" + error);
				return false;
			};
			verifyUserExists(data, onSuccess, onError);
		};
	}
});

	/*Help functions*/
function resetUpload() {
	picReceiver = null;
	gotoChoosePeople();
	$("#fullName").val("");
	$("#school").val("");
	$("#entryTime").val("");
	$("#fullName").removeAttr("disabled");
	$("#school").removeAttr("disabled");
	$("#entryTime").removeAttr("disabled");
}

function gotoChoosePeople() {
	picReceiver = null;
	$(".ui.step").attr("class", "ui disabled step");
	$("#step1").attr("class", "ui active step");
	$(".ui.form.uploadForm").hide();
	$("#choosePeople").show();
};
function gotoRechoose() {
	$(".ui.step").attr("class", "ui disabled step");
	$("#step1").attr("class", "ui step");
	$("#step2").attr("class", "ui active step");
	$(".ui.form.uploadForm").hide();
	$("#rechoosePeople").show();
}
function gotoChoosePic() {
	$(".ui.form.uploadForm").hide();
	$("#choosePic").show();
	$("#step1").attr("class", "ui step");
	$("#step2").attr("class", "ui active step");
	$("#step3").attr("class", "ui disabled step");
}
function gotoConfirm() {
	$(".ui.form.uploadForm").hide();
	$("#confirm").show();
	$(".ui.step").attr("class", "ui step");
	$("#step3").attr("class", "ui active step");
}
