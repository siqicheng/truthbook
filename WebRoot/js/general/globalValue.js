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
 * 	Debug mode
 */

isDebug = true;

/*********************************************************************************
 * 	Website and RESTful AJAX URL
 */

//localhost = "175.186.104.114";
localhost = "localhost";
LoginPage = "http://"+localhost+":8080/truthbook/";
HomePage = "http://"+localhost+":8080/truthbook/profile_test.html";
TimeLinePage = "http://"+localhost+":8080/truthbook/timeline.html";
ServerRoot = "http://" + localhost + ":8080/truthbook/services/";
ServiceType = {
    	   LOGIN:"loginService/",
    	   USERPROFILE :"userProfile/",
    	   NOTIFICATION :"notification/",
    	   IMAGE:"imageService/",
    	   PORTRAIT:"portraitService/",
    	   COMMENT:"commentService/",
    	   TIMELINE:"feedService/"
       };

/*********************************************************************************
 * 	Global Numbers
 */

/*Global Variables in uploadPic*/
picReceiver = null;	//图片接收者
picData = undefined; //图片信息
upload_for_friend = false;//是否为好友上传
userFriendsLists = undefined;//user's Friends Lists
pageownerFriendsLists = undefined;//pageowner's Friends Lists

/*Global Static Variables*/
NEW_QUOTE = -1;      //新建词条
type_nFriends = 1;//真友类型
type_eFriends = 2;//极友类型

DefaultImg = "img/logo_red.ico";
DefaultPortrait="img/profile_test/247144.jpg";
DefaultQuotePortrait = "img/logo.ico";
DefaultPreviewImg="./img/profile_test/247146.jpg";

maxItemNum = 8;//dropdown最多item数

NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE =12;
NUM_NEXT_BATCH_IMAGE_ON_OWNPAGE = 6;

CONTROL = {
		Self:1,
		No:0
};

COMMENT = {
		No:0,
		Yes:1
};
MAX_MesssageToSend = 100;
DefaultThankYou="谢谢你为我传照片";

NUM_SHOW_COMMENT_ON_TIMELINE = 2;
NUM_FIRST_BATCH_ITEM_ON_TIMELINE = 5;
NUM_NEXT_BATCH_ITEM_ON_TIMELINE = 5;

periodCheckNewMessage = 20000;  //ms

/*********************************************************************************
 * 	Image style
 */

ImageType = {
		Large : "-Large",
		Medium : "-Medium",
		Small : "-Small",
		Origin : ""
};

/*********************************************************************************
 * 	System Message Object
 */

MESSAGESTATUS = {
		READ : "read",
		SENT : "sent",
		UNSEND : "unsend"
};

MessageType = {
	     INVITETOUPLOAD:{
	     number : "0",
	     typeName : "inviteToUpload",
	     typeButtonOneName : "upload_for_fri_btn_0",
	     typeButtonTwoName : "delete_message_btn_0",
	     typeHeadMenuName : "条上传照片邀请"
	     },
	   ADDFRIEND :{
	   number : "1",
	   typeName : "friendRequest",
	   typeButtonOneName : "add_fri_btn_1",
	   typeButtonTwoName : "later_fri_btn_1",
	   typeHeadMenuName : "条真·友请求"
	   },
	   ACCEPTFRIEND :{
	   number : "2",
	   typeName : "acceptFriendRequest",
	   typeButtonOneName : "no_btn_2",
	   typeButtonTwoName : "delete_message_btn_2",
	   typeHeadMenuName : "位新真·友"
	   },
	   TAKEQUOTE :{
	   number : "3",
	   typeName : "takeQuote",
	   typeButtonOneName : "go_fri_btn_3",
	   typeButtonTwoName : "delete_message_btn_3",
	   typeHeadMenuName : "个词条被认领"
	   },
	   REJECTIMAGE :{
		   number : "4",
		   typeName : "rejectImage",
		   typeButtonOneName : "upload_for_fri_btn_4",
		   typeButtonTwoName : "delete_message_btn_4",
		   typeHeadMenuName : "张照片被拒了"
	   },
	   ACCEPTIMAGE :{
		   number : "5",
		   typeName : "acceptImage",
		   typeButtonOneName : "upload_for_fri_btn_5",
		   typeButtonTwoName : "delete_message_btn_5",
		   typeHeadMenuName : "张照片被接受"
	   },
	   REPLY :{
		   number : "6",
		   typeName : "reply",
		   typeButtonOneName : "go_fri_btn_6",
		   typeButtonTwoName : "delete_message_btn_6",
		   typeHeadMenuName : "条新回复"
	   },
	   UPGRADE :{
		   number : "7",
		   typeName : "upgrade",
		   typeButtonOneName : "no_btn_7",
		   typeButtonTwoName : "delete_message_btn_7",
		   typeHeadMenuName : "位真·友升级"
	   },
};
