// oauthオブジェクト
var oauth;
var screenName = new Array();
var name_str = new Array();
var tweetText = new Array();
var id_str = new Array();
var prof_img_url = new Array();

window.onload = function(){
	$("#newPostButton").click(function(){
		document.querySelector('#newTweetSection').className = 'current';
		document.querySelector('[data-position="current"]').className = 'left';
	});
	$("#backButton").click(function(){
		document.querySelector('#newTweetSection').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});	
	$("#updateButton").click(function(){
		getHomeTimeline();
	});
	$("#statusUpdateButton").click(function(){
		newTweetPost();
		document.form1.postform.value = "";
		document.form2.my_file.value = "";
		document.querySelector('#newTweetSection').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';

	});
	$("#clearImage").click(function(){
		document.form2.my_file.value = "";
	});

	// OAuth関連の処理を開始する
	firstOAuthFunc();


};

var clearTweetDom = function(){
	var parent = $("#tweetBox");
	parent.empty();
};
var getHomeTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=100";
	oauth.get(url, successGetHomeTimeline, failureTimeLineHandler);
};

var first_getHomeTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=100";
	oauth.get(url, successFirstTimeline, failureTimeLineHandler);
};

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
		console.log("name      :" + name);
		console.log("tweetText :" + tweetText);
		console.log("tweetID :" + id_str);

	}
	addFirstTweetToDom(tweet);
};
var addFirstTweetToDom = function(tweet){
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

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
	}

};

var successGetHomeTimeline = function(data){
	clearTweetDom();
	var tweetList = JSON.parse(data.text);
	var buf_screenName = new Array();
	var buf_name_str = new Array();
	var buf_tweetText = new Array();
	var buf_id_str = new Array();
	var buf_prof_img_url = new Array();
	tweetIndex: for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		for(var j = 0; j < id_str.length; j++){
			var buf = id_str[j];
			if(tweet.id_str == buf){
				break tweetIndex;
			}
		}
		buf_screenName.push(tweet.user.screen_name);
		buf_name_str.push(tweet.user.name);
		buf_tweetText.push(tweet.text);
		buf_id_str.push(tweet.id_str);
		buf_prof_img_url.push(tweet.user.profile_image_url);
		console.log("screenName:" + screenName);
		console.log("name      :" + name);
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

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
	}

};
var newTweetPost = function(){
	var data;
	var statusText = document.getElementById("newTweetText").value;
	var file = document.querySelector("#file").files[0];
	if(typeof file === "undefined"){
		data={
			status:statusText
		};
		oauth.post('https://api.twitter.com/1.1/statuses/update.json', data, successHandler, failurePostHandler);
	}else{
		data={
			"status":statusText,
			"media[]":file
		};
		oauth.request({
			method:"POST",
			url:"https://api.twitter.com/1.1/statuses/update_with_media.json",
			data:data
		});
	}
};
var successHandler = function(){
	console.log("success");
};

/**
* OAuth関連で最初に行う処理
*/
var firstOAuthFunc = function(){
	var firstoauth = localStorage.getItem("firstoauth");

	if(firstoauth == 1){
		localStorage.setItem("firstoauth",0);
		// 最初にOAuthオブジェクトに喰わせる値たち
		var config = {
			consumerKey:"コンシューマーキー",
			consumerSecret:"シークレットキー",
			requestTokenUrl:"https://api.twitter.com/oauth/request_token",
			authorizationUrl:"https://api.twitter.com/oauth/authorize",
			accessTokenUrl:"https://api.twitter.com/oauth/access_token"
		};

		// OAuthのオブジェクトを作成
		oauth = new OAuth(config);

		//保存してあるアクセストークンがあればロードする

		var accessTokenKey = localStorage.getItem("accessTokenKey");
		var accessTokenSecret = localStorage.getItem("accessTokenSecret");
		localStorage.setItem("firstoauth", 1);
		if(accessTokenKey){
			oauth.setAccessToken(accessTokenKey, accessTokenSecret);
			first_getHomeTimeline();
		}else{
			// 1. consumer key と consumer secret を使って、リクエストトークンを取得する
			oauth.fetchRequestToken(successFetchRequestToken, failureHandler);
		}

	}else{

		if(window.confirm('Twitterで認証を行ってください')){
			localStorage.setItem("firstoauth", 1);

			firstOAuthFunc();
		}else{
			window.alert('中止されました');
			return;
		}
	}

};

/**
* 1の処理の成功時のコールバック関数
*/
var successFetchRequestToken = function (authUrl) {

	//URLを訂正
	var tmp = authUrl.indexOf("&");
	var authUrl2 = authUrl.substring(0,tmp);


	// 2. リクエストトークンを使い、ユーザにアクセス許可を求めるURLを生成して ブラウザを起動
	// 3. ブラウザで認証を行い、ユーザーにPINが表示される
	window.open(authUrl2);

	// 4. アプリで用意したダイアログにPIN を入力してもらう
	var pin = prompt("Please enter your PIN", "");

	// oauthオブジェクトにPINをセット
	oauth.setVerifier(pin);

	// 5. consumer key, consumer secret, リクエストトークン, PIN を使って、アクセストークンを取得する
	oauth.fetchAccessToken(successFetchAccessToken, failureHandler);
};

/**
* 5の処理の成功時のコールバック関数
*/
var successFetchAccessToken = function () {
	localStorage.setItem("accessTokenKey", oauth.getAccessTokenKey());
	localStorage.setItem("accessTokenSecret", oauth.getAccessTokenSecret());
	localStorage.setItem("firstoauth",1);
	alert("success oauth");
	getHomeTimeline();

};

/**
* 各処理失敗時のコールバック関数
*/
var failureHandler = function (data) {
	localStorage.setItem("firstoauth",0);
	alert("failure");
};

var failureTimeLineHandler = function(data){
	alert("failed to get the timeline");
};

var failurePostHandler = function(data){
	alert("Post failed");
};

/***ふぁぼ***/
var favoriteCreate = function(){
	oauth.request({
		method:"POST",
		url:"https://api.twitter.com/1.1/favorites/create.json?id="+"id_str",
	});
};



