// oauthオブジェクト
var oauth;

window.onload = function () {
	$("#newPostButton").click(function(){
		document.querySelector('#newTweetSection').className = 'current';
		document.querySelector('[data-position="current"]').className = 'left';
	});
	$("#backButton").click(function(){
		document.querySelector('#newTweetSection').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});	
	$("#updateButton").click(function(){
		clearTweetDom();
		getHomeTimeline();
	});
	$("#statusUpdateButton").click(function(){
		newTweetPost();
	});


	// OAuth関連の処理を開始する
	firstOAuthFunc();

};

var clearTweetDom = function(){
	var parent = $("#tweetBox");
	parent.empty();
};
var getHomeTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/home_timeline.json";
	oauth.get(url, successGetHomeTimeline, failureHandler);
};
var successGetHomeTimeline = function(data){
	var tweetList = JSON.parse(data.text);
	for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		var screenName = tweet.user.screen_name;
		var name = tweet.user.name;
		var tweetText = tweet.text;
		console.log("screenName:" + screenName);
		console.log("name      :" + name);
		console.log("tweetText :" + tweetText);
		addTweetToDom(tweet);

	}
};
var addTweetToDom = function(tweet){
	var screenName = tweet.user.screen_name;
	var name = tweet.user.name;
	var tweetText = tweet.text;
	var prof_img_url = tweet.user.profile_image_url;

	var $parent = $("#tweetBox");
	var $li = $("<li>").appendTo($parent);
	var $div = $("<div>").addClass("tweet").appendTo($li);
	var $userDiv = $("<div>").appendTo($div);

	$("<img>").addClass("tweetIcon").attr('src', prof_img_url).appendTo($userDiv);
	$("<span>").addClass("name").text(name).appendTo($userDiv);
	$("<span>").addClass("screenName").text("@" + screenName).appendTo($userDiv);
	$("<div>").addClass("tweetText").text(tweetText).appendTo($div);

};
var newTweetPost = function(){
	var data;
	var statusText = document.getElementById("newTweetText").value;
	data={
		status:statusText
	};
	oauth.post('https://api.twitter.com/1.1/statuses/update.json', data, successHandler, failureHandler);
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

		if(accessTokenKey){
			oauth.setAccessToken(accessTokenKey, accessTokenSecret);
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

setTimeout("",60000);

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
	alert("failure");
};



