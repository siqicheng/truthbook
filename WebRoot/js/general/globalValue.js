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
 	   INVITETOUPLOAD:"/inviteToUpload",
	   ADDFRIEND :"/userProfile"			
};

HomePage = "http://"+localhost+":8080/truthbook/profile_test.html";

toId = -1;
selected_num = -1;
selected_bool = false;
type_nFriends = 1;
type_eFriends = 2;

$(function (){
	$.cookie.json = true;
});

LoginPage = "http://"+localhost+":8080/truthbook/";
//LoginPage = "http://localhost:8080/truthbook/";
DefaultImg = "img/logo_red.ico";