/*
 * # Truthbook Search bar 
 *
 */

function searchUsers(){
//	$("#testSearch").html("");
	var userFullName = $("#searchFullName").val();
	if (userFullName != ""){
		var html = "<div class=\"ui fluid menu list transition visible\" id=\"searchbarDropdown\">";
		var onAjaxSuccess = function(data,textStatus){
			if (data == null){
//				$("#testSearch").append("Ooooops,找不到对象");
				$("#searchbarDropdown").remove();
				return false;
			}
			else{		
				length = userLengthJson(data);
				if (length == 1){
					userId = data.user.userId;
					fullName = data.user.fullName;
					school = data.user.school;
					entryTime = data.user.entryTime;
					email = data.user.email;
//					$("#testSearch").append("<div class=\"item\" onclick = \"goOthersPage(" + userId + ")\"><img class=\"ui avatar image\" src=\"" +
					html = html + "<div class=\"item\" onclick = \"goOthersPage(" + userId + ")\"><img class=\"ui avatar image\" src=\"" +
											 DefaultImg + "\">  <div class=\"content\"> <a class=\"header\" onclick = \"goOthersPage("+
											 userId + ")\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime +
											 "\t" + email + "</div></div></div>";

				} else if (length > 1){
					for(i = 0;i<length;++i){
						userId = data.user[i].userId;
						fullName = data.user[i].fullName;
						school = data.user[i].school;
						entryTime = data.user[i].entryTime;
						email = data.user[i].email;
//						$("#testSearch").append("<div class=\"item\" onclick = \"goOthersPage("+userId + ")\"><img class=\"ui avatar image\" src=\"" +
						html = html + "<div class=\"item\" onclick = \"goOthersPage("+userId + ")\"><img class=\"ui avatar image\" src=\"" +
												 DefaultImg + "\"> <div class=\"content\"> <a class=\"header\" onclick = \"goOthersPage("+ 
												 userId + ")\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime + "\t" + 
												 email + "</div></div></div>";
					}
				}
				html = html + "</div>";
				$("#searchbar").append(html);
				return true;
			}
		};
		var onAjaxError = function(xhr,status,error){
			alert("Error: " + error);
			return false;
		};
		searchUsersAPI(userFullName, onAjaxSuccess, onAjaxError);
	};
	return false;
};

function searchUsersAPI(userFullName, onSuccess, onError){
	var path = "v1/fullName/";
	var action = "/verify";
	var url=ServerRoot+ServiceType.LOGIN+path + userFullName + action;
	var ajax_obj = getAjaxObj(url,"GET","json",onSuccess,onError);
	ajax_call(ajax_obj);
};