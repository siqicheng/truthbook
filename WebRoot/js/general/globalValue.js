/*
 * # Truthbook Global Values JavaScript
 *
 */

ServerRoot = "http://localhost:8080/truthbook/services/";
ServiceType = {
            	   LOGIN:"loginService/",
            	   USERPROFILE :"userProfile/"
               };
HomePage = "http://localhost:8080/truthbook/profile_test.html";

toId = -1;
selected_bool = false;

$(function (){
	$.cookie.json = true;
});

LoginPage = "http://localhost:8080/truthbook/";
DefaultImg = "img/logo_red.ico";