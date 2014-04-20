$(function () {
//	$("#uploadBtn").bind("change", function(e) {
//	$("#uploadBtn").click(function(e) {
//		$('#fileupload').fileupload('add', {
//			fileInput: $(this)
//		});
//	});
	    $('#fileupload').fileupload({
	    	
	        dataType: 'json',
	        
	        add: function(e, data) {
//	        	data.context = $('<button/>').text('Upload')
//                .appendTo(document.body)
//                .click(function () {
//                    data.context = $('<p/>').text('Uploading...').replaceAll($(this));
//                    data.submit();
//                });
	        	$('#uploadBtn').unbind();
	        	$("#uploadBtn").click(function() {data.submit();});
	        },
	        
	        submit: function(e, data) {
	        	data.formData = [
	        	                  {
	        	                      name: 'userid',
	        	                      value: "73"
	        	                  },
	        	                  {
	        	                      name: 'receiverid',
	        	                      value: "72"
	        	                  }
	        	              ];
	        	console.log(data.formData);
//	        	return false;
	        },
	        
	        done: function (e, data) {
	        	$("tr:has(td)").remove();
	            $.each(data.result, function (index, file) {
	                $("#uploaded-files").append(
	                		$('<tr/>')
	                		.append($('<td/>').text(file.fileName))
	                		.append($('<td/>').text(file.fileSize))
	                		.append($('<td/>').text(file.fileType))
	                		.append($('<td/>').html("<a href='upload?f="+index+"'>Click</a>"))
	                		.append($('<td/>').text("@"+file.twitter))
	
	                		)//end $("#uploaded-files").append()
	            }); 
	        },
	        
	        progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#progress .bar').css(
		            'width',
		            progress + '%'
		        );
	   		},
	   		
			dropZone: $('#dropzone')
	    }).bind('fileuploadsubmit', function (e, data) {
	        // The example input, doesn't have to be part of the upload form:
	        var twitter = $('#twitter');
	        data.formData = {twitter: twitter.val()};        
	    });
//	});
});