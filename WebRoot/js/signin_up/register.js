window.isValidEmailGlb = 0;
window.touchedPassword = 0;
window.selected_num = -1;

/*
 *  Combine two form pre-check
 *	1. Semantic form validation
 *  2. Email existance
 */	        
$(function() {
    $('.ui.form.register-form')
        .form({
            username: {
                identifier : 'fullName',
                rules: [
                {
                    type   : 'empty',
                    prompt : '给个真名呗'
                }
                ]
            },
            school: {
                identifier : 'school',
                rules: [
                {
                    type   : 'empty',
                    prompt : '告诉我们你的学校吧'
                }
                ]
            },
            age: {
                identifier : 'entryTime',
                rules: [
                {
                    type   : 'empty',
                    prompt : '哪年入的校呢？'
                },
                {
                    type   : 'isYear',
                    prompt : '这个年份好像不对啊？'
                },
                {
                    type   : 'earlyYear[1976]',
                    prompt : '您这么早就入学了？'
                },
                {
                    type   : 'lateYear[2015]',
                    prompt : '今年才2014年吧？'
                },
                ]
            },
            email: {
                identifier: 'email',
                rules:[
                {
                    type   : 'email',
                    prompt : '请输入正确的邮箱'
                }
                ]
            },
            password: {
                identifier : 'password',
                rules: [
                {
                    type   : 'empty',
                    prompt : '请输入密码'
                },
                {
                    type   : 'length[6]',
                    prompt : '密码至少6位'
                }
                ]
            },

        },{
            on: 'blur',
            inline: 'true',
            onFailure :  disableRegisterButton,
			onInvalid : disableRegisterButton,
        });
        
        function disableRegisterButton(){
        	document.getElementById("register_button").className = "ui disabled fluid blue button";
        	return false;
        }
}); 

/*
 *	Form submit
 *  Be enabled only when form pass semantic form validation and email check
 */
$('.ui.form.register-form')
	.submit(function(){
		var isValidForm = $('.ui.form.register-form').form('validate form');
		if(isValidForm == true && isValidEmailGlb == 1){
			var user = $("#fullName").val();
			var path = "v1/user/verify";
			var url=ServerRoot+ServiceType.LOGIN+path;
				var data = $('.ui.form.register-form').serialize();
				console.log(data);
	//			Verify user quote: (fullName,school,entryTime) exist
			var onAjaxSuccess = function(data,textStatus) {
				console.log(data);
				var len =userLengthJson(data);
				uploadCandidates = new Array();	//存在词条的候选数组
				var num = -1;
				for(var i=0;i<len;i++){
					if(len>1){
						if(data.user[i]["isActivated"] == "false"){
							num++;
							uploadCandidates[num]=data.user[i];
						} else {
							continue;
						}
					} else {
						if(data.user["isActivated"] == "false"){
							num++;
							uploadCandidates[num]=data.user;
						} else {
							continue;
						}
					}
				}
				if(num >= 0) {
	//				词条存在
					console.log("find one or more candidates");
					var rechoosemessage, html;
					if(num>0){
						rechoosemessage = "我们找到了好多<b>"+user+"</b>：";
					} else {
						rechoosemessage = "我们找到了一个<b>"+user+"</b>：";
					}
					html = "";
					for(i=0;i<=num;i++){
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
						"<img class=\"ui avatar image\" src=" +  DefaultImg +">" + 
						"<div class=\"content\">" +
						"<div class=\"header\">继续注册</div>以上都不是？</div></div>";
					$("#rechoosemessage").html(rechoosemessage);
					$("#rechooselist").html(html);
					$(".ui.item.rechooseitem").click(function(){
						$(this).siblings().children(".label").hide();
						$(this).children(".label").show();
						selected_num=$(this).next().index()-1;
						console.log(selected_num);
						$("#rechooseerror").hide();
					});
					$("#confirmbtn").click(function() {
						if(selected_num == -1) {
							$("#rechooseerror").show();
						} else if(selected_num == -2) {
							register_new($('.ui.form.register-form').serialize());
						} else {
							var choosenQuote = uploadCandidates[selected_num];
							checkInviterName(choosenQuote.userId, $("#checkinput").val());
						}
					});
					$("#rechooseform").modal("show");
				} else {
					console.log("no quote found");
					register_new($('.ui.form.register-form').serialize());
				};
			};
			var onAjaxError = function(xhr,status,error){
					console.log("Register failed with error:" + error);
					return false;
			};
			var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
				ajax_obj.data = data;
				ajax_call(ajax_obj);
	}
	return false;
});
    
    /*	Helper function
 */
function register_new(info) {
	var path = "v1/full/register";
	var url=ServerRoot+ServiceType.LOGIN+path;		
	var data= info;
	var onAjaxSuccess = function(data,textStatus){
		if (data == false){

		} else {
			setUserInfoCookie(data);
			goHomePage();
			return true;
		}
	};
	var onAjaxError = function(xhr,status,error){
		$("#errorMessageMail").show();
		$("#errorMessageMail").text("注册失败:" + error);
		console.log("Register failed with error:" + error);
		return false;
	};
	var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function take_quote(id, register_info) {
	var path = "v1/takeQuote/register";
	var url = ServerRoot + ServiceType.LOGIN + path;
	var email=register_info[3].value;
	var password=register_info[4].value;
	var data = "user_id="+id+"&email="+email+"&password="+password;
	var onAjaxSuccess = function(data,textStatus){
		if(data == false){
			alert("take quote failed");
		} else {
			setUserInfoCookie(data);
			goHomePage();
			console.log("take quote success");
		}
	};
	var onAjaxError = function(xhr,status,error){
		$("#errorMessageMail").show();
		$("#errorMessageMail").text("注册失败:" + error);
		console.log("Register failed with error:" + error);
		return false;
	};
	var ajax_obj = getAjaxObj(url,"POST","json",onAjaxSuccess,onAjaxError);
	ajax_obj.data = data;
	ajax_call(ajax_obj);
}

function checkInviterName(id, inviterName) {
	var path = "v1/friends/" + id +"/1",
		url = ServerRoot + ServiceType.USERPROFILE + path,
		onAjaxSuccess = function(data, textStatus) {
			var num = userLengthJson(data);
			var name;
			var inputName = $("#checkinput").val();
			for(var i=0;i<num;i++) {
				if(num>1) {
					name = data.user[i]["fullName"];
				} else {
					name = data.user["fullName"];
				};
				if(name == inputName) {
					take_quote(id, $('.ui.form.register-form').serializeArray());
					return true;
				}
			}
			$("#checkinput").val("");
			$("#checkinput").attr("placeholder","好像不是他/她哦");
			return false;
		},
		onAjaxError = function(xhr, status, error) {
			console.log("Get inviter json failed with error: " + error);
		};
		ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
		ajax_call(ajax_obj);
}
 
 
function  showCheckmarklabel() {
	$("#cornerlabel").show();
	$("#correctCheckmark").show();
	isValidEmailGlb = 1;
}
function  hideCheckmarklabel() {
	$("#cornerlabel").hide();
	$("#correctCheckmark").hide();
	isValidEmailGlb = 0;
}
function disableButton(buttonID){
	document.getElementById(buttonID).className = "ui disabled fluid blue button";
}

/*	
 *	checkEmail() is used for email input.
 *	Email validation need an AJAX check with the back-end.
 */
function checkEmail(email){
	if (email.length==0) { 
		$("#errorMessageMail").hide();
		hideCheckmarklabel();
		return;
	}			
	var path = "v1/email/";
	var action = "/verify";
	var url=ServerRoot+ServiceType.LOGIN+path + email + action;	
	var onAjaxSuccess = function (data,textStatus){
		if(data == false){	
			$("#errorMessageMail").hide();
			if(document.getElementById("emailTest").className == "field") {
				showCheckmarklabel();
				checkButtonValid();
			}	else {
				hideCheckmarklabel();
			}	
		} else {
			$("#errorMessageMail").show();
			hideCheckmarklabel();
			disableButton("register_button");
		}
		console.log("status:"+textStatus+" data:"+data);
	};

	var onAjaxError = function(xhr,status,error){
			$("#errorMessageMail").show();
			$("#errorMessageMail").text("status:"+status+" error:"+error);
			console.log("status:"+status+" error:"+error);
		};
	var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
	ajax_call(ajax_obj);
}

/*	
 *	checkButtonValid() is used for fullName, school, entryTime and email input.
 *	If the user touched the password input, former inputs can be allowed to do the button valid check.
 */
function checkButtonValid(){
	if (touchedPassword == 1){
		var isValidForm = $('.ui.form.register-form').form('validate form');
		if(isValidForm == true && isValidEmailGlb == 1){
			document.getElementById("register_button").className = "ui fluid blue button";
		}
	}
}

/*	
 *	checkButtonValidPW() is only used for password input.
 *	After user touched the password input, former inputs can be allowed to do the button valid check.	
 *	Or, the isValidForm check will force the entire form to do the validation and show errors everywhere.
 */
function checkButtonValidPW(){
	touchedPassword = 1;
	var isValidForm = $('.ui.form.register-form').form('validate form');
	if(isValidForm == true && isValidEmailGlb == 1){
		document.getElementById("register_button").className = "ui fluid blue button";
	}
}