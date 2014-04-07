$(function() {
	$.cookie.json = true;
	freshFriendsLists($.cookie("truthbook_userId"));
	function getFriends(id, type) {
		var path = "v1/friends/"+id+"/"+type;
		var url = ServerRoot + ServiceType.USERPROFILE + path;
		var onAjaxSuccess = function(data, textStatus) {
			var num = userLengthJson(data);
			if(type == 1) {
				$.cookie("nFriends", data);
			} else {
				$.cookie("eFriends", data);
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			console.log("getFriends error: "+ error);
		};
		var ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
		ajax_call(ajax_obj);
	};
	
	function freshFriendsLists(id) {
		getFriends(id,1);
		getFriends(id,2);
		freshLists("eFriends");
		freshLists("nFriends");
		addbtn();
	}
	
	function freshLists(type) {
		var friendsList;
		if(type == "eFriends") {friendsList = $.cookie("eFriends");} else {friendsList = $.cookie("nFriends");}
//		friendsList = $.cookie("eFriends");
		var num = userLengthJson(friendsList);
		if(num>-1) {
			$("#"+type+"_num").html(num);
			if(num == 1) {
				var html="<div class=\"item\">"+
				"<img class=\"ui avatar image\" src=\""
				+friendsList.user["imgURL"]+"\">"+ 
					"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
					friendsList.user["fullName"] +
					"</a>" + "</div>";
				$("."+type+"List").append(html);
			} else {
				for(var i=0;i<num;i++){
					var html="<div class=\"item\">"+
					"<img class=\"ui avatar image\" src=\""
					+friendsList.user[i]["imgURL"]+"\">"+ 
						"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
						friendsList.user[i]["fullName"] +
						"</a>"+"</div>";
					$("."+type+"List").append(html);
				}
			}
		}
	}
		
	function addbtn() {
		var html = "<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
		"<a href=\"./test.html\"><i class=\"cloud upload large icon\"></i></a>" +
		"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +
		"</div>";
		$(".list.menu.needicon .item").prepend(html);
		$(".list.menu.needicon .item").hover(function(){
			$(this).children(".right.floated").fadeIn();},
			function(){
			$(this).children(".right.floated").fadeOut();}
		);
	}
	
//	$(".eFriends").click(function(){
//		getFriends($.cookie("truthbook_userId"), 2);
//		var friendsList = $.cookie("eFriends");
//		console.log(friendsList);
//		var num = userLengthJson(friendsList);
//		if(num>-1) {
//			$("#eFriend_num").html(num);
//			if(num == 1) {
//				var html="<div class=\"item\">"+
//				"<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
//				"</div>"+
//				"<img class=\"ui avatar image\" src=\""
//				+friendsList[user]["imgURL"]+"\">"+ 
//					"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
//					friendsList[user]["fullName"] +
//					"</a>" +
//					"<a href=\"./test.html\"><i class=\"cloud upload large icon\"></i></a>" +
//					"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +"</div>";
//				//var html="<a class=\"item\">"+info["name"]+"</a>";
//				$("#eFriendList").append(html);
//			} else {
//				for(var i=0;i<num;i++){
//					var html="<div class=\"item\">"+
//					"<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
//					"<a href=\"./test.html\"><i class=\"cloud upload large icon\"></i></a>" +
//					"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +
//					"</div>"+
//					"<img class=\"ui avatar image\" src=\""
//					+friendsList.user[i]["imgURL"]+"\">"+ 
//						"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
//						friendsList.user[i]["fullName"] +
//						"</a>"+"</div>";
//					//var html="<a class=\"item\">"+info["name"]+"</a>";
//					$("#eFriendList").append(html);
//				}
//			}
//			$(".ui.list.menu .item").hover(function(){
//				$(this).children(".right.floated").fadeIn();},
//				function(){
//				$(this).children(".right.floated").fadeOut();}
//			);	
//		}
//		
//	});
});
