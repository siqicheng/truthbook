/*
 * # Truthbook Global Values JavaScript
 *
 */

//localhost = "172.13.0.47";
localhost = "localhost";

ServerRoot = "http://" + localhost + ":8080/truthbook/services/";
ServiceType = {
    	   LOGIN:"loginService/",
    	   USERPROFILE :"userProfile/",
    	   NOTIFICATION :"push/"
       };
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
//	   ADDFRIEND :{
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
//	   },
//	   ADDFRIEND :{
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

HomePage = "http://"+localhost+":8080/truthbook/profile_test.html";

NEW_QUOTE = -1;


picReceiver = null;
upload_for_friend = false;
type_nFriends = 1;
type_eFriends = 2;

$(function (){
	$.cookie.json = true;
});

LoginPage = "http://"+localhost+":8080/truthbook/";
DefaultImg = "img/logo_red.ico";
QuoteImg = "img/logo.ico";
