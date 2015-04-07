// oauthオブジェクト
var oauth;

var screenName = new Array();
var name_str = new Array();
var tweetText = new Array();
var id_str = new Array();
var prof_img_url = new Array();
var favorited = new Array();
var repId;


window.onload = function(){
	// OAuth関連の処理を開始する
	var loadingop = localStorage.getItem("loading");
	if(loadingop == 0){
		firstOAuthFunc();
		first_getHomeTimeline();
		localStorage.setItem("loading", 1);
	}else{
		addTweetToDom();
	}

};

//タイムラインの削除
var clearTweetDom = function(){
	var parent = $("#tweetBox");
	parent.empty();
};

//通常タイムライン取得OAuth
var getHomeTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=100";
	oauth.get(url, successGetHomeTimeline, failureTimeLineHandler);
};

//初回タイムライン取得OAuth
var first_getHomeTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=100";
	oauth.get(url, successFirstTimeline, failureTimeLineHandler);
};

//ユーザー情報取得OAuth
var get_users = function(){
	var url = "https://api.twitter.com/1.1/users/show.json";
	oauth.get(url, successGetUser, faulureGetUser);
};


//初回タイムライン取得データ処理
var successFirstTimeline = function(data){
	clearTweetDom();
	var tweetList = JSON.parse(data.text);
	tweetIndex: for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		for(var j = 0; j < id_str.length; j++){
			var buf = id_str[j];
			if(tweet.id_str == buf){
				break tweetIndex;
			}
		}
		screenName.unshift(tweet.user.screen_name);
		name_str.unshift(tweet.user.name);
		tweetText.unshift(tweet.text);
		id_str.unshift(tweet.id_str);
		prof_img_url.unshift(tweet.user.profile_image_url);
		console.log("screenName:" + screenName);
		console.log("name      :" + name_str);
		console.log("tweetText :" + tweetText);
		console.log("tweetID :" + id_str);

	}
	addTweetToDom(tweet);
};


//通常ライムライン取得データ処理
var successGetHomeTimeline = function(data){
	clearTweetDom();
	var tweetList = JSON.parse(data.text);
	var buf_screenName = new Array();
	var buf_name_str = new Array();
	var buf_tweetText = new Array();
	var buf_id_str = new Array();
	var buf_prof_img_url = new Array();

	tweetIndex1: for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		for(var j = 0; j < id_str.length; j++){
			var buf = id_str[j];
			if(tweet.id_str == buf){
				break tweetIndex1;
			}
		}
		buf_screenName.push(tweet.user.screen_name);
		buf_name_str.push(tweet.user.name);
		buf_tweetText.push(tweet.text);
		buf_id_str.push(tweet.id_str);
		buf_prof_img_url.push(tweet.user.profile_image_url);
		console.log("screenName:" + screenName);
		console.log("name      :" + name_str);
		console.log("tweetText :" + tweetText);
		console.log("tweetID :" + id_str);

	}
	buf_screenName.reverse();
	buf_name_str.reverse();
	buf_tweetText.reverse();
	buf_id_str.reverse();
	buf_prof_img_url.reverse();

	for(var i = 0; i < buf_id_str.length; i++){
		screenName.push(buf_screenName[i]);
		name_str.push(buf_name_str[i]);
		tweetText.push(buf_tweetText[i]);
		id_str.push(buf_id_str[i]);
		prof_img_url.push(buf_prof_img_url[i]);
	}
	addTweetToDom(tweet);
};

//タイムライン書き出し処理
var addTweetToDom = function(tweet){
	for(var i = id_str.length - 1; i > 0; i--){
		var buf_screenName = screenName[i];
		var buf_name = name_str[i];
		var buf_tweetText = tweetText[i];
		var buf_prof_img_url = prof_img_url[i];
		var buf_id_str = id_str[i];

		var $parent = $("#tweetBox");
		var $li = $("<li>").appendTo($parent);
		var $div = $("<div>").addClass("tweet").appendTo($li);
		var $userDiv = $("<div>").appendTo($div);
		var $a1 = $("<a>").attr('href', "#drawer").appendTo($userDiv);

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<img>").addClass("menu-button").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', "img/icons/menu-button.png").appendTo($a1);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
	}
	$(".tweetText").each(function(){
		$(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
	});

};
