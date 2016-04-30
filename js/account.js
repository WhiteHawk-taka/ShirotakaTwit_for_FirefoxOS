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

  //アイコンを高解像度化
  if (iconimagebigger == 1) {
    var img_tmp = userdata.profile_image_url_https.substring(0, userdata.profile_image_url_https.indexOf("normal"));
    var fileextension = userdata.profile_image_url_https.slice(userdata.profile_image_url_https.lastIndexOf("."));
    var profile_image_url_https2 = img_tmp + "bigger" + fileextension;
  } else {
    var profile_image_url_https2 = userdata.profile_image_url_https;
  }

  try { document.getElementById("userimage").setAttribute("src", profile_image_url_https2); } catch (e) {}
  try { document.getElementById("username").innerHTML = userdata.name; } catch (e) {}
  try { document.getElementById("userscreenname").innerHTML = "@" + userdata.screen_name; } catch (e) {}
  try { document.getElementById("userdescription").innerHTML = userdata.description; } catch (e) {}
  try { document.getElementById("userlocation").innerHTML = userdata.location; } catch (e) {}
  try { document.getElementById("userurl").setAttribute("href", userdata.entities.url.urls[0].expanded_url); } catch (e) {}
  try { document.getElementById("userurl").innerHTML = userdata.entities.url.urls[0].expanded_url; } catch (e) {}
  try { document.getElementById("userdata").style.backgroundImage = "url("+userdata.profile_banner_url+"/web"+")"; } catch (e) {}

  try { document.getElementById("tweetstatus").innerHTML = "ツイート数" + "<br>" + userdata.statuses_count } catch (e) {}
  try { document.getElementById("following").innerHTML = "フォロー" + "<br>" + userdata.friends_count } catch (e) {}
  try { document.getElementById("follower").innerHTML = "フォロワー" + "<br>" + userdata.followers_count } catch (e) {}

  if (userdata.following == true) {
    document.getElementById("userfollow").innerHTML = "フォロー中";
  } else {
    document.getElementById("userfollow").innerHTML = "フォローする";
  }
};

//フォロー
var userfollow = function (screenName) {
  var url = "https://api.twitter.com/1.1/friendships/create.json?screen_name=" + screenName;
  oauth.post(url, "", successUserfollow, nonerror);
};

var successUserfollow = function (data) {
  document.getElementById("userfollow").innerHTML = "フォロー中";
};

//アンフォロー

var userremove = function (screenName) {
  var url = "https://api.twitter.com/1.1/friendships/destroy.json?screen_name=" + screenName;
  oauth.post(url, "", successUserremove, nonerror);
};

var successUserremove = function (data) {
  document.getElementById("userfollow").innerHTML = "フォローする";
};

//自分の情報
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

