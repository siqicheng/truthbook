$("#notifiBtn").click(function(){
    $("#notifipanel").slideToggle("slow");
  });

$("#notifipanel").find(".item").click(function(){	
	$(this).find(".hid_content").toggle();
}).hover(function(){
	$(this).find(".right.floated.icon").toggle();
});

newsAddicon();

//prevent click event propagation happen
$("#notifipanel").find(".item .hid_content").bind("click", function(event){
	event.stopPropagation();
})

$("#notifipanel").find(".item.friendreq_news .hid_content").addClass("list")
	.append("<div class='item'>" +
				"<img class='ui avatar image' src='./img/profile_test/247142.jpg'>" +
				"<div class='content'>" +
					"<div class='header'>张三</div>" +
					"<div class='description'>复旦大学 2008</div>" +
					"<div style='display:block'><div class='ui mini positive button'>接受</div> <div class='ui mini button'>忽略</div></div>" +
				"</div>" +
			"</div>");

var dimmerBtn = "<div class='ui dimmer'>" +
					"<div class='content'><div class='center'>" +							
  						"<div class='ui mini positive button'>接受</div> " +
  						"<div class='ui mini button'>忽略</div>" +
					"</div></div>" +
				"</div>";
$("#notifipanel").find(".item.image_news .hid_content")
	.append("<div class='newimage' style='width:180px;margin-left:30px'>" +
				"<img class='ui image' src='./img/profile_test/247143.jpg'>" +
				dimmerBtn + "</div>");

$('.item.image_news .hid_content .newimage')
	.dimmer({
		on: 'hover'
	});


//$(".right.floated.remove.icon").click(function(){
//	$(".item.image_req").hide();
//})

//add icons & headers for all items in notification column
function newsAddicon(){
	var $panel = $("#notifipanel");
	var header_up = "<div class='content'><div class='header'>";
	var header_down = "</div></div>\n";
	
	var remove_icon = "<i class='right floated remove icon'></i>\n";
	
	var friendreq_icon = "<i class='user icon'></i>\n";
	var friendreq_num = 1;
	var friendreq_header = header_up + friendreq_num + "个好友请求" + header_down;
	
	var image_icon = "<i class='photo icon'></i>\n";
	var image_num = 1;
	var image_header = header_up + image_num + "张新的照片" + header_down;
	
	var comment_icon = "<i class='comment icon'></i>\n";
	var comment_num = 1;
	var comment_header = header_up + comment_num + "条新的评论" + header_down;
	
	var update_icon = "<i class='level up icon'></i>\n";
	var update_num = 1;
	var update_header = header_up + update_num + "位真友升级" + header_down;
	
	var invite_icon = "<i class='forward mail icon'></i>\n";
	var invite_num = 1;
	var invite_header = header_up + invite_num + "条好友上传邀请" + header_down;
	
	var accept_icon = "<i class='checkmark icon'></i>\n";
	var accept_num = 1;
	var accept_header = header_up + accept_num + "张照片被接收" + header_down;
	
	var signup_icon = "<i class='sign in icon'></i>\n";
	var signup_num = 1;
	var signup_header = header_up + signup_num + "位您创建的好友已入驻" + header_down;
	
	$panel.children(".item").prepend(remove_icon);
	$panel.children(".item.friendreq_news").append(friendreq_icon).append(friendreq_header);
	$panel.children(".item.image_news").append(image_icon).append(image_header);
	$panel.children(".item.comment_news").append(comment_icon).append(comment_header);
	$panel.children(".item.update_news").append(update_icon).append(update_header);
	$panel.children(".item.invite_news").append(invite_icon).append(invite_header);
	$panel.children(".item.accept_news").append(accept_icon).append(accept_header);
	$panel.children(".item.signup_news").append(signup_icon).append(signup_header);
	$panel.children(".item").append("<div class='hid_content'></div>\n");
	
	var news_num = friendreq_num + image_num + comment_num + update_num + invite_num + accept_num + signup_num;
	$("#unreadMessageNum").append(news_num);
}

