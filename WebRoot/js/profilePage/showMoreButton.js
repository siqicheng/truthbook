


function showMoreButtonHandler(){	
	$("#showMoreButton").click(function(){
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE);
		itemInitialize("#eventsegment");
	});
	
}

/*********************************************************************************
 * 	In usage 2, search the whole images div and find the first hidden image
 * 				show the next numToShow image or the rest if the rest is few.
 * 	Return the number of the image left hidden.
 */
function showNextBatchImage(numToShow){
	if($.cookie("truthbook").userId == $.cookie("truthbook_PageOwner_userId").userId){
		var Control = CONTROL.Self;
	}else{
		var Conrtol = CONTROL.No;
	}
	var Comment = COMMENT.Yes;
	
	showLoadingButton();
	
	var currPointer = $.cookie("truthbook_Page_Image_Pointer"),
		nextEndPoint = numToShow + currPointer;
	if(currPointer>=numApprovedImage){
		//ToDo: Launch another ajax call
		disableShowMoreButton();
		return;
	}
	for (;currPointer < nextEndPoint ;currPointer++){	
		var element = prepareElement(approvedImage[currPointer],true,Control,Comment);
		$("#eventsegment").masonry( 'appended', element );
		
		if(currPointer == numApprovedImage - 1){
			//ToDo: Launch another ajax call
			$.cookie("truthbook_Page_Image_Pointer", numApprovedImage);
			disableShowMoreButton();
			return;
		}
	}
	$.cookie("truthbook_Page_Image_Pointer", currPointer);
	showRefreshButton();
	return;
}


function disableShowMoreButton(){
	$("#showMoreButton").hide();
}

function showRefreshButton(){
	$("#showMoreButton").children(".basic.fluid.button").html("<i class=\"double angle down large icon\"></i>");
}

function showLoadingButton(){
	$("#showMoreButton").children(".basic.fluid.button").html("<i class=\"loading large icon\"></i>");
}
