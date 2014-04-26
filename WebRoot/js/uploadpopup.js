//$(document).ready(function() {  			
//	$("#uploadPic").magnificPopup({
//		items: { src:'./uploadpic.html'},
//  		type: 'ajax',
// 		modal: true,
//  		callbacks: {
//  			parseAjax: function(mfpResponse) {
//  				//close the modal link
//  				var $modaldismiss = $("<a class='popup-modal-dismiss ui corner label' href='#'><i class='remove icon'></i></a>");
////  				var $uploadfriend = $("<a class='open-popup-link' id='uploadFriend' href='#'>已经是好友？</a>");
//  				mfpResponse.data = $(mfpResponse.data).find("#uploadform").addClass("white-popup")
//  									.append($modaldismiss);//.append($uploadfriend);
//  				console.log('Ajax content loaded:', mfpResponse);
//  			},
//  			ajaxContentAdded: function() {//after all Ajax elements has been added
//
//  			}
//  		}
//  	});
//
//
//  	
//});
//
//$("#uploadFriend").magnificPopup({
////		items: { src:'./uploadpic.html'},
//  		type: 'ajax',
// 		modal: true,
//  		callbacks: {
//  			parseAjax: function(mfpResponse) {
//  				//close the modal link
//  				var $modaldismiss = $("<a class='popup-modal-dismiss ui corner label' href='#'><i class='remove icon'></i></a>");
//  				var $uploadfriend = $("<a class='open-popup-link' id='uploadFriend'>已经是好友？</a>");
//  				mfpResponse.data = $(mfpResponse.data).find("#uploadform").addClass("white-popup")
//  									.append($modaldismiss).append($uploadfriend);
//  				console.log('Ajax content loaded:', mfpResponse);
//  			},
//  			ajaxContentAdded: function() {//after all Ajax elements has been added
//  				document.querySelector('#fileSelect').addEventListener('click', function(e) {
//  					//bind the click action to the hidden file upload button
//  					document.querySelector('#fileElem').click();
//				}, false);
//  			}
//  		}
//  	});

//close the modal
$(document).on('click', '.popup-modal-dismiss', function (e) {
	e.preventDefault();
	$.magnificPopup.close();
});	

