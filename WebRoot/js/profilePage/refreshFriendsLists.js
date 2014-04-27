/*
刷新好友列表相关
好友信息更新后可直接调用refreshTopbarFriendsLists和refreshMenubarFriendsLists就能刷新
Topbar好友列表显示当前user的好友列表
Menubar好友列表显示当前PageOwner的好友列表
*/

$(function() {
	refreshTopbarFriendsLists($.cookie("truthbook").userId);
	refreshMenubarFriendsLists($.cookie("truthbook_PageOwner_userId").userId);
});

/*refreshTopbarFriendsLists Start  topbar-->user's friends
	
	1.get user's nFriends List
*/
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
				/*真友排序，用户在前，词条在后*/
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

/*2.get user's eFriends List
	成功后refreshTopbarLists
*/
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

/*3.得到数据后，刷新Topbar好友列表*/
function refreshTopbarLists(id) {
	drawFriendsList(id, "topbar", "nFriends");
	drawFriendsList(id, "topbar", "eFriends");
	addTopbarClickFunction();
}

/*4.画完后加click function*/
function addTopbarClickFunction() {
	$("#topbar .eFriendsList .friend.item").click(function() {
		var towhom = userFriendsLists.eFriends[$(this).index()-1];
		upload_choosepic(towhom);
	});
	
	$("#topbar .nFriendsList .friend.item").click(function() {
		var towhom = userFriendsLists.nFriends[$(this).index()-1];
		upload_choosepic(towhom);
	});
}
/*refreshTopbarFriendsLists End*/

/*Refresh Menubar Friends Lists Start   Menubar-->Pageowner's friends

1.get pageOwner's nFriends List
*/
function refreshMenubarFriendsLists(id) {
	if(id != $.cookie("truthbook_PageOwner_userId").userId) {return;}; //menubar的好友列表是PageOwner的好友列表，若刷新user的好友列表时调用，则判断当前是否在user界面，否则不执行
	pageownerFriendsLists = new Object();
	pageownerFriendsLists.nFriends = new Array();
	pageownerFriendsLists.eFriends = new Array();
	var onSuccess = function(data, textStatus) {
		var num = userLengthJson(data);
		for(var i=0; i<num; i++) {
			if(num == 1) {
				pageownerFriendsLists.nFriends[i] = data.user;
			} else {
				/*真友排序：用户在前，词条在后*/
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

/*2.Get pageOwner's eFriends List*/
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

/*3.获取数据后刷新menubar好友列表*/
function refreshMenubarLists(id) {
	var pre = "#menubar ";
	drawFriendsList(id, "menubar", "nFriends");
	drawFriendsList(id, "menubar", "eFriends");
	if(id == $.cookie('truthbook').userId) {addButton();}
	addMenubarClickFunction();
}

/*4.画好列表后加入点击好友姓名跳转function*/
function addMenubarClickFunction() {
	$("#menubar .eFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().index()-1];
		goOthersPage(towhom["userId"]);
	});
	
	$("#menubar .nFriendsList.goto_fri_page .frienditem").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().index()-1];
		goOthersPage(towhom["userId"]);
	});
}

/*4.画完列表若id == userId 加入button*/
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
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()-1];
		confirmInviteFriendUploadPopUp(towhom);
	});
	
	$(".nFriendsList .invite_upload_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()-1];
		confirmInviteFriendUploadPopUp(towhom);
	});
	
	$(".eFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()-1];
		upload_choosepic(towhom);
	});
	
	$(".nFriendsList .upload_for_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()-1];
		upload_choosepic(towhom);
	});

	$(".eFriendsList .degrade_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.eFriends[$(this).parent().parent().index()-1];
		confirmDegradeFriendPopUp(towhom);
	});
	
	$(".nFriendsList .degrade_fri_btn").click(function() {
		var towhom = pageownerFriendsLists.nFriends[$(this).parent().parent().index()-1];
		confirmDeleteFriendPopUp(towhom);
	});
};
/*refresh menubar friends lists End*/

/*3.5 for both:画好友列表的通用函数*/
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
		html ="<div class='ui thin item pagination'  id='pageNum' style='text-align:center;' >" +
								"<div class='prevpage changePage' style='display:inline; padding-top:0; padding-right: 40px;'>" +
										"<i class='left arrow icon' style='margin-right:0px;'></i>"+
									"上一页"+
								"</div>"+
								"<span>1</span>"+
								"<div class='nextpage changePage' style='display:inline; padding-top:0; padding-left: 40px;'>"+
									"下一页"+
										"<i class='right arrow icon' style='margin-right: 0px;'></i>"+
								"</div></div>";
		var portrait;
		for(var i=0; i<num; i++) {
			if(friendsArray[friendsType][i]["isActivated"] == "false") {
				portrait = DefaultQuotePortrait;
			} else {
				if(friendsArray[friendsType][i].defaultPortrait != undefined){
					portrait = friendsArray[friendsType][i].defaultPortrait;
				} else {
					portrait = DefaultPortrait;
				}
			};
			html= html + "<div class=\"ui friend item\" style=\"display:none\">"+
				"<img class=\"ui avatar image\" src=\""
				+ portrait + "\">" + 
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
	$("#"+barType + " ."+friendsType+"List").html(html);
	showPage(barType, friendsType, 0, num);
	$("#"+barType + " ."+friendsType+"List" + " .item.pagination").hover(function(){
		$(this).children(".right.floated").fadeIn(50);},
		function(){
		$(this).children(".right.floated").fadeOut(50);}
	);
	$("#"+barType + " ."+friendsType+"List").children().children('.changePage').hover(	
			function(){$(this).css("color","#33B2E1");},
			function(){$(this).css("color","");}
	);
}

/*翻页function*/
function showPage(barType, friendsType, page, num) {
	var min=(page)*maxItemNum+1,
		max = (page+1)*maxItemNum;
	if(max>num) {max=num;};
	$("#"+barType+" ."+friendsType+"List .item").each(function() {
		if(($(this).index()<min) || ($(this).index()>max)) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
	var pagination = $("#"+barType+" ."+friendsType+"List .item").first();
	if( num == 0 ) {
		pagination.show();
		return false;
	};
	if(num<=maxItemNum) {
		return false;
	} else {
		pagination.show();
	}
	var maxpage = Math.ceil(num/maxItemNum);
	pagination.children('span').text(page+1);
	var prev=(page+maxpage-1)%(maxpage),
		next=(page+1)%(maxpage);
	pagination.children(".prevpage").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+prev+", "+num+")");
	pagination.children(".nextpage").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+next+", "+num+")");
	pagination.children(".content").attr("onclick","showPage(\""+barType+"\",\""+friendsType+"\", "+next+", "+num+")");
}
