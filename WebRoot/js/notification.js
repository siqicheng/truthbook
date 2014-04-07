$("#notification").dropdown('bind intent');

$("#notification").find(".item").click(function(){
	
	$(this).find(".hid_content").toggle();
});