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
    						prompt: "请输入正确的年份"
    					},
    					{
    						type: "earlyYear[1976]",
    						prompt: "对方那么早就入学了？"
    					},
    					{
    						type: "lateYear[2015]",
    						prompt: "今年才2014年吧？"
    					}
    				]
    			}
    		},
    		{
    			on: "blur"
    		}
    		);
    		
    		$("#nextstep1").click(function() {
//     			var isValidForm = $("#chooseppform").form("validate form");
//     			if(isValidForm == true) {
					var url = "http://localhost:8080/truthbook/dummy/false.html";
		 			var data = $("#chooseppform").serialize();
					var onAjaxSuccess = function(data,textStatus) {
						if(data == "true") {
							$("#chooseppform").hide();
		    				$("#choosepicform").show();
		    				$("#step1").attr("class","ui step");
		    				$("#step2").attr("class","ui active step");
						} else if(data == "false") {
							// 创建新人
							$("#chooseppform").hide();
							$("#rechooseform").show();
						} else if(data == 2) {
							//重名选人
						};
					};
					var onAjaxError = function(xhr,status,error){
							console.log("Register failed with error:" + error);
							return false;
					};
					var ajax_obj = getAjaxObj(url,"GET","text",onAjaxSuccess,onAjaxError);
		 			ajax_obj.data = data;
					ajax_call(ajax_obj);
// 				}
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
						//图片不符合要求
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