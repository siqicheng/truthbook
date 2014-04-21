


function showMoreButtonHandler(){	
	$("#showMoreButton").click(function(){
//		$('#eventsegment').masonry('destroy');
//		drawNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		showNextBatchImage(NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE,$.cookie("truthbook_Page_Image_Num"));
		itemInitialize();
	});
	
}

/*********************************************************************************
 * 	In usage 2, search the whole images div and find the first hidden image
 * 				show the next numToShow image or the rest if the rest is few.
 * 	Return the number of the image left hidden.
 */
function showNextBatchImage(numToShow,numTotalImage){
	showLoadingButton();
	
	var currPointer = $.cookie("truthbook_Page_Image_Pointer"),
		nextEndPoint = numToShow + currPointer;
	if(currPointer>=numTotalImage){
		//ToDo: Launch another ajax call
		disableShowMoreButton();
		return;
	}
	for (;currPointer < nextEndPoint ;currPointer++){
		$("#eventsegment").children(".eventpile")[currPointer].style.display = "inline";
		if(currPointer == numTotalImage - 1){
			//ToDo: Launch another ajax call
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
