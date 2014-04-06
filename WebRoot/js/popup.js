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
//		var isValidForm = $("#chooseppform").form("validate form");
//		if(isValidForm == true) {
			var user = $("#fullName").val();
			$("#previewmessage").html("你将传给<b>"+user+"</b>的照片如下：");
			
			var path = "v1/user/verify";
			var url=ServerRoot+ServiceType.LOGIN+path;
 			var data = $("#chooseppform").serialize();
 			console.log(data);
// 			Verify user quote: (fullName,school,entryTime) exist
			var onAjaxSuccess = function(data,textStatus) {
				console.log(data);
				var len;
				if(data.user.length!=undefined){
					len=data.user.length;
				} else if(data != null){
					len=1;
				};
				if(len == 1) {
					console.log("find only one candidate");
					$("#chooseppform").hide();
    				$("#choosepicform").show();
    				$("#step1").attr("class","ui step");
    				$("#step2").attr("class","ui active step");
				} else if(len > 1) {
//					重名
					console.log("find more than one candidates");
					$("#rechoosemessage").html("我们找到了好多<b>"+$("#fullName").val()+"</b>：");
					$("#chooseppform").hide();
					$("#rechooseform").show();
				} else if(data == null) {
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
//		}
	});
	
	
	
	
	
	
	
	
	
	
	
//	$("#nextstep1").click(function() {
////		var isValidForm = $("#chooseppform").form("validate form");
////		if(isValidForm == true) {
//			var user = $("#fullName").val();
//			$("#previewmessage").html("你将传给<b>"+user+"</b>的照片如下：");
//			
//			var path = "v1/user/verify";
//			var url=ServerRoot+ServiceType.LOGIN+path;
// 			var data = $("#chooseppform").serialize();
// 			console.log(data);
//// 			Verify user quote: (fullName,school,entryTime) exist
//			var onAjaxSuccess = function(data,textStatus) {
//				console.log(data);
//				if(data == "true") {
//					alert("true");
//					$("#chooseppform").hide();
//    				$("#choosepicform").show();
//    				$("#step1").attr("class","ui step");
//    				$("#step2").attr("class","ui active step");
//				} else if(data == "false") {
////					重名
//					console.log("false");
//					$("#rechoosemessage").html("我们找到了好多<b>"+$("#fullName").val()+"</b>：");
//					$("#chooseppform").hide();
//					$("#rechooseform").show();
//				} else if(data == null) {
//					console.log("null");
//				};
//			};
//			var onAjaxError = function(xhr,status,error){
//					console.log("Register failed with error:" + error);
//					return false;
//			};
//			var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
// 			ajax_obj.data = data;
//			ajax_call(ajax_obj);
////		}
//	});
	
	
	
	
	
	
//	$("#nextstep1").click(function() {
////		var isValidForm = $("#chooseppform").form("validate form");
////		if(isValidForm == true) {
//			$("#previewmessage").html("你将传给<b>"+$("#fullName").val()+"</b>的照片如下：");
//			var url = "http://localhost:8080/truthbook/dummy/false.html";
// 			var data = $("#chooseppform").serialize();
// 			
//// 			Verify user quote: (fullName,school,entryTime) exist
// 			
//			var onAjaxSuccess = function(data,textStatus) {
//				if(data == "true") {
//					$("#chooseppform").hide();
//    				$("#choosepicform").show();
//    				$("#step1").attr("class","ui step");
//    				$("#step2").attr("class","ui active step");
//				} else if(data == "false") {
////					重名
//					$("#rechoosemessage").html("我们找到了好多<b>"+$("#fullName").val()+"</b>：");
//					$("#chooseppform").hide();
//					$("#rechooseform").show();
//				} else if(data == 2) {
////					新建
//				};
//			};
//			var onAjaxError = function(xhr,status,error){
//					console.log("Register failed with error:" + error);
//					return false;
//			};
//			var ajax_obj = getAjaxObj(url,"GET","text",onAjaxSuccess,onAjaxError);
// 			ajax_obj.data = data;
//			ajax_call(ajax_obj);
////		}
//	});
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
	
	$(".upload_for_fri").click(function(){
		
	});
	
	function jsonlength(json) {
		var i=0;
		for (var x in json) {
//			if(json.hasOwnProperty(x)){
				i++;
//			}
		}
		return i;
	}
});

function clickppitem(num) {
	if(typeof(selected_num)=="undefined") {
		selected_num=num;
		$("#item"+selected_num+" .label").show();
	} else {
		$("#item"+selected_num+" .label").hide();
		selected_num=num;
		$("#item"+selected_num+" .label").show();
	};
	$("#rechooseerror").hide();
};