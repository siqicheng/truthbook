$(function() {
	$("#step1").click(function() {
		$("#step1").attr("class","ui active step");
		$("#step2").attr("class","ui disabled step");
		$("#step3").attr("class","ui disabled step");
		$("#chooseppform").show();
		$("#choosepicform").hide();
		$("#confirmform").hide();
		$("#rechooseform").hide();
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
		}
	},
	{
		on: "blur"
	}
	);
	
	$("#nextstep1").click(function() {
		var isValidForm = $("#chooseppform").form("validate form");
		if((isValidForm == true)&&(! selected_bool)) {
			var user = $("#fullName").val();
			$("#previewmessage").html("你将传给<b>"+user+"</b>的照片如下：");
			
			var path = "v1/user/verify";
			var url=ServerRoot+ServiceType.LOGIN+path;
 			var data = $("#chooseppform").serialize();
 			console.log(data);
// 			Verify user quote: (fullName,school,entryTime) exist
			var onAjaxSuccess = function(data,textStatus) {
				console.log(data);
				var len =userLengthJson(data);
				if(len >= 1) {
//					用户存在且不是通过好友进入update的
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
		 							"<img class=\"ui avatar image\" src=" + uploadCandidates[i]["imgURL"] +">" + 
		 							"<div class=\"content\">" +
		  							"<div class=\"header\">" + uploadCandidates[i]["fullName"] + "</div>" + uploadCandidates[i]["school"] + "\t" + uploadCandidates[i]["entryTime"] +
		  							"</div></div>";
					}
					html = html + "<div class=\"ui item segment rechooseitem\">" +
					"<a class=\"ui corner green label\" style=\"display:none\">" +
					"<i class=\"checkmark small icon\"></i> </a>" +
						"<img class=\"ui avatar image\" src=" + data.user["imgURL"] +">" + 
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
//TODO: 新建词条function, selected_num==-2时也是新建词条
					console.log("null");
				};
			};
			var onAjaxError = function(xhr,status,error){
					console.log("Register failed with error:" + error);
					return false;
			};
			var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
 			ajax_obj.data = data;
			ajax_call(ajax_obj);
		} else if (selected_bool) {
			$("#chooseppform").hide();
			$("#rechooseform").hide();
			$("#confirmform").hide();
			$("#choosepicform").show();
			$("#step1").attr("class","ui step");
			$("#step2").attr("class","ui active step");
			$("#step3").attr("class","ui disabled step");
		}
	});
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
		if(typeof(selected_num)!="undefined") {
			$("#rechooseform").hide();
			$("#choosepicform").show();
			$("#step1").attr("class","ui step");
			$("#step2").attr("class","ui active step");
		} else {
			$("#rechooseerror").show();
		}
	});
});
