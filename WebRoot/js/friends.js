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
		friendsId = new Object();
		friendsId.eFriends = new Array();
		friendsId.nFriends = new Array();
		freshLists("eFriends");
		freshLists("nFriends");
		addbtn();
		
		cleanFriendsCookie();
	}
	
	function freshLists(type) {
		var friendsList;
		if(type == "eFriends") {friendsList = $.cookie("eFriends");} else {friendsList = $.cookie("nFriends");}
		var num = userLengthJson(friendsList);
		if(num>-1) {
			$("#"+type+"_num").html(num);
			if(num == 1) {
				friendsId[type][0] = friendsList.user["userId"];
				var html="<div class=\"item\">"+
				"<img class=\"ui avatar image\" src=\""
				+friendsList.user["imgURL"]+"\">"+ 
					"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
					friendsList.user["fullName"] +
					"</a>" + "</div>";
				$("."+type+"List").append(html);
			} else {
				for(var i=0;i<num;i++){
					friendsId[type][i] = friendsList.user[i]["userId"];
					var html="<div class=\"item\">"+
					"<img class=\"ui avatar image\" src=\""
					+friendsList.user[i]["imgURL"]+"\">"+ 
						"<div class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\">" +
						friendsList.user[i]["fullName"] +
						"</div>"+"</div>";
					$("."+type+"List").append(html);
				}
			}
		}
	}
		
	function addbtn() {
		var html = "<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
		"<a class=\"upload_for_fri_btn\"><i class=\"cloud upload large icon\"></i></a>" +
		"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +
		"</div>";
		$(".list.menu.needicon .item").prepend(html);
		$(".list.menu.needicon .item").hover(function(){
			$(this).children(".right.floated").fadeIn();},
			function(){
			$(this).children(".right.floated").fadeOut();}
		);
	}
	
	$(".eFriendsList.upload_for_fri .item").click(function() {
		var toId = friendsId.eFriends[$(this).index()];
		upload_choosepic(toId);	
	})
	
	$(".nFriendsList.upload_for_fri .item").click(function() {
		var toId = friendsId.nFriends[$(this).index()];
		upload_choosepic(toId);
	})
	
	$(".upload_for_fri_btn").click(function() {
		var toId = friendsId.eFriends[$(this).parent().parent().index()];
		upload_choosepic(toId);
	})
	
	function cleanFriendsCookie() {
		$.cookie("eFriends", null, {expires: -1});
		$.cookie("nFriends", null, {expires: -1});
	}
	
	function upload_choosepic(id) {
		toId = id;
		console.log(toId);
		$("#chooseppform").hide();
		$("#rechooseform").hide();
		$("#confirmform").hide();
		$("#choosepicform").show();
		$("#step1").attr("class","ui step");
		$("#step2").attr("class","ui active step");
		$("#step3").attr("class","ui disabled step");
		$("#upload").removeClass("mfp-hide white-popup");
		$("#upload").addClass("ui very wide styled sidebar");
		$("#upload").sidebar("show");
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
