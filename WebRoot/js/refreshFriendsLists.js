$(function() {
	refreshTopbarFriendsLists($.cookie("truthbook").userId);
	refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
});
userFriendsLists = new Object();
userFriendsLists.nFriends = new Array();
userFriendsLists.eFriends = new Array();

pageownerFriendsLists = new Object();
pageownerFriendsLists.nFriends = new Array();
pageownerFriendsLists.eFriends = new Array();

/*Refresh topbar friends lists: topbar-->user's friends*/
function refreshTopbarFriendsLists(id) {
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
		refreshTopbarLists(id);
	};
	var onError = function(xhr, status, error) {
		console.log("Get eFriends List error: " + error);
	};
	getFriends(id, type_eFriends, onSuccess, onError);
};

function refreshTopbarLists(id) {
	var pre = "#topbar ";

	var num = userFriendsLists.nFriends.length;

	var html = "<div class=\"item\">" +
					"<div class=\"content\">" +
					"	你现在还没有真·友哦 " +
					"</div>" +
					"</div>";
	if(num > 0) {
		html = "";
		for(var i=0; i<num; i++) {
			if(userFriendsLists.nFriends[i]["isActivated"] == "false") {
				img = QuoteImg;
			} else {
				img = DefaultImg;
			};
			html= html + "<div class=\"item \">"+
				"<img class=\"ui avatar image\" src=\""
				+ img+ "\">" + 
					"<div class=\"content frienditem\">" +
					userFriendsLists.nFriends[i]["fullName"] +
					"</div></div>";
		};
	};
	$(pre + ".nFriendsList").html(html);

	num = userFriendsLists.eFriends.length;

	var html = "<div class=\"item\">" +
					"<div class=\"content\">" +
					"	你现在还没有极·友哦 " +
					"</div>" +
					"</div>";
	if(num > 0) {
		html = "";
		for(var i=0; i<num; i++) {
			html= html + "<div class=\"item \">"+
				"<img class=\"ui avatar image\" src=\""
				+ DefaultImg+ "\">" + 
					"<div class=\"content frienditem\">" +
					userFriendsLists.eFriends[i]["fullName"] +
					"</div></div>";
		}
	}
	$(pre + ".eFriendsList").html(html);

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

	var num = pageownerFriendsLists.nFriends.length;
	$("#nFriends_num").html(num);

	var html = "<div class=\"item\">" +
					"<div class=\"content\">" +
					"	你现在还没有真·友哦 " +
					"</div>" +
					"</div>";
	if(num > 0) {
		html = "";
		var img;
		for(var i=0; i<num; i++) {
			if(pageownerFriendsLists.nFriends[i]["isActivated"] == "false") {
				img = QuoteImg;
			} else {
				img = DefaultImg;
			};
			html= html + "<div class=\"ui item\">"+
				"<img class=\"ui avatar image\" src=\""
				+ img + "\">" + 
					"<div class=\"content frienditem\">" +
					pageownerFriendsLists.nFriends[i]["fullName"] +
					"</div></div>";
		};
	} else if(id != $.cookie("truthbook").userId) {
		html = "<div class=\"item\">" +
			"<div class=\"content\">" +
			"	他现在还没有真·友哦 " +
			"</div>" +
			"</div>";
	};
	$(pre + ".nFriendsList").html(html);

	num = pageownerFriendsLists.eFriends.length;
	$("#eFriends_num").html(num);

	var html = "<div class=\"item\">" +
					"<div class=\"content\">" +
					"	你现在还没有极·友哦 " +
					"</div>" +
					"</div>";
	if(num > 0) {
		html = "";
		for(var i=0; i<num; i++) {
			html= html + "<div class=\"item \">"+
				"<img class=\"ui avatar image\" src=\""
				+ DefaultImg+ "\">" + 
					"<div class=\"content frienditem\">" +
					pageownerFriendsLists.eFriends[i]["fullName"] +
					"</div></div>";
		}
	} else if(id != $.cookie("truthbook").userId) {
			html = "<div class=\"item\">" +
			"<div class=\"content\">" +
			"	他现在还没有极·友哦 " +
			"</div>" +
			"</div>";
	};
	$(pre + ".eFriendsList").html(html);

	if(id == $.cookie("truthbook").userId) {
		$("#nFriendsList").addClass("needicon");
		$("#eFriendsList").addClass("needicon");
		addButton();
	};
	addMenubarClickFunction();
}

function addMenubarClickFunction() {
	$("#menubar .eFriendsList.upload_for_fri .item").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).index()];
		upload_choosepic(towhom);
	});
	
	$("#menubar .nFriendsList.upload_for_fri .item").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).index()];
		upload_choosepic(towhom);
	});

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
	var html = "<div class=\"right floated\" style=\"display:none;\">" +
	"<a class=\"upload_for_fri_btn\"><i class=\"cloud upload large icon\"></i></a>" +
	"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +
	"</div>";
	$(".list.menu.needicon .item").prepend(html);
	$(".list.menu.needicon .item").hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	$(".eFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()];
		upload_choosepic(towhom);
	});
	
	$(".nFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()];
		upload_choosepic(towhom);
	});
}