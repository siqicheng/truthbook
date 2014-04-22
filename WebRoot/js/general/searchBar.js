/*
 * # Truthbook Search bar 
 *
 */

function searchUsers(){
	$("#searchbarDropdown").remove();
	var input = $("#searchFullName").val();
	if (input != ""){
		var html = "<div class=\"ui fluid menu list transition visible\" id=\"searchbarDropdown\">";
		var onAjaxSuccess = function(data,textStatus){
			if (data == null){
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
					html = html + "<div class=\"item\" onclick = \"goOthersPage(" + userId + ")\"><img class=\"ui avatar image\" src=\"" +
											 DefaultImg + "\">  <div class=\"content\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime + "</div></div></div>";

				} else if (length < 6){
					for(var i = 0;i<length;++i){
						userId = data.user[i].userId;
						fullName = data.user[i].fullName;
						school = data.user[i].school;
						entryTime = data.user[i].entryTime;
						email = data.user[i].email;
						html = html + "<div class=\"item\" onclick = \"goOthersPage("+userId + ")\"><img class=\"ui avatar image\" src=\"" +
												 DefaultImg + "\"> <div class=\"content\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime + "</div></div></div>";
					}
				} else {
					for(var i = 0;i<3;++i){
						userId = data.user[i].userId;
						fullName = data.user[i].fullName;
						school = data.user[i].school;
						entryTime = data.user[i].entryTime;
						email = data.user[i].email;
						html = html + "<div class=\"item\" onclick = \"goOthersPage("+userId + ")\"><img class=\"ui avatar image\" src=\"" +
												 DefaultImg + "\"> <div class=\"content\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime + "</div></div></div>";
					}
					html = html + "<div class=\"item\" id = \"getMoreSearchResult\"> <div class=\"content\">加载更多<div class=\"description\">搜索更多结果</div></div></div>";
				}
				html = html + "</div>";
				$("#searchbar").append(html);
				$("#getMoreSearchResult").click(function() {
					getMoreSearchResult(data, length);
				});
				return true;
			}
		};
		var onAjaxError = function(xhr,status,error){
			alert("Error: " + error);
			return false;
		};
		searchUsersByPrefixAPI(input, onAjaxSuccess, onAjaxError);
	};
	return false;
};

function getMoreSearchResult(data, length) {
	$("#searchbarDropdown").remove();
	var html = "<div class=\"ui fluid menu list transition visible\" id=\"searchbarDropdown\">";
	for(var i=0; i<length; i++) {
		userId = data.user[i].userId;
		fullName = data.user[i].fullName;
		school = data.user[i].school;
		entryTime = data.user[i].entryTime;
		email = data.user[i].email;
		html = html + "<div class=\"item\" style=\"display:none\" onclick = \"goOthersPage("+userId + ")\"><img class=\"ui avatar image\" src=\"" +
								 DefaultImg + "\"> <div class=\"content\">"+ fullName + "</a> <div class=\"description\">" + school + "\t" + entryTime + "</div></div></div>";
	}
	html = html + "<div class=\"ui item\" style=\"display:none\" id=\"pageNum\">" +
							"<div class=\"content\" style=\"padding-top:0px;\">Page 1"+"</div>" +
							"<div class=\"right floated\" style=\"padding-top:0px;\">" +
								"<a class=\"prevpage\">" +
									"<i class=\"left arrow icon\"></i>" +
								"</a>"+
								"<a class=\"nextpage\">"+
									"<i class=\"right arrow icon\"></i>"+
								"</a>"+
							"</div></div>";
	html = html + "</div>";
	$("#searchbar").append(html);
	showSearchResultPage(0, length);
}

function showSearchResultPage(page, num) {
	var min=(page)*5,
	max = (page+1)*5-1;
	if(max>num) {max=num;};
	$("#searchbarDropdown .item").each(function() {
		if(($(this).index()<min) || ($(this).index()>max)) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
	var maxpage = Math.ceil(num/5);
	var pagination = $("#searchbarDropdown .item").last();
	pagination.children(".content").html("Page "+(page+1));
	var prev=(page+maxpage-1)%(maxpage),
		next=(page+1)%(maxpage);

	pagination.children(".content").attr("onclick","showSearchResultPage("+next+","+num+")");
	pagination.children().children(".prevpage").attr("onclick","showSearchResultPage("+prev+","+num+")");
//	if(page-1<1){
//		pagination.children().children(".prevpage").hide();
//	} else {
//		pagination.children().children(".prevpage").show();
//	}
	pagination.children().children(".nextpage").attr("onclick","showSearchResultPage("+next+","+num+")");
//	if(page>num/5){
//		pagination.children().children(".nextpage").hide();
//	} else {
//		pagination.children().children(".nextpage").show();
//	}
	pagination.show();
}

function searchUsersByPrefixAPI(prefix, onSuccess, onError){
	var path = "v1/prefix/";
	var action = "/verify";
	var url=ServerRoot+ServiceType.LOGIN+path + prefix + action;
	var ajax_obj = getAjaxObj(url,"GET","json",onSuccess,onError);
	ajax_call(ajax_obj);
};