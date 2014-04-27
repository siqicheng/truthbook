/*
 * # Truthbook Search bar 
 *
 */
$(function() {
	$("#searchInput").keyup(function(event) {
		if( ((event.which>47) && (event.which<106)) || (event.which == 13) || (event.which == 8) ) {
			searchUsers();
		}
	});
});


function searchUsers(){
	var existedBool = $("#searchbar").dropdown("is visible") == true;
	$("#searchbarDropdown").remove();
	$("#searchbar").dropdown("destroy");
	var input = $("#searchInput").val();
	if (input != ""){
		var html = "<div class='ui fluid menu list' id='searchbarDropdown'>";
		var onAjaxSuccess = function(data,textStatus){
			if (data == null){
				return false;
			}
			else{
				length = userLengthJson(data);
				var userId, fullName, school, entryTime, email, portrait;
				if (length == 1){
					userId = data.user.userId;
					fullName = data.user.fullName;
					school = data.user.school;
					entryTime = data.user.entryTime;
					email = data.user.email;
					if(data.defaultPortrait != undefined){
						portrait = data.defaultPortrait;
					} else {
						portrait = DefaultPortrait;
					}
					html = html + "<div tabindex='2' class='item' onclick = 'goOthersPage(" + userId + ")'><img class='ui avatar image' src='" +
											 portrait + "'>  <div class='content'>"+ fullName + "</a> <div class='description'>" + school + "\t" + entryTime + "</div></div></div>";

				} else if (length < 6){
					for(var i = 0;i<length;++i){
						userId = data.user[i].userId;
						fullName = data.user[i].fullName;
						school = data.user[i].school;
						entryTime = data.user[i].entryTime;
						email = data.user[i].email;
						if(data.user[i].defaultPortrait != undefined){
							portrait = data.user[i].defaultPortrait;
						} else {
							portrait = DefaultPortrait;
						}
						html = html + "<div tabindex='"+ (i+2) +"' class='item' onclick = 'goOthersPage("+userId + ")'><img class='ui avatar image' src='" +
												 portrait + "'> <div class='content'>"+ fullName + "</a> <div class='description'>" + school + "\t" + entryTime + "</div></div></div>";
					}
				} else {
					for(var i = 0;i<3;i++){
						userId = data.user[i].userId;
						fullName = data.user[i].fullName;
						school = data.user[i].school;
						entryTime = data.user[i].entryTime;
						email = data.user[i].email;
						if(data.user[i].defaultPortrait != undefined){
							portrait = data.user[i].defaultPortrait;
						} else {
							portrait = DefaultPortrait;
						}
						html = html + "<div tabindex='"+ (i+2) +"' class='item' onclick = 'goOthersPage("+userId + ")'><img class='ui avatar image' src='" +
												 portrait + "'> <div class='content'>"+ fullName + "</a> <div class='description'>" + school + "\t" + entryTime + "</div></div></div>";
					}
					html = html + "<div tabindex='"+ (i+2) +"' class='item' id = 'getMoreSearchResult'> <div class='content'>加载更多<div class='description'>搜索更多结果</div></div></div>";
				}
				html = html + "</div>";
				$("#searchbar").append(html);
				$("#getMoreSearchResult").click(function() {
					getMoreSearchResult(data, length);
				});
				$("#searchbar").children().each(function() {
					$(this).keydown(function(event) {
						if(event.which == 13) {
							$(this).click();
						}
					});
				});
				if(! existedBool) {
					$("#searchbar").dropdown("show");
				} else {
					$("#searchbar").dropdown();
				};
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
//	$("#searchbar").dropdown("destroy");
	var html = "<div class='ui fluid menu list transition visible' id='searchbarDropdown'>";
	for(var i=0; i<length; i++) {
		userId = data.user[i].userId;
		fullName = data.user[i].fullName;
		school = data.user[i].school;
		entryTime = data.user[i].entryTime;
		email = data.user[i].email;
		if(data.user[i].defaultPortrait != undefined){
			portrait = data.user[i].defaultPortrait;
		} else {
			portrait = DefaultPortrait;
		}
		html = html + "<div tabindex='"+ (i+2) +"' class='item' onclick = 'goOthersPage("+userId + ")'><img class='ui avatar image' src='" +
		 portrait + "'> <div class='content'>"+ fullName + "</a> <div class='description'>" + school + "\t" + entryTime + "</div></div></div>";
	}
	html = html + "<div class='ui thin item pagination'  id='pageNum' style='text-align:center;' >" +
								"<div tabindex='" + (i+2) + "' class='prevpage' style='display:inline; padding-top:0; padding-right:20px;'>" +
								"<a>"+
									"<i class='left arrow icon' style='margin-right:0px;'></i>"+
								"</a>上一页"+
							"</div>"+
							"<span>1</span>"+
							"<div tabindex='" + (i+3) + "' class='nextpage' style='display:inline; padding-top:0; padding-left:20px;'>"+
								"下一页"+
								"<a>"+
									"<i class='right arrow icon' style='margin-right: 0px;'></i>"+
								"</a>"+
							"</div></div>";
	html = html + "</div>";
	$("#searchbar").append(html);
	showSearchResultPage(0, length);
}

function showSearchResultPage(page, num) {
//	var existedBool = $("#searchbar").dropdown("is visible") == true;
	var min=(page)*maxItemNum,
	max = (page+1)*maxItemNum-1;
	if(max>num) {max=num;};
	$("#searchbarDropdown .item").each(function() {
		if(($(this).index()<min) || ($(this).index()>max)) {
			$(this).attr('style', 'display:none');
		} else {
			$(this).removeAttr('style');
		}
	});
	var maxpage = Math.ceil(num/maxItemNum);
	var pagination = $("#searchbarDropdown .item").last();
	pagination.children("span").html(page+1);
	var prev=(page+maxpage-1)%(maxpage),
		next=(page+1)%(maxpage);

	pagination.children(".content").attr("onclick","showSearchResultPage("+next+","+num+")");
	pagination.children(".prevpage").attr("onclick","showSearchResultPage("+prev+","+num+")");
	pagination.children(".nextpage").attr("onclick","showSearchResultPage("+next+","+num+")");
	pagination.removeAttr('style');
	
//	if(! existedBool) {
//		$("#searchbar").dropdown("show");
//	} else {
//		$("#searchbar").dropdown();
//	};
}

function searchUsersByPrefixAPI(prefix, onSuccess, onError){
	var path = "v1/prefix/";
	var action = "/verify";
	var url=ServerRoot+ServiceType.LOGIN+path + prefix + action;
	var ajax_obj = getAjaxObj(url,"GET","json",onSuccess,onError);
	ajax_call(ajax_obj);
};