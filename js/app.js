// oauthオブジェクト
var oauth;

//G変数の宣言
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
var retweeted_user = [];

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

var search_screenName = [];
var search_name_str = [];
var search_tweetText = [];
var search_id_str = [];
var search_prof_img_url = [];
var search_favorited = [];
var search_photo_url = [[],[],[],[]];
var search_retweeted_user = [];

var getTweetNumber = "";
var iconimagebigger = "";
var searchRT = "";

var search_word = "";

window.onload = function () {
  //設定の初期化
  if (localStorage.getItem("getTweetNumber")) {
    getTweetNumber = localStorage.getItem("getTweetNumber");
  } else {
    getTweetNumber = 100;
  }
  if (localStorage.getItem("iconimagebigger")) {
    iconimagebigger = localStorage.getItem("iconimagebigger");
  } else {
    iconimagebigger = 1;
  }
  if (localStorage.getItem("searchRT")) {
    searchRT = localStorage.getItem("searchRT");
  } else {
    searchRT = 0;
  }
  // OAuth関連の処理を開始する
  localStorage.setItem("firstoauth", 0);
  firstOAuthFunc();
};

// OAuth処理 ///////////////////////////////////////////////////////////////////////////////
var firstOAuthFunc = function () {
  if (localStorage.getItem("accessTokenKey")) { 
    localStorage.setItem("firstoauth", 1);
  } else {
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
      if (location.pathname === "/index.html") {
        first_getHomeTimeline();
      } else if (location.pathname === "/mention.html") {
        first_getMentionTimeline();
      } else {
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



