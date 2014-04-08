$(function() {
	tmp=$.cookie("truthbook");
	
	friendsId = new Object();
	friendsId.eFriends = new Array();
	friendsId.nFriends = new Array();
//	freshFriendsLists(tmp.userId);

	getFriends(tmp.userId,1);
	
	function getFriends(id, type) {
		var path = "v1/friends/"+id+"/"+type;
		var url = ServerRoot + ServiceType.USERPROFILE + path;
		var onAjaxSuccess = function(data, textStatus) {
			var num = userLengthJson(data);
			if(type == 1) {
				for(var i=0;i<num;i++){
					if(num == 1) {
						friendsId["nFriends"][i] = data.user;
					} else {
						friendsId["nFriends"][i] = data.user[i];
					};
				};
				freshLists("nFriends");
				getFriends(tmp.userId,2);
			} else {
				for(var i=0;i<num;i++){
					if(num == 1) {
						friendsId["eFriends"][i] = data.user;
					} else {
						friendsId["eFriends"][i] = data.user[i];
					};
				};
				freshLists("eFriends");
				addbtn();
//				cleanFriendsCookie();
				$(".eFriendsList.upload_for_fri .item").click(function() {
					var towhom = friendsId.eFriends[$(this).index()];
					upload_choosepic(towhom);	
				});
				
				$(".nFriendsList.upload_for_fri .item").click(function() {
					var towhom = friendsId.nFriends[$(this).index()];
					upload_choosepic(towhom);
				});
				
				$(".eFriendsList .upload_for_fri_btn").click(function() {
					var towhom = friendsId.eFriends[$(this).parent().parent().index()];
					upload_choosepic(towhom);
				});
				
				$(".nFriendsList .upload_for_fri_btn").click(function() {
					var towhom = friendsId.nFriends[$(this).parent().parent().index()];
					upload_choosepic(towhom);
				});
				
				$(".eFriendsList.needicon .frienditem").click(function() {
					var towhom = friendsId.eFriends[$(this).parent().index()];
					goOthersPage(towhom["userId"]);
				});
				
				$(".nFriendsList.needicon .frienditem").click(function() {
					var towhom = friendsId.nFriends[$(this).parent().index()];
					goOthersPage(towhom["userId"]);
				});
			}
		};
		var onAjaxError = function(xhr, textStatus, error) {
			console.log("getFriends error: "+ error);
		};
		var ajax_obj = getAjaxObj(url, "GET", "json", onAjaxSuccess, onAjaxError);
		ajax_call(ajax_obj);
	};
	

	function freshLists(type) {
//		var friendsList;
//		if(type == "eFriends") {friendsList = $.cookie("eFriends");} else {friendsList = $.cookie("nFriends");}
		var num = friendsId[type].length;
		if(num>0) {
			$("#"+type+"_num").html(num);
			var html="";
			for(var i=0;i<num;i++){
//				if(num == 1) {
//					friendsId[type][i] = friendsList.user;
//				} else {
//					friendsId[type][i] = friendsList.user[i];
//				};
				html= html + "<div class=\"item \">"+
				"<img class=\"ui avatar image\" src=\""
				+DefaultImg+"\">"+ 
					"<div class=\"content frienditem\" style=\"padding-top: 7px;font-size:16px;width:120px\">" +
					friendsId[type][i]["fullName"] +
					"</div></div>";
			}
			$("."+type+"List").html(html);
			$("#"+type+"List").addClass("needicon");
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
	
	function upload_choosepic(people) {
		toId = people["userId"];
		console.log(toId);
		selected_bool = true;
		$("#fullName").attr("value",people["fullName"]);
		$("#school").attr("value",people["school"]);
		$("#entryTime").attr("value",people["entryTime"]);
		$("#chooseppform").hide();
		$("#rechooseform").hide();
		$("#confirmform").hide();
		$("#choosepicform").show();
		$("#step1").attr("class","ui step");
		$("#step2").attr("class","ui active step");
		$("#step3").attr("class","ui disabled step");
		showSidebar();
	}
	
	function freshFriendsLists(id) {
//		cleanFriendsCookie();
		getFriends(id,1);
		
	}
});
