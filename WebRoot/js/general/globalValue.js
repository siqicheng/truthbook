/*
 * # Truthbook Global Values JavaScript
 *
 */

//localhost = "175.186.106.40";
localhost = "localhost";

ServerRoot = "http://" + localhost + ":8080/truthbook/services/";
ServiceType = {
            	   LOGIN:"loginService/",
            	   USERPROFILE :"userProfile/"
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
LoginPage = "http://localhost:8080/truthbook/";
DefaultImg = "img/logo_red.ico";