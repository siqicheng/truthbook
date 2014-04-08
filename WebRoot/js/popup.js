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
					console.log("find more than one candidates");
					var rechoosemessage, html;
					if(len>1) {
						rechoosemessage = "我们找到了好多<b>"+user+"</b>：";
						html = "";
						for(var i=0;i<len;i++){
							html = html + "<div class=\"ui item segment rechooseitem\">" +
										"<a class=\"ui corner green label\" style=\"display:none\">" +
										"<i class=\"checkmark small icon\"></i> </a>" +
			 							"<img class=\"ui avatar image\" src=" + data.user[i]["imgURL"] +">" + 
			 							"<div class=\"content\">" +
			  							"<div class=\"header\">" + data.user[i]["fullName"] + "</div>" + data.user[i]["school"] + "\t" + data.user[i]["entryTime"] +
			  							"</div></div>";
						}
					} else {
						$("#rechoosemessage").html("我们找到了一个已经在使用Truthbook的<b>"+user+"</b>：");
						
					};
					$("#rechoosemessage").html(rechoosemessage);
					$("#rechooselist").html(html);
					$(".ui.item.rechooseitem").click(function(){
						$(this).siblings().children(".label").hide();
						$(this).children(".label").show();
						selected_num=$(this).index();
						$("#rechooseerror").hide();
					});
					$("#chooseppform").hide();
					$("#rechooseform").show();
				} else if(len == -1) {
//TODO: 新建词条
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