function drawConfirmPopUp(messageToShow){
	$("#alertMessage").html(messageToShow);
	$('.page.dimmer.message')
	  .dimmer('setting',{
				  closable: true,
				  onHide: function(){
				      return false;
				  },
				  duration: {
			  			show : 500,
			  			hide : 700
				  }
			  })
	 .dimmer('show');
}

function drawConfirmPopUp_dummyDimmerForExtention(messageToShow){
	$("#dummyDimmerForExtention").html(messageToShow);
	$('.page.dimmer.dummyDimmerForExtention')
	  .dimmer('setting',{
				  closable: true,
				  onHide: function(){
				      return false;
				  },
				  duration: {
			  			show : 500,
			  			hide : 700
				  }
			  })
	 .dimmer('show');
}
	

function handleLogoutPopUp(){
	$( "#exitButton" ).click(function() {
		$('.basic.modal.logout')
	   	.modal('setting', {
	   		closable: true,
	   		onApprove : function() {
		    	cleanUserInfoCookie();
		    	goLogin();
		    }
	   	})
	   	.modal('show');
	});
}

function confirmDeleteFriendPopUp(){
	$('.basic.modal.deleteFriend')
   	.modal('setting', {
   		closable: true,
   		onApprove : function() {
			deleteFriendByTmpButton();
	    }
   	})
   	.modal('show');
}

function testModalPopup(header, content, negativeBtn, negativeBtnHidden, positiveBtn, positiveBtnHidden, onApproveFunction, onDenyFunction, logo){
	$("#modalHeader").html(header);
	$("#modalContent").html(content);
	$("#modalNegativeBtn").html(negativeBtn);
	$("#modalNegativeBtnHidden").html(negativeBtnHidden);
	$("#modalPositiveBtn").html(positiveBtn);
	$("#modalPositiveBtnHidden").html(positiveBtnHidden);
	$("#modalLogo").attr("class",logo + " icon");
	$("#testModal").modal("setting", {
		closable:true,
		onApprove : onApproveFunction,
		onDeny : onDenyFunction
	})
	.modal("show");
}