/*
 * # Truthbook Utility JavaScript
 *
 */

/*
 *	getAjaxObj
 *	Generate an object for AJAX call
 */
function getAjaxObj(url,type,dataType,onSuccess,onError,onComplete){
	var ajax_obj = new Object();
	ajax_obj.url = url;
	ajax_obj.type = type;
	ajax_obj.dataType = dataType;
	ajax_obj.onSuccess = onSuccess;
	ajax_obj.onError = onError;
	ajax_obj.onComplete = onComplete;
	return ajax_obj;
}
/*
 *	ajax_call
 *	Start an AJAX call
 */		
function ajax_call(ajax_obj){
	$.ajax({
		url: ajax_obj.url,
		type: ajax_obj.type,
		data: ajax_obj.data,
		dataType: ajax_obj.dataType,
		success: ajax_obj.onSuccess,
		error: ajax_obj.onError,
		complete: ajax_obj.onComplete
	});
}


