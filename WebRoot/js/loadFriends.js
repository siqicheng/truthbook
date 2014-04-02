$(document).ready(function(){
			var onAjaxSuccess=function(data){
				$("#eFriends").html(eval(data).length);
				$.each(data,function(index,info){
					var html="<div class=\"item\">"+
							"<div class=\"right floated\" style=\"padding-top:5px;width:60px;margin:0;display:none;\">" +
							"<a href=\"./test.html\"><i class=\"cloud upload large icon\"></i></a>" +
							"<a href=\"./test.html\"><i class=\"ban circle large icon\"></i></a>" +
							"</div>"+
							"<img class=\"ui avatar image\" src=\""
							+info["imgURL"]+"\">"+ 
 							"<a class=\"content\" style=\"padding-top: 7px;font-size:16px;width:120px\" href=\"./test.html\">" +
 							info["name"] +
 							"</a>"+"</div>";
					//var html="<a class=\"item\">"+info["name"]+"</a>";
					$("#mFriends").append(html);
				});
				
				$(".ui.list.menu .item").hover(function(){
					$(this).children(".right.floated").fadeIn();},
					function(){
					$(this).children(".right.floated").fadeOut();}
				);	
			};
			var obj=getAjaxObj("./Friends.json","GET","JSON",onAjaxSuccess);
			ajax_call(obj);
		});

