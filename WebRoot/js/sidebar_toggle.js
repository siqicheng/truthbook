$('#upload')
	.sidebar({
		onShow: function(){
//			resetUpload();
//			selected_num=-1;
			$("#upload_menu").toggle();
			$("#close_sidebar_btn").slideDown();
			},
		onHide: function(){
			selected_bool = false;
			$("#upload_menu").slideDown();
			$("#close_sidebar_btn").toggle();
			}
		})
	.sidebar('attach events', '#close_sidebar_btn', 'hide')
	.sidebar('attach events', '.open_popup_link', 'hide');


$(".open_popup_link").click(function(){
	showPopup();
});
$("#upload_for_new_btn").click(function(){
	showSidebar();
});