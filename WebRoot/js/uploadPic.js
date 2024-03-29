$(function() {
	$(".ui.form.chooseppform").form(
			{
				username:{
					identifier : "fullName",
					rules: [
		    			{
		    				type: "empty",
		    				prompt: "请输入对方姓名"
		    			}
					]
				},
				school:{
					identifier : "school",
					rules: [
						{
							type: "empty",
							prompt: "请输入对方学校"
						}
					]
				},
				entryyear:{
					identifier : "entryTime",
					rules: [
		                {
		                    type   : "empty",
		                    prompt : "哪年入的校呢？"
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
						}
					]
				},
			},
			{
				on: "submit",
			}
			);
	
	
	$("#step1").click(function() {
		selected_num = -1;
		selected_bool = false;
		$("#step1").attr("class","ui active step");
		$("#step2").attr("class","ui disabled step");
		$("#step3").attr("class","ui disabled step");
		$("#choosepicform").hide();
		$("#confirmform").hide();
		$("#rechooseform").hide();
		$("#chooseppform").show();
	});
	$("#step2").click(function() {
		if($("#step2").attr("class") != "ui disabled step") {
			$("#step1").attr("class","ui step");
			$("#step2").attr("class","ui active step");
			$("#step3").attr("class","ui disabled step");
			$("#chooseppform").hide();
			$("#choosepicform").show();
			$("#confirmform").hide();
			$("#rechooseform").hide();
		}
	});
	
	$("#nextstep1").click(nextstep1Onclick);
	
	$("#nextstep2").click(function() {
		var url = "http://localhost:8080/truthbook/dummy/true.html";
		var data = $("#choosepicform").serialize();
		var onAjaxSuccess = function(data,textStatus) {
			if(data == "true") {
				$("#choosepicform").hide();
    			$("#confirmform").show();
    			$("#step2").attr("class","ui step");
    			$("#step3").attr("class","ui active step");
			} else {
				
			}
		};
		var onAjaxError = function(xhr,status,error){
				console.log("Register failed with error:" + error);
				return false;
		};
		var ajax_obj = getAjaxObj(url,"GET","text",onAjaxSuccess,onAjaxError);
		ajax_obj.data = data;
		ajax_call(ajax_obj);
	});
	
	$("#nextstep3").click(function() {
		if(selected_num != -1) {
			if(uploadCandidates[selected_num]["isActivated"]== "false") {
				$("#rechooseform").hide();
				$("#choosepicform").show();
				$("#step1").attr("class","ui step");
				$("#step2").attr("class","ui active step");
				return;
			}
			var userId = $.cookie("truthbook").userId;
			var selectedId = uploadCandidates[selected_num]["userId"];
			var onSuccess = function(data, textStatus) {
				if(data>0) {
					$("#rechooseform").hide();
					$("#choosepicform").show();
					$("#step1").attr("class","ui step");
					$("#step2").attr("class","ui active step");
				} else {
					var header = "你和他/她还不是好友",
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
			};
			var onError = function(xhr, status, error) {
				console.log("Check friend relationship failed with error: " + error);
			};
			checkFriendRelationship(selectedId, userId, onSuccess, onError);
		} else {
			$("#rechooseerror").show();
		}
	});
	
	$("#submitBtn").click(function(){
		if(selected_num == -2) {
			var path = "v1/quote/register",
			url=ServerRoot+ServiceType.LOGIN+path,
			data = $("#chooseppform").serialize(),
			onAjaxSuccess = function(data, textStatus) {
				if(data != false) {
					console.log("New quote info: " + data);
					toId = data["userId"];
					console.log("upload pic for " + toId);
				} else {
					console.log("Register new quote falied");
				}
				var userId = $.cookie("truthbook").userId;
//				var inviteData ="id=" + toId + "&friend_id=" + userId + "&type=1&is_invitee=true";
				var onSuccess = function() {
					drawConfirmPopUp("新建词条完成！赶快去通知好友来玩吧！");
					console.log("Add friend success");
				};
				addFriendAPI(toId, userId, type_nFriends, "true", onSuccess);
				addFriendAPI(userId, toId, type_nFriends, "false");
				freshFriendsLists(userId);
			},
			onAjaxError = function(xhr, status, error) {
				console.log("Register new quote failed with error: " + error);
				return false;
			};
			var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
			ajax_obj.data = data;
			ajax_call(ajax_obj);
		} else {
			if(! selected_bool) {toId = uploadCandidates[selected_num]["userId"];};
			console.log("upload pic for " + toId);
			var userId = $.cookie("truthbook").userId;
			var onSuccess = function(data, textStatus) {
				var onSuccess = function(data,textStatus) {
					drawConfirmPopUp("为已有词条上传照片完成！这个人太懒了，赶快去叫他/她来玩！");
					console.log("Update friend relationship success");
				};
				if(data> 0) {
					updateFriendRelationship(toId, userId, type_nFriends, "true", onSuccess);
					updateFriendRelationship(userId, toId, type_nFriends, "false");
				} else {
					var quote_bool = !(uploadCandidates[selected_num]["isActivated"] == "true");
					if(quote_bool) {
						addFriendAPI(toId, userId, type_nFriends, "true", onSuccess);
						addFriendAPI(userId, toId, type_nFriends, "false");
					} else {
						alert("You are not his/her friend now!"); //待完成
					}
				}
				freshFriendsLists(userId);
			};
			var onError = function(xhr, status, error) {
				console.log("Check friend relationship failed with error: " + error);
			};
			checkFriendRelationship(toId, userId, onSuccess, onError);
		}
		var userId = $.cookie("truthbook").userId;
		$.magnificPopup.close();
		$(".sidebar").sidebar("hide");
	});
	
	

	
});

function resetUpload() {
	selected_num = -1;
	$("#step1").attr("class","ui active step");
	$("#step2").attr("class","ui disabled step");
	$("#step3").attr("class","ui disabled step");
	$("#choosepicform").hide();
	$("#confirmform").hide();
	$("#rechooseform").hide();
	$("#chooseppform").show();
	$("#fullName").val("");
	$("#school").val("");
	$("#entryTime").val("");
}



/*
 * The following two functions for handling form submit check are both valid. 
 */
//$('.ui.form.chooseppform')
//.submit(function(){
//	var isValidForm = $('.ui.form.chooseppform').form('validate form');
//	if(isValidForm == true){
//		nextstep1Onclick();
//	}else{
//	}
//	return false;
//});

/*
 * This way need onSubmit="return validateUploadFormOne()" in the form tag
 */
function validateUploadFormOne(){
	var isValidForm = $('.ui.form.chooseppform').form('validate form');
	if(isValidForm == true){
		nextstep1Onclick();
	}else{
	}
	return false;	
}

function nextstep1Onclick() {
	var isValidForm = $("#chooseppform").form("validate form");
	if((isValidForm == true)&&(! selected_bool)) {
		var user = $("#fullName").val();
		$("#previewmessage").html("你将传给<b>"+user+"</b>的照片如下：");
		
		var path = "v1/user/verify";
		var url=ServerRoot+ServiceType.LOGIN+path;
			var data = $("#chooseppform").serialize();
			console.log("choose people form data : " + data);
//			Verify user quote: (fullName,school,entryTime) exist
		var onAjaxSuccess = function(data,textStatus) {
			console.log("Varify people exists : " + data);
			var len =userLengthJson(data);
			if(len >= 1) {
//				用户存在且不是通过好友进入update的
				console.log("find one or more candidates");
				var rechoosemessage, html;
				uploadCandidates = new Array();	//存在用户的候选数组
				if(len>1){
					rechoosemessage = "我们找到了好多<b>"+user+"</b>：";
				} else {
					rechoosemessage = "我们找到了一个<b>"+user+"</b>：";
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
				$("#rechoosemessage").html(rechoosemessage);
				$("#rechooselist").html(html);
				$(".ui.item.rechooseitem").click(function(){
					$(this).siblings().children(".label").hide();
					$(this).children(".label").show();
					selected_num=$(this).next().index()-1;
					console.log(selected_num);
					$("#rechooseerror").hide();
				});
				$("#chooseppform").hide();
				$("#rechooseform").show();
			} else if(len == -1) {
				selected_num = -2;
				$("#chooseppform").hide();
				$("#choosepicform").show();
				$("#step1").attr("class","ui step");
				$("#step2").attr("class","ui active step");
			};
		};
		var onAjaxError = function(xhr,status,error){
				console.log("Choosepp failed with error:" + error);
				return false;
		};
		var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
			ajax_obj.data = data;
		ajax_call(ajax_obj);
	} else if (selected_bool) {
		$("#chooseppform").hide();
		$("#choosepicform").show();
		$("#step1").attr("class","ui step");
		$("#step2").attr("class","ui active step");
	}
}
