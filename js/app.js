// oauthオブジェクト
var oauth;

var my_name = "";
var my_screenName = "";
var my_id = "";
var my_description = "";
var my_location = "";
var my_url = "";

var screenName = [];
var name_str = [];
var tweetText = [];
var id_str = [];
var prof_img_url = [];
var favorited = [];
var photo_url = [[],[],[],[]];

var post_imagefile = [];
var tweet_media = [];
var post_tweettext = "";
var post_repId = "";

var mention_screenName = [];
var mention_name_str = [];
var mention_tweetText = [];
var mention_id_str = [];
var mention_prof_img_url = [];
var mention_favorited = [];
var mention_photo_url = [[],[],[],[]];

var getTweetNumber = "";


window.onload = function () {
        //設定の初期化
        try{
                getTweetNumber = localStorage.getItem("getTweetNumber");
        }catch(e){
                getTweetNumber = 100;
        }
        // OAuth関連の処理を開始する
        localStorage.setItem("firstoauth", 0);
        firstOAuthFunc();
};

// OAuth処理 ///////////////////////////////////////////////////////////////////////////////
var firstOAuthFunc = function () {
        if(localStorage.getItem("accessTokenKey")){
                localStorage.setItem("firstoauth", 1);
        }else{
        }
        var firstoauth = localStorage.getItem("firstoauth");

        if (parseInt(firstoauth,10) === 1) {
                localStorage.setItem("firstoauth", 0);
                // 最初にOAuthオブジェクトに喰わせる値たち
                var ck = ckload();
                var cs = csload();
                var config = {
                        consumerKey: ck,
                        consumerSecret: cs,
                        requestTokenUrl: "https://api.twitter.com/oauth/request_token",
                        authorizationUrl: "https://api.twitter.com/oauth/authorize",
                        accessTokenUrl: "https://api.twitter.com/oauth/access_token"
                };

                // OAuthのオブジェクトを作成
                oauth = new OAuth(config);

                //保存してあるアクセストークンがあればロードする
                var accessTokenKey = localStorage.getItem("accessTokenKey");
                var accessTokenSecret = localStorage.getItem("accessTokenSecret");
                localStorage.setItem("firstoauth", 1);
                if (accessTokenKey) {
                        oauth.setAccessToken(accessTokenKey, accessTokenSecret);
                        if(location.pathname === "/index.html"){
                                first_getHomeTimeline();
                        }else if(location.pathname === "/mention.html"){
                                first_getMentionTimeline();
                        }else{
                                first_getHomeTimeline();
                        }
                        my_account();
                } else {
                        // 1. consumer key と consumer secret を使って、リクエストトークンを取得する
                        oauth.fetchRequestToken(successFetchRequestToken, failureHandler);
                }

        } else {

                if (window.confirm('Twitterで認証を行ってください')) {
                        localStorage.setItem("firstoauth", 1);

                        firstOAuthFunc();
                } else {
                        window.alert('中止されました');
                        localStorage.setItem("firstoauth", 0);
                }
        }
};

// 1の処理の成功時のコールバック関数
var successFetchRequestToken = function (authUrl) {

        //URLを訂正
        var tmp = authUrl.indexOf("&");
        var authUrl2 = authUrl.substring(0, tmp);


        // 2. リクエストトークンを使い、ユーザにアクセス許可を求めるURLを生成して ブラウザを起動
        // 3. ブラウザで認証を行い、ユーザーにPINが表示される
        new MozActivity({
                "name": "view",
                "data": {
                        "type": "url",
                        "url": authUrl2
                }
        });

	// 4. アプリで用意したダイアログにPIN を入力してもらう
	var pin = prompt("PINコードを入力してください", "");


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
	alert("認証に成功しました");
	getHomeTimeline();
        my_account();


};


// 各処理失敗時のコールバック関数
var failureHandler = function (data) {
        localStorage.setItem("firstoauth", 0);
        alert("failure");
};


//タイムラインに関する処理/////////////////////////////////////////////////////////////////
//タイムラインの削除
var clearTweetDom = function () {
        var parent = $("#tweetBox");
        parent.empty();
};

//通常タイムライン取得OAuth
var getHomeTimeline = function () {
        var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=" + getTweetNumber;
        oauth.get(url, successGetHomeTimeline, failureTimeLineHandler);
};

//初回タイムライン取得OAuth
var first_getHomeTimeline = function () {
        var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?count=" + getTweetNumber;
        oauth.get(url, successFirstTimeline, failureTimeLineHandler);
};

//初回タイムライン取得データ処理
var successFirstTimeline = function (data) {
        clearTweetDom();
        var tweetList = JSON.parse(data.text);
        console.log(tweetList);
        tweetIndex: for (var i = 0; i < tweetList.length; i++) {
                var tweet = tweetList[i];
                for (var j = 0; j < id_str.length; j++) {
                        var buf = id_str[j];
                        if (tweet.id_str == buf) {
                                break tweetIndex;
                        }
                }
                screenName.unshift(tweet.user.screen_name);
                name_str.unshift(tweet.user.name);
                tweetText.unshift(tweet.text);
                id_str.unshift(tweet.id_str);
                prof_img_url.unshift(tweet.user.profile_image_url);
                try{
                        photo_url[0].unshift(tweet.extended_entities.media[0].media_url_https);
                        photo_url[1].unshift(tweet.extended_entities.media[1].media_url_https);
                        photo_url[2].unshift(tweet.extended_entities.media[2].media_url_https);
                        photo_url[3].unshift(tweet.extended_entities.media[3].media_url_https);

                } catch (e) {
                        try{
                                if(photo_url[0][i] === undefined){
                                        photo_url[0].unshift(tweet.entities.media[0].media_url_https);
                                }
                        } catch (e) {
                                photo_url[0].unshift(null);
                                photo_url[1].unshift(null);
                                photo_url[2].unshift(null);
                                photo_url[3].unshift(null);
                        }
                        if(photo_url[3][i] === undefined){
                                photo_url[3].unshift(null);
                        } else if(photo_url[2][i] === undefined){
                                photo_url[2].unshift(null);
                        } else if(photo_url[1][i] === undefined){
                                photo_url[1].unshift(null);
                        }
                }

        }
        addFirstTweetToDom(tweet);
};

//初回タイムライン書き出し処理
var addFirstTweetToDom = function (tweet) {
	for(var i = id_str.length - 1; i >= 0; i--){
		var buf_screenName = screenName[i];
		var buf_name = name_str[i];
		var buf_tweetText = tweetText[i];
		var buf_prof_img_url = prof_img_url[i];
		var buf_id_str = id_str[i];
                var buf_photo_url = "";


		var $parent = $("#tweetBox");
		var $li = $("<li>").attr('id', "li" + buf_id_str).appendTo($parent);
		var $div = $("<div>").addClass("tweet").appendTo($li);
		var $userDiv = $("<div>").appendTo($div);
                var $menudiv = $("<div>").appendTo($userDiv);
		var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($menudiv);

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<img>").addClass("menu-button").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
                if(photo_url[0][i]){
                        buf_photo_url = photo_url[0][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[1][i]){
                        buf_photo_url = photo_url[1][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[2][i]){
                        buf_photo_url = photo_url[2][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[3][i]){
                        buf_photo_url = photo_url[3][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
	}
        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });


};

//通常ライムライン取得データ処理
var successGetHomeTimeline = function (data) {
        clearTweetDom();
        var buf_photo_url = [[], [], [], []];
        var tweetList = JSON.parse(data.text);
        var buf_screenName = [];
        var buf_name_str = [];
        var buf_tweetText = [];
        var buf_id_str = [];
        var buf_prof_img_url = [];

        tweetIndex1: for (var i = 0; i < tweetList.length; i++) {
                var tweet = tweetList[i];
                for (var j = 0; j < id_str.length; j++) {
                        var buf = id_str[j];
                        if (tweet.id_str == buf) {
                                break tweetIndex1;
                        }
                }
                buf_screenName.push(tweet.user.screen_name);
                buf_name_str.push(tweet.user.name);
                buf_tweetText.push(tweet.text);
                buf_id_str.push(tweet.id_str);
                buf_prof_img_url.push(tweet.user.profile_image_url);
                try{
                        buf_photo_url[0].push(tweet.extended_entities.media[0].media_url_https);
                        buf_photo_url[1].push(tweet.extended_entities.media[1].media_url_https);
                        buf_photo_url[2].push(tweet.extended_entities.media[2].media_url_https);
                        buf_photo_url[3].push(tweet.extended_entities.media[3].media_url_https);

                } catch (e) {
                        try{
                                if(buf_photo_url[0][i] === undefined){
                                        buf_photo_url[0].push(tweet.entities.media[0].media_url_https);
                                }
                        } catch (e) {
                                buf_photo_url[0].push(null);
                                buf_photo_url[1].push(null);
                                buf_photo_url[2].push(null);
                                buf_photo_url[3].push(null);
                        }
                        if(buf_photo_url[3][i] === undefined){
                                buf_photo_url[3].push(null);
                        } else if(buf_photo_url[2][i] === undefined){
                                buf_photo_url[2].push(null);
                        } else if(buf_photo_url[1][i] === undefined){
                                buf_photo_url[1].push(null);
                        }
                }


        }
        buf_screenName.reverse();
        buf_name_str.reverse();
        buf_tweetText.reverse();
        buf_id_str.reverse();
        buf_prof_img_url.reverse();
        buf_photo_url[0].reverse();
        buf_photo_url[1].reverse();
        buf_photo_url[2].reverse();
        buf_photo_url[3].reverse();

        for (var i = 0; i < buf_id_str.length; i++) {
                screenName.push(buf_screenName[i]);
                name_str.push(buf_name_str[i]);
                tweetText.push(buf_tweetText[i]);
                id_str.push(buf_id_str[i]);
                prof_img_url.push(buf_prof_img_url[i]);
                photo_url[0].push(buf_photo_url[0][i]);
                photo_url[1].push(buf_photo_url[1][i]);
                photo_url[2].push(buf_photo_url[2][i]);
                photo_url[3].push(buf_photo_url[3][i]);
        }
        addTweetToDom(tweet);
};

//通常タイムライン書き出し処理
var addTweetToDom = function (tweet) {
	for(var i = id_str.length - 1; i >= 0; i--){
		var buf_screenName = screenName[i];
		var buf_name = name_str[i];
		var buf_tweetText = tweetText[i];
		var buf_prof_img_url = prof_img_url[i];
		var buf_id_str = id_str[i];
                var buf_photo_url = "";

		var $parent = $("#tweetBox");
		var $li = $("<li>").appendTo($parent);
		var $div = $("<div>").addClass("tweet").appendTo($li);
		var $userDiv = $("<div>").appendTo($div);
		var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($userDiv);

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<img>").addClass("menu-button").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
                if(photo_url[0][i]){
                        buf_photo_url = photo_url[0][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[1][i]){
                        buf_photo_url = photo_url[1][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[2][i]){
                        buf_photo_url = photo_url[2][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(photo_url[3][i]){
                        buf_photo_url = photo_url[3][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
	}
        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });

};


//メンションに関する処理//////////////////////////////////////////////////////////
//メンションの削除
var clearMentionTweetDom = function () {
        var parent = $("#mentionBox");
        parent.empty();
};


//通常メンション取得OAuth
var getMentionTimeline = function () {
        var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=" + getTweetNumber;
        oauth.get(url, successMention, failureTimeLineHandler);
};

//初回メンション取得OAuth
var first_getMentionTimeline = function () {
        var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=" + getTweetNumber;
        oauth.get(url, successFirstMention, failureTimeLineHandler);
};

//初回メンション取得処理
var successFirstMention = function (data) {
        clearMentionTweetDom();
        var tweetList = JSON.parse(data.text);
        mentionIndex: for (var i = 0; i < tweetList.length; i++) {
                var tweet = tweetList[i];
                for (var j = 0; j < mention_id_str.length; j++) {
                        var buf = mention_id_str[j];
                        if (tweet.id_str == buf) {
                                break mentionIndex;
                        }
                }
                mention_screenName.unshift(tweet.user.screen_name);
                mention_name_str.unshift(tweet.user.name);
                mention_tweetText.unshift(tweet.text);
                mention_id_str.unshift(tweet.id_str);
                mention_prof_img_url.unshift(tweet.user.profile_image_url);
                try{
                        mention_photo_url[0].unshift(tweet.extended_entities.media[0].media_url_https);
                        mention_photo_url[1].unshift(tweet.extended_entities.media[1].media_url_https);
                        mention_photo_url[2].unshift(tweet.extended_entities.media[2].media_url_https);
                        mention_photo_url[3].unshift(tweet.extended_entities.media[3].media_url_https);

                } catch (e) {
                        try{
                                if(mention_photo_url[0][i] === undefined){
                                        mention_photo_url[0].unshift(tweet.entities.media[0].media_url_https);
                                }
                        } catch (e) {
                                mention_photo_url[0].unshift(null);
                                mention_photo_url[1].unshift(null);
                                mention_photo_url[2].unshift(null);
                                mention_photo_url[3].unshift(null);
                        }
                        if(mention_photo_url[3][i] === undefined){
                                mention_photo_url[3].unshift(null);
                        } else if(mention_photo_url[2][i] === undefined){
                                mention_photo_url[2].unshift(null);
                        } else if(mention_photo_url[1][i] === undefined){
                                mention_photo_url[1].unshift(null);
                        }
                }
        }
        addFirstMentionTweetToDom(tweet);
};

//初回メンション書き出し処理
var addFirstMentionTweetToDom = function (tweet) {
	for(var i = mention_id_str.length - 1; i >= 0; i--){
		var buf_screenName = mention_screenName[i];
		var buf_name = mention_name_str[i];
		var buf_tweetText = mention_tweetText[i];
		var buf_prof_img_url = mention_prof_img_url[i];
		var buf_id_str = mention_id_str[i];
                var buf_photo_url = "";

		var $parent = $("#mentionBox");
		var $li = $("<li>").appendTo($parent);
		var $div = $("<div>").addClass("tweet").appendTo($li);
		var $userDiv = $("<div>").appendTo($div);
		var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($userDiv);

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<img>").addClass("menu-button").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
                if(mention_photo_url[0][i]){
                        buf_photo_url = mention_photo_url[0][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[1][i]){
                        buf_photo_url = mention_photo_url[1][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[2][i]){
                        buf_photo_url = mention_photo_url[2][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[3][i]){
                        buf_photo_url = mention_photo_url[3][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
	}
        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });

};

//通常メンション取得処理
var successMention = function (data) {
        clearMentionTweetDom();
        var tweetList = JSON.parse(data.text);
        var buf_screenName = [];
        var buf_name_str = [];
        var buf_tweetText = [];
        var buf_id_str = [];
        var buf_prof_img_url = [];
        var buf_photo_url = [[], [], [], []];
        mentionIndex1: for (var i = 0; i < tweetList.length; i++) {
                var tweet = tweetList[i];
                for (var j = 0; j < id_str.length; j++) {
                        var buf = id_str[j];
                        if (tweet.id_str == buf) {
                                break mentionIndex1;
                        }
                }
                buf_screenName.push(tweet.user.screen_name);
                buf_name_str.push(tweet.user.name);
                buf_tweetText.push(tweet.text);
                buf_id_str.push(tweet.id_str);
                buf_prof_img_url.push(tweet.user.profile_image_url);
                try{
                        buf_photo_url[0].push(tweet.extended_entities.media[0].media_url_https);
                        buf_photo_url[1].push(tweet.extended_entities.media[1].media_url_https);
                        buf_photo_url[2].push(tweet.extended_entities.media[2].media_url_https);
                        buf_photo_url[3].push(tweet.extended_entities.media[3].media_url_https);

                } catch (e) {
                        try{
                                if(buf_photo_url[0][i] === undefined){
                                        buf_photo_url[0].push(tweet.entities.media[0].media_url_https);
                                }
                        } catch (e) {
                                buf_photo_url[0].push(null);
                                buf_photo_url[1].push(null);
                                buf_photo_url[2].push(null);
                                buf_photo_url[3].push(null);
                        }
                        if(buf_photo_url[3][i] === undefined){
                                buf_photo_url[3].push(null);
                        } else if(buf_photo_url[2][i] === undefined){
                                buf_photo_url[2].push(null);
                        } else if(buf_photo_url[1][i] === undefined){
                                buf_photo_url[1].push(null);
                        }
                }

        }
        buf_screenName.reverse();
        buf_name_str.reverse();
        buf_tweetText.reverse();
        buf_id_str.reverse();
        buf_prof_img_url.reverse();
        buf_photo_url[0].reverse();
        buf_photo_url[1].reverse();
        buf_photo_url[2].reverse();
        buf_photo_url[3].reverse();

        for (var i = 0; i < buf_id_str.length; i++) {
                mention_screenName.push(buf_screenName[i]);
                mention_name_str.push(buf_name_str[i]);
                mention_tweetText.push(buf_tweetText[i]);
                mention_id_str.push(buf_id_str[i]);
                mention_prof_img_url.push(buf_prof_img_url[i]);
                mention_photo_url[0].push(buf_photo_url[0][i]);
                mention_photo_url[1].push(buf_photo_url[1][i]);
                mention_photo_url[2].push(buf_photo_url[2][i]);
                mention_photo_url[3].push(buf_photo_url[3][i]);
        }
        addMentionTweetToDom(tweet);
};

//通常メンション書き出し処理
var addMentionTweetToDom = function (tweet) {
	for(var i = mention_id_str.length - 1; i >= 0; i--){
		var buf_screenName = mention_screenName[i];
		var buf_name = mention_name_str[i];
		var buf_tweetText = mention_tweetText[i];
		var buf_prof_img_url = mention_prof_img_url[i];
		var buf_id_str = mention_id_str[i];
                var buf_photo_url = "";

		var $parent = $("#mentionBox");
		var $li = $("<li>").appendTo($parent);
		var $div = $("<div>").addClass("tweet").appendTo($li);
		var $userDiv = $("<div>").appendTo($div);
		var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($userDiv);

		$("<img>").addClass("tweetIcon").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', buf_prof_img_url).appendTo($userDiv);
		$("<span>").addClass("name").text(buf_name).appendTo($userDiv);
		$("<span>").addClass("screenName").text("@" + buf_screenName).appendTo($userDiv);
		$("<img>").addClass("menu-button").attr('id', buf_id_str).attr('data-name', buf_screenName).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
		$("<div>").addClass("tweetText").text(buf_tweetText).appendTo($div);
                if(mention_photo_url[0][i]){
                        buf_photo_url = mention_photo_url[0][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[1][i]){
                        buf_photo_url = mention_photo_url[1][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[2][i]){
                        buf_photo_url = mention_photo_url[2][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
                if(mention_photo_url[3][i]){
                        buf_photo_url = mention_photo_url[3][i];
                        $("<img>").attr('src', buf_photo_url).addClass('tweetImage').appendTo($div);
                }
	}
        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });
};

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
	document.getElementById("userimage").setAttribute("src", userdata.profile_image_url_https);
	document.getElementById("username").innerHTML = userdata.name;
	document.getElementById("userscreenname").innerHTML = "@" + userdata.screen_name;
        document.getElementById("userdescription").innerHTML = userdata.description;
        document.getElementById("userlocation").innerHTML = userdata.location;
        document.getElementById("userurl").setAttribute("href", userdata.entities.url.urls[0].expanded_url);
        document.getElementById("userurl").innerHTML = userdata.entities.url.urls[0].expanded_url;
        document.getElementById("userdata").style.backgroundImage = "url("+userdata.profile_banner_url+"/web"+")";
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


//ポスト系の処理///////////////////////////////////////////////////////////
//ツイート
var newTweetPost = function () {
        post_tweettext = "";
        post_tweettext = document.getElementById("newTweetText").value;
        var data;
        tweet_media = [];
        post_imagefile = [];
        var flag = 0;
        for(var i = 0; i < 4; i++){
                try{
                        post_imagefile[i] = document.getElementsByClassName("postImageform")[i].files[0];
                        if(typeof post_imagefile[i] !== "undefined"){
                                flag = 1;
                                data = {
                                        "media": post_imagefile[i]
                                };
                                oauth.post('https://upload.twitter.com/1.1/media/upload.json', data , setTweetMedia, failurePostHandler);
                        }
                } catch (e) {
                }
        }
        if(flag === 1){
                return;
        }
        tweetPost();
};
var setTweetMedia = function (data) {
        var mediaids = JSON.parse(data.text);
        for(var i = 0; i < 4; i++){
                if(typeof tweet_media[i] === "undefined"){
                        tweet_media[i] = mediaids.media_id_string;
                        if(i === post_imagefile.length - 1 || (i === post_imagefile.length - 2 && typeof post_imagefile[post_imagefile.length - 1] === "undefined")){
                                tweetPost();
                        }
                        break;
                }
        }
};

var tweetPost = function () {
        var setdata;
        var medias = "";
        if(typeof tweet_media[0] === "undefined"){
                if(post_tweettext === ""){
                        return;
                }
                setdata = {
                        "status": post_tweettext
                };
                oauth.post('https://api.twitter.com/1.1/statuses/update.json', setdata, successHandler, failurePostHandler);
                return false;
        }
        for(var i = 0; i < tweet_media.length; i++){
                medias = medias + tweet_media[i] + ",";
        }
        var medias_s = medias.substr(0 , medias.length - 1);
        if(post_tweettext === ""){
                setdata = {
                        "media_ids": medias_s
                };
                oauth.post('https://api.twitter.com/1.1/statuses/update.json', setdata, successHandler, failurePostHandler);
                tweet_media = [];
                post_imagefile = [];
                return;
        }
        setdata = {
                "status": post_tweettext,
                "media_ids": medias_s
        };
        oauth.post('https://api.twitter.com/1.1/statuses/update.json', setdata, successHandler, failurePostHandler);
        tweet_media = [];
        post_imagefile = [];

};

//リプツイ
var replyTweetPost = function (repId) {
        post_repId = repId;
        post_tweettext = "";
        post_tweettext = document.getElementById("newTweetText").value;
        var data;
        tweet_media = [];
        post_imagefile = [];
        var flag = 0;
        for(var i = 0; i < 4; i++){
                try{
                        post_imagefile[i] = document.getElementsByClassName("postImageform")[i].files[0];
                        if(typeof post_imagefile[i] !== "undefined"){
                                flag = 1;
                                data = {
                                        "media": post_imagefile[i]
                                };
                                oauth.post('https://upload.twitter.com/1.1/media/upload.json', data , setTweetMedia, failurePostHandler);
                        }
                } catch (e) {
                }
        }
        if(flag === 1){
                return;
        }
        tweetPost(repId);
};

var tweetReplyPost = function (repId) {
        var setdata;
        var medias = "";
        if(typeof tweet_media[0] === "undefined"){
                if(post_tweettext === ""){
                        return;
                }
                setdata = {
                        "status": post_tweettext
                };
                oauth.post('https://api.twitter.com/1.1/statuses/update.json?in_reply_to_status_id=' + repId, setdata, successHandler, failurePostHandler);
                post_repId = "";
                return false;
        }
        for(var i = 0; i < tweet_media.length; i++){
                medias = medias + tweet_media[i] + ",";
        }
        var medias_s = medias.substr(0 , medias.length - 1);
        if(post_tweettext === ""){
                setdata = {
                        "media_ids": medias_s
                };
                oauth.post('https://api.twitter.com/1.1/statuses/update.json?in_reply_to_status_id=' + repId, setdata, successHandler, failurePostHandler);
                tweet_media = [];
                post_imagefile = [];
                post_repId = "";
                return;
        }
        setdata = {
                "status": post_tweettext,
                "media_ids": medias_s
        };
        oauth.post('https://api.twitter.com/1.1/statuses/update.json?in_reply_to_status_id=' + repId, setdata, successHandler, failurePostHandler);
        tweet_media = [];
        post_imagefile = [];
        post_repId = "";
};

/***ふぁぼ***/
var favoriteCreate = function (favId) {
        oauth.request({
                method: "POST",
                url: "https://api.twitter.com/1.1/favorites/create.json?id=" + favId
        });
};

//リプ
var replyCreate = function (repId, repName) {
        $("#statusUpdateButton").attr('id', "replyUpdateButton").addClass(repId);
        $("#backButton").attr('id', "replyBackButton");
        document.form1.postform.value = "@" + repName + " ";
        document.querySelector('#newTweetSection').className = 'current';
        document.querySelector('[data-position="current"]').className = 'left';
};

//リツイート
var rtCreate = function (rtId) {
        oauth.request({
                method: "POST",
                url: "https://api.twitter.com/1.1/statuses/retweet/" + rtId + ".json"
        });
};

//つい消し
var trashtweet = function (trashid) {
        oauth.request({
                method: "POST",
                url: "https://api.twitter.com/1.1/statuses/destroy/" + trashid + ".json"
        });
        var $trashed = "#li" + trashid;
        var $li = $($trashed).closest("ul").children();
        var $arraynum = $li.index($($trashed).closest($li));
        $($trashed).remove();
        screenName.splice(screenName.length - 1 - $arraynum, 1);
        name_str.splice(name_str.length - 1 - $arraynum, 1);
        tweetText.splice(tweetText.length - 1 - $arraynum, 1);
        id_str.splice(id_str.length - 1 - $arraynum, 1);
        prof_img_url.splice(prof_img_url.length - 1 - $arraynum, 1);
        photo_url[0].splice(photo_url[0].length - 1 - $arraynum, 1);
        photo_url[1].splice(photo_url[1].length - 1 - $arraynum, 1);
        photo_url[2].splice(photo_url[2].length - 1 - $arraynum, 1);
        photo_url[3].splice(photo_url[3].length - 1 - $arraynum, 1);
        location.href = "#";
};

//投稿画像の追加
var addNewPostImage = function () {
        if (document.getElementsByClassName("postImageform").length >= 4 || document.getElementById("addPostImagebutton")) {
                return;
        }
        var $addbutton = $("<button>").attr("type", "button").attr("id", "addPostImagebutton").appendTo("#postTweetImage");
        $("<img>").attr("src", "img/Entypo+/Entypo+/plus.svg").attr("id", "addPostImagebuttonimg").appendTo($addbutton);
};

var addNewImageForm = function () {
        $("#addPostImagebutton").remove();
        $("<input>").attr("type", "file").addClass("postImageform").appendTo("#postTweetImage");
        var $clearbutton = $("<button>").addClass("clearImage").appendTo("#postTweetImage");
        $("<img>").attr("id", "clearImageicon").attr("src", "img/Entypo+/Entypo+/trash.svg").appendTo($clearbutton);
};

//画像削除
var clearImageValue = function (num) {
        document.getElementsByClassName("postImageform")[num].value = "";
        if(this.value === undefined && num != 0){
                $(".postImageform")[num].remove();
                $(".clearImage")[num].remove();
                if(document.getElementById("addPostImagebutton")){
                        return;
                }
                addNewPostImage();
        } else if(num === 0 && document.getElementsByClassName("postImageform")[num+1]){
                $(".postImageform")[num].remove();
                $(".clearImage")[num].remove();
                if(document.getElementById("addPostImagebutton")){
                        return;
                }

        }
};

//戻す
var removeImagebutton = function () {
        for(var i = 3; i > 0; i--){
                try {
                        $(".postImageform")[i].remove();
                        $(".clearImage")[i].remove();
                } catch (e) {
                }
        }
        $("#addPostImagebutton").remove();
};


//エラー系のダイアログ処理/////////////////////////////////////////////////////
//成功時の出力ログ
var successHandler = function () {
        console.log("success");
};

var failureTimeLineHandler = function (data) {
        alert("タイムラインの取得に失敗しました");
};

var failurePostHandler = function (data) {
        alert("ツイートに失敗しました");
};

var failureGetUserDataHandler = function (data) {
	alert("ユーザー情報の取得に失敗しました");
};

var nonerror = function (data) {
};
