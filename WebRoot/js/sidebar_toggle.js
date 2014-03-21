$('#upload_new_sidebar')
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
	.sidebar('attach events', '#upload_for_new_btn', 'show')
	.sidebar('attach events', '#close_sidebar_btn', 'hide');