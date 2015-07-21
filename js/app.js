// oauthオブジェクト
var oauth;

var screenName = new Array();
var name_str = new Array();
var tweetText = new Array();
var id_str = new Array();
var prof_img_url = new Array();
var favorited = new Array();

var mention_screenName = new Array();
var mention_name_str = new Array();
var mention_tweetText = new Array();
var mention_id_str = new Array();
var mention_prof_img_url = new Array();
var mention_favorited = new Array();

localStorage.setItem("loading",0);



window.onload = function(){
	// OAuth関連の処理を開始する
	var loadingop = localStorage.getItem("loading");
	if(loadingop == 0){
		firstOAuthFunc();
	}

};


// OAuth処理 ///////////////////////////////////////////////////////////////////////////////
var firstOAuthFunc = function(){
	var firstoauth = localStorage.getItem("firstoauth");

	if(firstoauth == 1){
		localStorage.setItem("firstoauth",0);
		// 最初にOAuthオブジェクトに喰わせる値たち
		var ck = ckload();
		var cs = csload();
		var config = {
			consumerKey:ck,
			consumerSecret:cs,
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
			first_getMentionTimeline();
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
			localStorage.setTimeout("firstoauth", 0);
			return;
		}
	}

};

// 1の処理の成功時のコールバック関数
var successFetchRequestToken = function (authUrl) {

	//URLを訂正
	var tmp = authUrl.indexOf("&");
	var authUrl2 = authUrl.substring(0,tmp);


	// 2. リクエストトークンを使い、ユーザにアクセス許可を求めるURLを生成して ブラウザを起動
	// 3. ブラウザで認証を行い、ユーザーにPINが表示される
	//window.open(authUrl2);
	new MozActivity({
    	"name":"view",
    	"data":
      	{
        	"type":"url",
        	"url":authUrl2
    	}
	});

	// 4. アプリで用意したダイアログにPIN を入力してもらう
	var pin = prompt("Please enter your PIN", "");

	// oauthオブジェクトにPINをセット
	oauth.setVerifier(pin);

	// 5. consumer key, consumer secret, リクエストトークン, PIN を使って、アクセストークンを取得する
	oauth.fetchAccessToken(successFetchAccessToken, failureHandler);
};

// 5の処理の成功時のコールバック関数
var successFetchAccessToken = function () {
	localStorage.setItem("firstoauth", 0);
	localStorage.setItem("accessTokenKey", oauth.getAccessTokenKey());
	localStorage.setItem("accessTokenSecret", oauth.getAccessTokenSecret());
	localStorage.setItem("firstoauth",1);
	alert("success oauth");
	getHomeTimeline();

};


// 各処理失敗時のコールバック関数
var failureHandler = function (data) {
	localStorage.setItem("firstoauth",0);
	alert("failure");
};



//タイムラインに関する処理/////////////////////////////////////////////////////////////////
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

//通常メンション取得OAuth
var getMentionTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=100";
	oauth.get(url, successMention, failureTimeLineHandler);
};

//初回メンション取得OAuth
var first_getMentionTimeline = function(){
	var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=100";
	oauth.get(url, successFirstMention, failureTimeLineHandler);
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
	addFirstTweetToDom(tweet);
};

//初回タイムライン書き出し処理
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

//通常タイムライン書き出し処理
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


//メンションに関する処理//////////////////////////////////////////////////////////
//メンションの削除
var clearMentionTweetDom = function(){
	var parent = $("#mentionBox");
	parent.empty();
};

//初回メンション取得処理
var successFirstMention = function(data){
	clearMentionTweetDom();
	var tweetList = JSON.parse(data.text);
	mentionIndex: for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		for(var j = 0; j < mention_id_str.length; j++){
			var buf = mention_id_str[j];
			if(tweet.id_str == buf){
				break mentionIndex;
			}
		}
		mention_screenName.unshift(tweet.user.screen_name);
		mention_name_str.unshift(tweet.user.name);
		mention_tweetText.unshift(tweet.text);
		mention_id_str.unshift(tweet.id_str);
		mention_prof_img_url.unshift(tweet.user.profile_image_url);
		console.log("screenName:" + mention_screenName);
		console.log("name      :" + mention_name_str);
		console.log("tweetText :" + mention_tweetText);
		console.log("tweetID :" + mention_id_str);

	}
	addFirstMentionTweetToDom(tweet);
};

//初回メンション書き出し処理
var addFirstMentionTweetToDom = function(tweet){
	for(var i = mention_id_str.length - 1; i > 0; i--){
		var buf_screenName = mention_screenName[i];
		var buf_name = mention_name_str[i];
		var buf_tweetText = mention_tweetText[i];
		var buf_prof_img_url = mention_prof_img_url[i];
		var buf_id_str = mention_id_str[i];

		var $parent = $("#mentionBox");
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

//通常メンション取得処理
var successMention = function(data){
	clearMentionTweetDom();
	var tweetList = JSON.parse(data.text);
	var buf_screenName = new Array();
	var buf_name_str = new Array();
	var buf_tweetText = new Array();
	var buf_id_str = new Array();
	var buf_prof_img_url = new Array();
	mentionIndex1: for(var i = 0; i < tweetList.length; i++){
		var tweet = tweetList[i];
		for(var j = 0; j < id_str.length; j++){
			var buf = id_str[j];
			if(tweet.id_str == buf){
				break mentionIndex1;
			}
		}
		buf_screenName.push(tweet.user.screen_name);
		buf_name_str.push(tweet.user.name);
		buf_tweetText.push(tweet.text);
		buf_id_str.push(tweet.id_str);
		buf_prof_img_url.push(tweet.user.profile_image_url);
		console.log("screenName:" + mention_screenName);
		console.log("name      :" + mention_name_str);
		console.log("tweetText :" + mention_tweetText);
		console.log("tweetID :" + mention_id_str);

	}
	buf_screenName.reverse();
	buf_name_str.reverse();
	buf_tweetText.reverse();
	buf_id_str.reverse();
	buf_prof_img_url.reverse();

	for(var i = 0; i < buf_id_str.length; i++){
		mention_screenName.push(buf_screenName[i]);
		mention_name_str.push(buf_name_str[i]);
		mention_tweetText.push(buf_tweetText[i]);
		mention_id_str.push(buf_id_str[i]);
		mention_prof_img_url.push(buf_prof_img_url[i]);
	}
	addMentionTweetToDom(tweet);
};

//通常メンション書き出し処理
var addMentionTweetToDom = function(tweet){
	for(var i = mention_id_str.length - 1; i > 0; i--){
		var buf_screenName = mention_screenName[i];
		var buf_name = mention_name_str[i];
		var buf_tweetText = mention_tweetText[i];
		var buf_prof_img_url = mention_prof_img_url[i];
		var buf_id_str = mention_id_str[i];

		var $parent = $("#mentionBox");
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


//ポスト系の処理///////////////////////////////////////////////////////////
//ツイート
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

//リプツイ
var replyTweetPost = function(repId){
	var data;
	var statusText = document.getElementById("newTweetText").value;
	var file = document.querySelector("#file").files[0];
	if(typeof file === "undefined"){
		data={
			status:statusText
		};
		oauth.post('https://api.twitter.com/1.1/statuses/update.json?in_reply_to_status_id=' + repId, data, successHandler, failurePostHandler);
	}else{
		data={
			"status":statusText,
			"media[]":file
		};
		oauth.request({
			method:"POST",
			url:"https://api.twitter.com/1.1/statuses/update_with_media.json?in_reply_to_status_id=" + repId,
			data:data
		});
	}
};

/***ふぁぼ***/
var favoriteCreate = function(favId){
	oauth.request({
		method:"POST",
		url:"https://api.twitter.com/1.1/favorites/create.json?id=" + favId,
	});
};

//リプ
var replyCreate = function(repId, repName){
	$("#statusUpdateButton").attr('id', "replyUpdateButton").addClass(repId);
	$("#backButton").attr('id', "replyBackButton");
	document.form1.postform.value = "@" + repName + " ";
	document.querySelector('#newTweetSection').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
};

//リツイート
var rtCreate = function(rtId){
	oauth.request({
		method:"POST",
		url:"https://api.twitter.com/1.1/statuses/retweet/" + rtId + ".json",
	});
};




//エラー系のダイアログ処理/////////////////////////////////////////////////////
//成功時の出力ログ
var successHandler = function(){
	console.log("success");
};


var failureTimeLineHandler = function(data){
	alert("タイムラインの取得に失敗しました");
};

var failurePostHandler = function(data){
	alert("ツイートに失敗しました");
};

var nonerror = function(data){
};





