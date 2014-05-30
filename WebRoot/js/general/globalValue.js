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

isDebug = false;

/*********************************************************************************
 * 	Website and RESTful AJAX URL
 */


localhost = "localhost";
suffix = ":8080/truthbook";

//localhost = "truthbook.cc";
//suffix="";

LoginPage = "http://" + localhost + suffix + "/";
HomePage = "http://" + localhost + suffix + "/home.html";
TimeLinePage = "http://" + localhost + suffix + "/timeline.html";
ServerRoot = "http://" + localhost + suffix + "/services/";


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
globalTimeout = null;
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
DefaultPortrait="img/logo_red.ico";
DefaultQuotePortrait = "img/logo.ico";
DefaultPreviewImg="./img/picPreview.png";

maxItemNum = 8;//dropdown最多item数

NUM_FIRST_BATCH_IMAGE_ON_OWNPAGE =9;
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
//releaseTimeTotal = 60;
//releaseTime = releaseTimeTotal;
//
//function speedUpMessageListener(){
//	periodCheckNewMessage = 10000;
//}
//function speedDownMessageListener(){
//	periodCheckNewMessage = 30000;
//}

/*********************************************************************************
 * 	@ function global value
 */
atNotationFlag=0;
atNotationFlag_timeline=0;
MAX_FULLNAME_LENGTH = 8;
INS_FOR_ALL="all";

/*********************************************************************************
 * 	face
 */

FACE_1_Len = 15;

faceimagecode=["#1_0","#1_1","#1_2",
               "#1_3","#1_4","#1_5",
               "#1_6","#1_7","#1_8",
               "#1_9","#1_10","#1_11",
               "#1_12","#1_13","#1_14"];

faceimagecontent=["卖萌","吐血","呕吐",
         "头晕","得意","惊讶",
         "暴走","流泪","滴汗",
         "石化","碎觉","红心",
         "贱笑","雷劈","黑线"];
GUOJIA = "img/JiaGuo_face/";
faceimagename=[GUOJIA+"卖萌.jpg",GUOJIA+"吐血.jpg",GUOJIA+"呕吐.jpg",
               GUOJIA+"头晕.jpg",GUOJIA+"得意.jpg",GUOJIA+"惊讶.jpg",
               GUOJIA+"暴走.jpg",GUOJIA+"流泪.jpg",GUOJIA+"滴汗.jpg",
               GUOJIA+"石化.jpg",GUOJIA+"碎觉.jpg",GUOJIA+"红心.jpg",
               GUOJIA+"贱笑.jpg",GUOJIA+"雷劈.jpg",GUOJIA+"黑线.jpg",];

face = new Array();

for(var i=0;i<FACE_1_Len;i++){
	face[i] = new Object();
	face[i].code=faceimagecode[i];
	face[i].image=faceimagename[i];
	face[i].content=faceimagecontent[i];
}


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
		UNSEND : "unsent"
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
