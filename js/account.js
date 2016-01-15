//ユーザー情報の取得////////////////////////////////////////////////////////
//ユーザー情報取得OAuth
var clearUserData = function () {
	document.getElementById("userimage").setAttribute("src", "");
	document.getElementById("username").innerHTML = "";
	document.getElementById("userscreenname").innerHTML = "";
	document.getElementById("userdescription").innerHTML = "";
        document.getElementById("userlocation").innerHTML = "";
        document.getElementById("userurl").innerHTML = "";
        document.getElementById("userdata").style.backgroundImage = "url()";
};

var getUserData = function (screenName) {
	var url = "https://api.twitter.com/1.1/users/show.json?screen_name=" + screenName;
	oauth.get(url, successGetUserData, failureGetUserDataHandler);
};

var successGetUserData = function (data) {
	var userdata = JSON.parse(data.text);
	try{ document.getElementById("userimage").setAttribute("src", userdata.profile_image_url_https); }catch(e){}
	try{ document.getElementById("username").innerHTML = userdata.name; }catch(e){}
	try{ document.getElementById("userscreenname").innerHTML = "@" + userdata.screen_name; }catch(e){}
        try{ document.getElementById("userdescription").innerHTML = userdata.description; }catch(e){}
        try{ document.getElementById("userlocation").innerHTML = userdata.location; }catch(e){}
        try{ document.getElementById("userurl").setAttribute("href", userdata.entities.url.urls[0].expanded_url); }catch(e){}
        try{ document.getElementById("userurl").innerHTML = userdata.entities.url.urls[0].expanded_url; }catch(e){}
        try{ document.getElementById("userdata").style.backgroundImage = "url("+userdata.profile_banner_url+"/web"+")"; }catch(e){}

        if(userdata.following == true){
                document.getElementById("userfollow").innerHTML = "フォロー中";
        } else {
                document.getElementById("userfollow").innerHTML = "フォローする";
        }
};

var my_account = function (data) {
        var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
        oauth.get(url, function (data) {
                var userdata = JSON.parse(data.text);
                my_id = userdata.id;
                my_name = userdata.name;
                my_screenName = userdata.screen_name;
                my_description = userdata.description;
                my_location = userdata.location;
                my_url = userdata.entities.url.urls[0].expanded_url;
        }, nonerror);
};

