$(document).ready(function() {  			
	$("#uploadPic").magnificPopup({
		items: { src:'./uploadpic.html'},
  		type: 'ajax',
 		modal: true,
  		callbacks: {
  			parseAjax: function(mfpResponse) {
  				//close the modal link
  				var $modaldismiss = $("<a class='popup-modal-dismiss ui corner label' href='#'><i class='remove icon'></i></a>");
//  				var $uploadfriend = $("<a class='open-popup-link' id='uploadFriend' href='#'>已经是好友？</a>");
  				mfpResponse.data = $(mfpResponse.data).find("#uploadform").addClass("white-popup")
  									.append($modaldismiss);//.append($uploadfriend);
  				console.log('Ajax content loaded:', mfpResponse);
  			},
  			ajaxContentAdded: function() {//after all Ajax elements has been added

  			}
  		}
  	});


  	
});

$("#uploadFriend").magnificPopup({
//		items: { src:'./uploadpic.html'},
  		type: 'ajax',
 		modal: true,
  		callbacks: {
  			parseAjax: function(mfpResponse) {
  				//close the modal link
  				var $modaldismiss = $("<a class='popup-modal-dismiss ui corner label' href='#'><i class='remove icon'></i></a>");
  				var $uploadfriend = $("<a class='open-popup-link' id='uploadFriend'>已经是好友？</a>");
  				mfpResponse.data = $(mfpResponse.data).find("#uploadform").addClass("white-popup")
  									.append($modaldismiss).append($uploadfriend);
  				console.log('Ajax content loaded:', mfpResponse);
  			},
  			ajaxContentAdded: function() {//after all Ajax elements has been added
  				document.querySelector('#fileSelect').addEventListener('click', function(e) {
  					//bind the click action to the hidden file upload button
  					document.querySelector('#fileElem').click();
				}, false);
  			}
  		}
  	});

//close the modal
$(document).on('click', '.popup-modal-dismiss', function (e) {
	e.preventDefault();
	$.magnificPopup.close();
});	

//获取本地图片路径，并显示在预览框中
function readURL(input) {
    if (input.files && input.files[0]) {
    	$('#img_prev').show();
        var reader = new FileReader();
        reader.onload = function (e) { $('#img_prev').attr('src', e.target.result).css({"max-width":"650px"}); };
        reader.readAsDataURL(input.files[0]);
        $('#submitBtn').removeClass("disabled");
    } else {
        //IE情况
        var docObj = document.getElementByIdx_x('fileElem');
        docObj.select();
        //解决IE9下document.selection拒绝访问的错误
        docObj.blur();
        var imgSrc = document.selection.createRange().text;
        var img_prevId = document.getElementByIdx_x("img_prev");
        $('#img_prev').width(150).height(200); //必须设置初始大小
        //图片异常的捕捉，防止用户修改后缀来伪造图片
        try {
            img_prevId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            img_prevId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        } catch (e) {
            alert("您上传的图片格式不正确，请重新选择!"); return false;
        }
        $('#img_prev').hide();
        document.selection.empty();
    }
};