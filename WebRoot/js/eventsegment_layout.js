var items = [
             {
            	 imgsrc: "http://lorempixel.com/319/496/",
            	 descript: "This dog has some things going for it. Its pretty cute and looks like it'd be fun to cuddle up with.",
            	 meta: "yyyy-mm-dd",
            	 uploader: {
            		 		userid:"1", 
            		 		username:"张三", 
            		 		url:"http://localhost:8080/truthbook/profile_test.html"
            		 		},
            	comments: [
            	           {
            	        	   userid: "1",
            	        	   username: "张三",
            	        	   content: "最喜欢宫城良田了！！！",
            	        	   url:"http://localhost:8080/truthbook/profile_test.html",
            	        	   meta: "yyyy-mm-dd",
            	        	   avatar: "./img/profile_test/247142.jpg"
            	           },
            	           {
            	        	   userid: "2",
            	        	   username: "李四",
            	        	   content: "图不错！",
            	        	   url:"http://localhost:8080/truthbook/profile_test.html",
            	        	   meta: "yyyy-mm-dd",
            	        	   avatar: "./img/profile_test/247144.jpg"
            	           }
            	           ],
            	 like_num: 1  	 
              },
              {
            	  imgsrc:"http://lorempixel.com/319/596/",
            	  descript:"Sometimes its more important to have a dog you know you can trust. But not every dog is trustworthy, you can tell by looking at its smile.",
            	  meta:"yyyy-mm-dd",
            	  uploader: {
			      		 		userid:"2", 
			    		 		username:"李四", 
			    		 		url:"http://localhost:8080/truthbook/profile_test.html"
    		 				},
            	  comments:[
            	            {
            	            	userid: "1",
             	        	   	username: "张三",
             	        	   	content: "test...",
             	        	   	url:"http://localhost:8080/truthbook/profile_test.html",
             	        	   	meta: "yyyy-mm-dd",
             	        	   	avatar: "./img/profile_test/247142.jpg"
            	            }],
            	  like_num:2            		  
              },
              {
            	  imgsrc:"http://lorempixel.com/319/380/",
            	  descript:"Silly dogs can be quite fun to have as companions. You never know what kind of ridiculous thing they will do.",
            	  meta:"yyyy-mm-dd",
            	  uploader: {
			      		 		userid:"2", 
			    		 		username:"李四", 
			    		 		url:"http://localhost:8080/truthbook/profile_test.html"
    		 				},
            	  comments:[
            	            {
            	            	userid: "1",
             	        	   	username: "张三",
             	        	   	content: "test...",
             	        	   	url:"http://localhost:8080/truthbook/profile_test.html",
             	        	   	meta: "yyyy-mm-dd",
             	        	   	avatar: "./img/profile_test/247142.jpg"
            	            }],
            	  like_num:3            		  
              },              
              {
            	  imgsrc:"http://lorempixel.com/319/240/",
            	  descript:"Silly dogs can be quite fun to have as companions. You never know what kind of ridiculous thing they will do.",
            	  meta:"yyyy-mm-dd",
            	  uploader: {
			      		 		userid:"2", 
			    		 		username:"李四", 
			    		 		url:"http://localhost:8080/truthbook/profile_test.html"
    		 				},
            	  comments:[
            	            {
            	            	userid: "1",
             	        	   	username: "张三",
             	        	   	content: "test...",
             	        	   	url:"http://localhost:8080/truthbook/profile_test.html",
             	        	   	meta: "yyyy-mm-dd",
             	        	   	avatar: "./img/profile_test/247142.jpg"
            	            }],
            	  like_num:4            		  
              },
              {
            	  imgsrc:"http://lorempixel.com/319/720/",
            	  descript:"Silly dogs can be quite fun to have as companions. You never know what kind of ridiculous thing they will do.",
            	  meta:"yyyy-mm-dd",
            	  uploader: {
			      		 		userid:"2", 
			    		 		username:"李四", 
			    		 		url:"http://localhost:8080/truthbook/profile_test.html"
    		 				},
            	  comments:[
            	            {
            	            	userid: "1",
             	        	   	username: "张三",
             	        	   	content: "test...",
             	        	   	url:"http://localhost:8080/truthbook/profile_test.html",
             	        	   	meta: "yyyy-mm-dd",
             	        	   	avatar: "./img/profile_test/247142.jpg"
            	            }],
            	  like_num:5            		  
              },
              {
            	  imgsrc:"http://lorempixel.com/319/540/",
            	  descript:"Silly dogs can be quite fun to have as companions. You never know what kind of ridiculous thing they will do.",
            	  meta:"yyyy-mm-dd",
            	  uploader: {
			      		 		userid:"2", 
			    		 		username:"李四", 
			    		 		url:"http://localhost:8080/truthbook/profile_test.html"
    		 				},
            	  comments:[
            	            {
            	            	userid: "1",
             	        	   	username: "张三",
             	        	   	content: "test...",
             	        	   	url:"http://localhost:8080/truthbook/profile_test.html",
             	        	   	meta: "yyyy-mm-dd",
             	        	   	avatar: "./img/profile_test/247142.jpg"
            	            }],
            	  like_num:6            		  
              }               
             ];

$(document).ready(function() {
	//layout items 
	itemLayout(items);
	//initialize all items
	itemInitialize();

});

function itemInitialize(){
	//masonry initialization
	var $container=$("#eventsegment").masonry({
		itemSelector: '.item'
		});
	//After all images have loaded, rerange the masonry item
	$container.imagesLoaded( function() {
			$container.masonry();
		});
	//buttons on images show on/off
	$("#eventsegment .item .image").hover(function(){
		    $(this).children("a").fadeIn("fast");
		    $(this).children("img").fadeTo("fast",0.9);
				},
				function(){
		    $(this).children("a").fadeOut("fast");
		    $(this).children("img").fadeTo("fast",1);
			}
		);
	//遍历所有图片元素后为它们加上magnificPopup插件的初始化选项
	$num_items = $("#eventsegment").find(".image").children("img");
		for(var i=0, len=$num_items.length;i< len;i++){
	  		$($num_items[i]).magnificPopup({
				items: {
 					src:  $($num_items[i]).attr("src")
				},
				type: 'image'
		}); 
		};
	//show comments
	$(".ui.minimal.comments").click(function(){
		$(this).children(".ui.reply.form").show();
		$("#eventsegment").masonry();
	});
}

function itemLayout(items) {
	for(var i=0, len=items.length;i< len;i++){
		var item = items[i];
		var comment_num = item.comments.length;
		var comment='';
		for(var j=0;j< comment_num;j++){
			var comment_item = item.comments[j];
			comment += ("\t\t<div class='comment'>\n" +
							"\t\t\t<a class='avatar' href='"+comment_item.url+"'>" +
									"<img src='"+comment_item.avatar+"'></a>\n"+
							"\t\t\t<div class='content'>\n"+
							"\t\t\t\t<a class='author' href='"+comment_item.url+"'>"+comment_item.username+"</a>\n"+
							"\t\t\t\t<div class='metadata'><span class='date'>"+comment_item.meta+"</span></div>\n"+
							"\t\t\t\t<div class='text'>"+comment_item.content+"</div>\n"+
							"\t\t\t</div>\n"+
						"\t\t</div>\n");
		}
		$("#eventsegment").append(
				"<div class='item'>\n" +
					"\t<div class='image'>\n"+
						"\t\t<img src='"+item.imgsrc+"'>\n"+
						"\t\t<a><i class='heart empty icon'></i></a>\n"+
					"\t</div>\n"+
					"\t<div class = 'content'>\n"+
						"\t\t<p class='description'>"+item.descript+"</p>\n"+
						"\t\t<div class='meta'>"+"uploaded by <a class='uploader' href='"+item.uploader.url+"'>"+
							item.uploader.username+"</a> "+
							item.meta+"</div>\n"+
					"\t</div>\n"+
					"\t<div class='ui divider'></div>\n"+
					"\t<div class='ui minimal comments'>\n"+comment+
					"\t\t<form class='ui reply form' style='display:none'>\n"+
					"\t\t\t<div class='field'><textarea placeholder='你想说…'></textarea></div>\n"+
					"\t\t\t<div class='ui small teal button'>添加评论</div>\n"+
					"\t\t</form>\n"+
					"\t<div class='extra'>赞("+item.like_num+")</div>\n"+
				"</div>\n");
	}
}

