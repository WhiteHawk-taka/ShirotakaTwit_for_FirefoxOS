//タイムラインに関する処理/////////////////////////////////////////////////////////////////
//タイムラインの削除
var clearTweetDom = function () {
  var parent = $("#tweetBox");
  parent.empty();
};
//タイムラインの続き取得OAuth
var getNextHomeTimeline = function (id_str) {
  var url = "https://api.twitter.com/1.1/statuses/home_timeline.json?max_id=" + id_str + "&count=" + getTweetNumber;
  oauth.get(url, successGetNextHomeTimeline, failureTimeLineHandler);
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
  var tweetList = JSON.parse(data.text);
  for (var i = 0; i < tweetList.length; i++) {
    var tweet = tweetList[i];
    //retweeted
    if (tweet.retweeted_status) {
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https;
      }
      retweeted_user.unshift(tweet.user.name);
      screenName.unshift(tweet.retweeted_status.user.screen_name);
      name_str.unshift(tweet.retweeted_status.user.name);
      tweetText.unshift(tweet.retweeted_status.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      id_str.unshift(tweet.retweeted_status.id_str);
      prof_img_url.unshift(profile_image_url_https2);
      photo_url[0].unshift(null);
      photo_url[1].unshift(null);
      photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
        photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
        photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
        photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.retweeted_status.entities.media[0].media_url_https) {
            photo_url[0][0] = tweet.retweeted_status.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    } else {

      //general
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.user.profile_image_url_https;
      }
      retweeted_user.unshift(null);
      screenName.unshift(tweet.user.screen_name);
      name_str.unshift(tweet.user.name);
      tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      id_str.unshift(tweet.id_str);
      prof_img_url.unshift(profile_image_url_https2);
      photo_url[0].unshift(null);
      photo_url[1].unshift(null);
      photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
        photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
        photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
        photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.entities.media[0].media_url_https) {
            photo_url[0][0] = tweet.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    }
  }
  clearTweetDom();
  addFirstTweetToDom(tweet);
};


//通常ライムライン取得データ処理
var successGetHomeTimeline = function (data) {
  var tweetList = JSON.parse(data.text);
  var buf_photo_url = [[], [], [], []];
  var buf_screenName = [];
  var buf_name_str = [];
  var buf_tweetText = [];
  var buf_id_str = [];
  var buf_prof_img_url = [];
  var buf_retweeted_user = [];

  tweetIndex1: for (var i = 0; i < tweetList.length; i++) {
    var tweet = tweetList[i];
    for (var j = 0; j < id_str.length; j++) {
      var buf = id_str[j];
      if (tweet.retweeted_status) {
        if (tweet.retweeted_status.id_str == buf) {
          break tweetIndex1;
        }
      } else {
        if (tweet.id_str == buf) {
          break tweetIndex1;
        }
      }
    }

    if (tweet.retweeted_status) {
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https;
      }
      buf_retweeted_user.unshift(tweet.user.name);
      buf_screenName.unshift(tweet.retweeted_status.user.screen_name);
      buf_name_str.unshift(tweet.retweeted_status.user.name);
      buf_tweetText.unshift(tweet.retweeted_status.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      buf_id_str.unshift(tweet.retweeted_status.id_str);
      buf_prof_img_url.unshift(profile_image_url_https2);
      buf_photo_url[0].unshift(null);
      buf_photo_url[1].unshift(null);
      buf_photo_url[2].unshift(null);
      buf_photo_url[3].unshift(null);
      try {
        buf_photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
        buf_photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
        buf_photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
        buf_photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.retweeted_status.entities.media[0].media_url_https) {
            buf_photo_url[0][0] = tweet.retweeted_status.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    } else {

      //general
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.user.profile_image_url_https;
      }
      buf_retweeted_user.unshift(null);
      buf_screenName.unshift(tweet.user.screen_name);
      buf_name_str.unshift(tweet.user.name);
      buf_tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      buf_id_str.unshift(tweet.id_str);
      buf_prof_img_url.unshift(profile_image_url_https2);
      buf_photo_url[0].unshift(null);
      buf_photo_url[1].unshift(null);
      buf_photo_url[2].unshift(null);
      buf_photo_url[3].unshift(null);
      try {
        buf_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
        buf_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
        buf_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
        buf_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.entities.media[0].media_url_https) {
            buf_photo_url[0][0] = tweet.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    }
  }
  for (var i = 0; i < buf_id_str.length; i++) {
    retweeted_user.push(buf_retweeted_user[i]);
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
  clearTweetDom();
  addFirstTweetToDom(tweet);
};


//続き取得データ処理
var successGetNextHomeTimeline = function (data) {
  var tweetList = JSON.parse(data.text);
  for (var i = 1; i < tweetList.length; i++) {
    var tweet = tweetList[i];
    //retweeted
    if (tweet.retweeted_status) {
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https;
      }
      retweeted_user.unshift(tweet.user.name);
      screenName.unshift(tweet.retweeted_status.user.screen_name);
      name_str.unshift(tweet.retweeted_status.user.name);
      tweetText.unshift(tweet.retweeted_status.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      id_str.unshift(tweet.retweeted_status.id_str);
      prof_img_url.unshift(profile_image_url_https2);
      photo_url[0].unshift(null);
      photo_url[1].unshift(null);
      photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
        photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
        photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
        photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.retweeted_status.entities.media[0].media_url_https) {
            photo_url[0][0] = tweet.retweeted_status.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    } else {

      //general
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.user.profile_image_url_https;
      }
      retweeted_user.unshift(null);
      screenName.unshift(tweet.user.screen_name);
      name_str.unshift(tweet.user.name);
      tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      id_str.unshift(tweet.id_str);
      prof_img_url.unshift(profile_image_url_https2);
      photo_url[0].unshift(null);
      photo_url[1].unshift(null);
      photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
        photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
        photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
        photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.entities.media[0].media_url_https) {
            photo_url[0][0] = tweet.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    }
  }
clearTweetDom();
addFirstTweetToDom(tweet);
};

//タイムライン書き出し処理
var addFirstTweetToDom = function (tweet) {
  for(var i = id_str.length - 1; i >= 0; i--){
    var $parent = $("#tweetBox");
    var $li = $("<li>").attr('id', "li" + id_str[i]).appendTo($parent);
    var $div = $("<div>").addClass("tweet").appendTo($li);
    var $userDiv = $("<div>").appendTo($div);
    var $menudiv = $("<div>").appendTo($userDiv);
    var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($menudiv);

    $("<img>").addClass("tweetIcon").attr('id', id_str[i]).attr('data-name', screenName[i]).attr('src', prof_img_url[i]).appendTo($userDiv);
    $("<span>").addClass("name").text(name_str[i]).appendTo($userDiv);
    $("<span>").addClass("screenName").text("@" + screenName[i]).appendTo($userDiv);
    $("<img>").addClass("menu-button").attr('id', id_str[i]).attr('data-name', screenName[i]).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
    $("<div>").addClass("tweetText").text(tweetText[i]).appendTo($div);
    if (photo_url[0][i]) {
      $("<img>").attr('src', photo_url[0][i]).addClass('tweetImage').appendTo($div);
    }
    if (photo_url[1][i]) {
      $("<img>").attr('src', photo_url[1][i]).addClass('tweetImage').appendTo($div);
    }
    if (photo_url[2][i]) {
      $("<img>").attr('src', photo_url[2][i]).addClass('tweetImage').appendTo($div);
    }
    if (photo_url[3][i]) {
      $("<img>").attr('src', photo_url[3][i]).addClass('tweetImage').appendTo($div);
    }

    if (retweeted_user[i]) {
      $("<div>").addClass("retweetUser").text(retweeted_user[i] + " さんがリツイート").appendTo($div);
    }
  }
  var $parent = $("#tweetBox");
  var $li = $("<li>").attr('id', "getNextTweet").appendTo($parent);
  var $div = $("<div>").addClass("tweet").appendTo($li);
  var $userDiv = $("<div>").appendTo($div);
  var $menudiv = $("<div>").appendTo($userDiv);

  $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);

  $(".tweetText").each(function () {
    $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
  });
};
