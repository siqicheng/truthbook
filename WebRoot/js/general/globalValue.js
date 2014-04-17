/*
 * # Truthbook Global Values JavaScript
 *
 */


/*********************************************************************************
 * 	Enable Json storage
 */
$(function (){
	$.cookie.json = true;
});


/*********************************************************************************
 * 	Website and RESTful AJAX URL
 */

//localhost = "172.13.0.47";
localhost = "localhost";
LoginPage = "http://"+localhost+":8080/truthbook/";
HomePage = "http://"+localhost+":8080/truthbook/profile_test.html";
DefaultImg = "img/logo_red.ico";
QuoteImg = "img/logo.ico";
ServerRoot = "http://" + localhost + ":8080/truthbook/services/";
ServiceType = {
    	   LOGIN:"loginService/",
    	   USERPROFILE :"userProfile/",
    	   NOTIFICATION :"push/",
    	   IMAGE:"imageService/",
       };

/*********************************************************************************
 * 	Global Numbers
 */

NEW_QUOTE = -1;
picReceiver = null;
upload_for_friend = false;
type_nFriends = 1;
type_eFriends = 2;

NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE = 3;

/*********************************************************************************
 * 	System Message Object
 */

MessageType = {
 	   INVITETOUPLOAD:{
 		   number : "0",
 		   typeName : "inviteToUpload",
 		   typeButtonOneName : "upload_for_fri_btn",
 		   typeButtonTwoName : "delete_message_btn",
 		   typeHeadMenuName : "条上传照片邀请"
 	   },
	   ADDFRIEND :{
		   number : "1",
		   typeName : "friendRequest",
		   typeButtonOneName : "add_fri_btn",
		   typeButtonTwoName : "later_fri_btn",
		   typeHeadMenuName : "条好友请求"
	   },
	   ACCEPTFRIEND :{
		   number : "2",
		   typeName : "acceptFriendRequest",
		   typeButtonOneName : "no_btn",
		   typeButtonTwoName : "delete_message_btn",
		   typeHeadMenuName : "位好友接受好友请求"
	   },
	   TAKEQUOTE :{
		   number : "3",
		   typeName : "takeQuote",
		   typeButtonOneName : "go_fri_btn",
		   typeButtonTwoName : "delete_message_btn",
		   typeHeadMenuName : "位好友认领了你新建的词条"
	   },
//	   ADDFRIEND :{
//	       number : "2",
//		   typeName : "friendRequest",
//		   typeButtonOneName : "add_fri_btn",
//		   typeButtonTwoName : "later_fri_btn",
//		   typeHeadMenuName : "条好友请求"
//	   },
//	   ADDFRIEND :{
//		   typeName : "friendRequest",
//		   typeButtonOneName : "add_fri_btn",
//		   typeButtonTwoName : "later_fri_btn",
//		   typeHeadMenuName : "条好友请求"
//	   }
};
