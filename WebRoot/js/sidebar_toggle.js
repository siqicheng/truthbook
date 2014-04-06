$('#upload')
	.sidebar({
		onShow: function(){
			$("#upload_menu").toggle();
			$("#close_sidebar_btn").slideDown();
			},
		onHide: function(){
			$("#upload_menu").slideDown();
			$("#close_sidebar_btn").toggle();
			}
		})
	.sidebar('attach events', '#close_sidebar_btn', 'hide')
	.sidebar('attach events', '.open_popup_link', 'hide');


$(".open_popup_link").click(function(){
	$("#upload").removeClass("ui very wide styled sidebar");
	$("#upload").addClass("white-popup");
	$("#upload").show();
});
$("#upload_for_new_btn").click(function(){
	$("#upload").removeClass("mfp-hide white-popup");
	$("#upload").addClass("ui very wide styled sidebar");
	$("#upload").sidebar("show");
});