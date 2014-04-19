$(function() {
	refreshTopbarFriendsLists($.cookie("truthbook").userId);
	refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
});

/*Refresh topbar friends lists: topbar-->user's friends*/
function refreshTopbarFriendsLists(id) {
	userFriendsLists = new Object();
	userFriendsLists.nFriends = new Array();
	userFriendsLists.eFriends = new Array();
	var onSuccess = function(data, textStatus) {
		var num = userLengthJson(data);
		for(var i=0; i<num; i++) {
			if(num == 1) {
				userFriendsLists.nFriends[i] = data.user;
			} else {
				if(data.user[i]["isActivated"] == "true") {
					for(var j=i-1; j>=0; j--){
						if(userFriendsLists.nFriends[j]["isActivated"] == "true"){
							break;
						};
					};
					userFriendsLists.nFriends[i] = userFriendsLists.nFriends[j+1];
					userFriendsLists.nFriends[j+1] = data.user[i];
				} else {
					userFriendsLists.nFriends[i] = data.user[i];
				};
			};
		};
		console.log("Get nFriends List success");
		console.log(userFriendsLists.nFriends);
		getUserEFriendsLists($.cookie("truthbook").userId);
	};
	var onError = function(xhr, status, error) {
		console.log("Get nFriends List error: " + error);
	};
	getFriends(id, type_nFriends, onSuccess, onError);
};

function getUserEFriendsLists(id) {
	var onSuccess = function(data, textStatus) {
		var num = userLengthJson(data);
		for(var i=0; i<num; i++) {
			if(num == 1) {
				userFriendsLists.eFriends[i] = data.user;
			} else {
				userFriendsLists.eFriends[i] = data.user[i];
			};
		};
		console.log("Get eFriends List success");
		console.log(userFriendsLists.eFriends);
//		addFriendButtonCheck();
		refreshTopbarLists(id);
	};
	var onError = function(xhr, status, error) {
		console.log("Get eFriends List error: " + error);
	};
	getFriends(id, type_eFriends, onSuccess, onError);
};

function refreshTopbarLists(id) {
	drawFriendsList(id, "topbar", "nFriends");
	drawFriendsList(id, "topbar", "eFriends");
	addTopbarClickFunction();
}

function addTopbarClickFunction() {
	$("#topbar .eFriendsList.upload_for_fri .item").click(function() {
		var towhom = userFriendsLists.eFriends[$(this).index()];
		upload_choosepic(towhom);
	});
	
	$("#topbar .nFriendsList.upload_for_fri .item").click(function() {
		var towhom = userFriendsLists.nFriends[$(this).index()];
		upload_choosepic(towhom);
	});

	$("#topbar .eFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = userFriendsLists.eFriends[$(this).parent().index()];
		goOthersPage(towhom["userId"]);
	});
	
	$("#topbar .nFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = userFriendsLists.nFriends[$(this).parent().index()];
		goOthersPage(towhom["userId"]);
	});
}

/*Refresh Menubar Friends Lists   Menubar-->Pageowner's friends*/
function refreshMenubarFriendsLists(id) {
	if(id != $.cookie("truthbook_PageOwner_userId").userId) {return;};
	pageownerFriendsLists = new Object();
	pageownerFriendsLists.nFriends = new Array();
	pageownerFriendsLists.eFriends = new Array();
	var onSuccess = function(data, textStatus) {
		var num = userLengthJson(data);
		for(var i=0; i<num; i++) {
			if(num == 1) {
				pageownerFriendsLists.nFriends[i] = data.user;
			} else {
				if(data.user[i]["isActivated"] == "true") {
					for(var j=i-1; j>=0; j--){
						if(pageownerFriendsLists.nFriends[j]["isActivated"] == "true"){
							break;
						};
					};
					pageownerFriendsLists.nFriends[i] = pageownerFriendsLists.nFriends[j+1];
					pageownerFriendsLists.nFriends[j+1] = data.user[i];
				} else {
					pageownerFriendsLists.nFriends[i] = data.user[i];
				};
			};
		};
		console.log("Get nFriends List success");
		console.log(pageownerFriendsLists.nFriends);
		getPageownerEFriendsLists(id);
	};
	var onError = function(xhr, status, error) {
		console.log("Get nFriends List error: " + error);
	};
	getFriends(id, type_nFriends, onSuccess, onError);
};

function getPageownerEFriendsLists(id) {
	var onSuccess = function(data, textStatus) {
		var num = userLengthJson(data);
		for(var i=0; i<num; i++) {
			if(num == 1) {
				pageownerFriendsLists.eFriends[i] = data.user;
			} else {
				pageownerFriendsLists.eFriends[i] = data.user[i];
			};
		};
		console.log("Get eFriends List success");
		console.log(pageownerFriendsLists.eFriends);
		refreshMenubarLists(id);
	};
	var onError = function(xhr, status, error) {
		console.log("Get eFriends List error: " + error);
	};
	getFriends(id, type_eFriends, onSuccess, onError);
};

function refreshMenubarLists(id) {
	var pre = "#menubar ";
	drawFriendsList(id, "menubar", "nFriends");
	drawFriendsList(id, "menubar", "eFriends");
	addButton();
	addMenubarClickFunction();
}

function drawFriendsList(id, barType, friendsType) {
	if(barType == "topbar"){
		var friendsArray = userFriendsLists;
	} else {
		var friendsArray = pageownerFriendsLists;
	}
	var num = friendsArray[friendsType].length;
	if(barType == "menubar") {
		$("#"+friendsType+"_num").html(num);
	}
	
	if(friendsType == "nFriends") {
		var friendsTypeInChinese = "真·友";
	} else {
		var friendsTypeInChinese = "极·友";
	}
	var html = "<div class=\"item\">" +
					"<div class=\"content\">" +
					"你现在还没有"+friendsTypeInChinese+"哦 " +
					"</div>" +
					"</div>";
	if(num > 0) {
		html = "";
		var img;
		for(var i=0; i<num; i++) {
			if(friendsArray[friendsType][i]["isActivated"] == "false") {
				img = QuoteImg;
			} else {
				img = DefaultImg;
			};
			html= html + "<div class=\"ui friend item\" style=\"display:none\">"+
				"<img class=\"ui avatar image\" src=\""
				+ img + "\">" + 
					"<div class=\"content frienditem\">" +
					friendsArray[friendsType][i]["fullName"] +
					"</div></div>";
		};
		if((id == $.cookie("truthbook").userId)&&(barType == "menubar")) {
			$("#"+friendsType+"List").addClass("needicon");
		};
	} else if(id != $.cookie("truthbook").userId) {
		html = "<div class=\"item\">" +
			"<div class=\"content\">" +
			"他现在还没有"+friendsTypeInChinese+"哦 " +
			"</div>" +
			"</div>";
	};
	if(num>5) {
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
	}
	$("#"+barType + " ."+friendsType+"List").html(html);
	showPage(barType, friendsType, 0, num);
}

function showPage(barType, friendsType, page, num) {
	var min=(page)*5,
		max = (page+1)*5-1;
	if(max>num) {max=num;};
	$("#"+barType+" ."+friendsType+"List .item").each(function() {
		if(($(this).index()<min) || ($(this).index()>max)) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
	var pagination = $("#"+barType+" ."+friendsType+"List .item").last();
	if(num<5) {
		return false;
	} else {
		pagination.show();
	}
	var maxpage = Math.floor(num/5)+1;
	pagination.children(".content").html("Page "+(page+1));
	var prev=(page-1)%(maxpage),
		next=(page+1)%(maxpage);
	pagination.children().children(".prevpage").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+prev+", "+num+")");
//	if(page-1<1){
//		pagination.children().children(".prevpage").hide();
//	} else {
//		pagination.children().children(".prevpage").show();
//	}
	pagination.children().children(".nextpage").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+next+", "+num+")");
	pagination.children(".content").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+next+", "+num+")");
//	if(page>num/5){
//		pagination.children().children(".nextpage").hide();
//	} else {
//		pagination.children().children(".nextpage").show();
//	}
}

function addMenubarClickFunction() {
	$("#menubar .eFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().index()];
		goOthersPage(towhom["userId"]);
	});
	
	$("#menubar .nFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().index()];
		goOthersPage(towhom["userId"]);
	});
}

function addButton() {
	var degrade = "trash";
	var html = "<div class=\"right floated\" style=\"padding-top:5px;width:100px;margin:0;display:none;\">" +
	"<a class=\"invite_upload_btn\"><i class=\"screenshot large icon\"></i></a>" +
	"<a class=\"upload_for_fri_btn\"><i class=\"cloud upload large icon\"></i></a>" +
	"<a class=\"degrade_fri_btn\"><i class=\"" + degrade + " large icon\"></i></a>" +
	"</div>";
	$(".list.menu.nFriendsList.needicon .friend.item").prepend(html);
	
	degrade = "level down";
	var html = "<div class=\"right floated\" style=\"padding-top:5px;width:100px;margin:0;display:none;\">" +
	"<a class=\"invite_upload_btn\"><i class=\"screenshot large icon\"></i></a>" +
	"<a class=\"upload_for_fri_btn\"><i class=\"cloud upload large icon\"></i></a>" +
	"<a class=\"degrade_fri_btn\"><i class=\"" + degrade + " large icon\"></i></a>" +
	"</div>";
	$(".list.menu.eFriendsList.needicon .item").prepend(html);
	
	$(".list.menu.needicon .item").hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	
	$(".eFriendsList .invite_upload_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()];
		confirmInviteFriendUploadPopUp(towhom);
	});
	
	$(".nFriendsList .invite_upload_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()];
		confirmInviteFriendUploadPopUp(towhom);
	});
	
	$(".eFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()];
		upload_choosepic(towhom);
	});
	
	$(".nFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()];
		upload_choosepic(towhom);
	});

	$(".eFriendsList .degrade_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()];
		confirmDegradeFriendPopUp(towhom);
	});
	
	$(".nFriendsList .degrade_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()];
		confirmDeleteFriendPopUp(towhom);
	});
}