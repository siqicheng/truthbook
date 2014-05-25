/*
 * # Truthbook HomePage Info Print Function
 *
 */


function userInfo(){
	$("#user_name").html($.cookie("truthbook_PageOwner_userId").fullName);
	$("#user_name_top").html($.cookie("truthbook").fullName);
	$("#user_school").html($.cookie("truthbook_PageOwner_userId").school);
	$("#user_entryTime").html($.cookie("truthbook_PageOwner_userId").entryTime+"级");
}
	