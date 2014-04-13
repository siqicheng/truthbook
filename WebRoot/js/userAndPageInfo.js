/*
 * # Truthbook HomePage Info Print Function
 *
 */


function testFunction_Cookie(){
	
	
	$("#user_name").html($.cookie("truthbook_PageOwner_userId").fullName);
	$("#user_school").html($.cookie("truthbook_PageOwner_userId").school);
	$("#user_entryTime").html($.cookie("truthbook_PageOwner_userId").entryTime+"级");
	$("#testCookie1").html("Cookie test : OK!");
	$("#testCookie").append("Email:\t"+$.cookie("truthbook").email);
//	$("#testCookie").append("<br>");
//	$("#testCookie").append("EntryTime:\t"+$.cookie("truthbook").entryTime);
//	$("#testCookie").append("<br>");
//	$("#testCookie").append("FullName:\t"+$.cookie("truthbook").fullName);
	$("#testCookie").append("<br>");
	$("#testCookie").append("IsActivated:\t"+$.cookie("truthbook").isActivated);
//	$("#testCookie").append("<br>");
//	$("#testCookie").append("School:\t"+$.cookie("truthbook").school);
	$("#testCookie").append("<br>");
	$("#testCookie").append("UserID:\t"+$.cookie("truthbook").userId);
	$("#testCookie").append("<br>");
	$("#testCookie").append("PageOwnersUserID:\t"+$.cookie("truthbook_PageOwner_userId").userId);$("#testCookie").append("<br>");
	printUserNameById($.cookie("truthbook_PageOwner_userId").userId);
}
	
	
function printUserNameById(id){
	if(id != undefined && id != null){
		var path = "v1/" + id;
		var url=ServerRoot+ServiceType.LOGIN+path;
		var onAjaxSuccess = function(data,textStatus){
			if (data != null ){
				$("#testCookie").append("PageOwnersUserName:\t" + data.fullName);$("#testCookie").append("<br>");
				return true;
			}
			else{
				("#testCookie").append("PageOwnersUserName:\t" + data.fullName);$("#testCookie").append("<br>");		
				return true;
			}
		};
		var onAjaxError = function(xhr,status,error){
			return false;
		};
		var ajax_obj = getAjaxObj(url,"GET","json",onAjaxSuccess,onAjaxError);
		ajax_call(ajax_obj);
	}	
	
}	