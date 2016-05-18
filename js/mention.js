//メンションに関する処理//////////////////////////////////////////////////////////
//メンションの削除
var clearMentionTweetDom = function () {
  var parent = $("#mentionBox");
  parent.empty();
};

//メンションの続き取得OAuth
var getNextMentionTimeline = function (id_str) {
  var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json?max_id=" + id_str + "&count=" + getTweetNumber;
  oauth.get(url, successGetNextMentionTimeline, failureTimeLineHandler);
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
  var tweetList = JSON.parse(data.text);
  mentionIndex: for (var i = 0; i < tweetList.length; i++) {
    var tweet = tweetList[i];
    for (var j = 0; j < mention_id_str.length; j++) {
      var buf = mention_id_str[j];
      if (tweet.id_str == buf) {
        break mentionIndex;
      }
    }
    if (iconimagebigger == 1) {
      var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
    } else {
      var profile_image_url_https2 = tweet.user.profile_image_url_https;
    }
    mention_screenName.unshift(tweet.user.screen_name);
    mention_name_str.unshift(tweet.user.name);
    mention_tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
    mention_id_str.unshift(tweet.id_str);
    mention_prof_img_url.unshift(profile_image_url_https2);
    mention_photo_url[0].unshift(null);
    mention_photo_url[1].unshift(null);
    mention_photo_url[2].unshift(null);
    mention_photo_url[3].unshift(null);
    try {
      mention_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
      mention_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
      mention_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
      mention_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
    } catch (e) {
      try {
        if (tweet.entities.media[0].media_url_https) {
          mention_photo_url[0][0] = tweet.entities.media[0].media_url_https;
        }
      } catch (e) {
      }
    }
  }
  clearMentionTweetDom();
  addFirstMentionTweetToDom(tweet);
};

//通常メンション取得処理
var successMention = function (data) {
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
    if (iconimagebigger == 1) {
      var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
    } else {
      var profile_image_url_https2 = tweet.user.profile_image_url_https;
    }
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
  clearMentionTweetDom();
  addFirstMentionTweetToDom(tweet);
};


//続き取得データ処理
var successGetNextMentionTimeline = function (data) {
  var tweetList = JSON.parse(data.text);
  for (var i = 1; i < tweetList.length; i++) {
    var tweet = tweetList[i];

    if (iconimagebigger == 1) {
      var profile_image_url_https2 = tweet.user.profile_image_url_https.replace(/_normal/, '_bigger');
    } else {
      var profile_image_url_https2 = tweet.user.profile_image_url_https;
    }
    mention_screenName.unshift(tweet.user.screen_name);
    mention_name_str.unshift(tweet.user.name);
    mention_tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
    mention_id_str.unshift(tweet.id_str);
    mention_prof_img_url.unshift(profile_image_url_https2);
    mention_photo_url[0].unshift(null);
    mention_photo_url[1].unshift(null);
    mention_photo_url[2].unshift(null);
    mention_photo_url[3].unshift(null);
    try {
      mention_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
      mention_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
      mention_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
      mention_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
    } catch (e) {
      try {
        if (tweet.entities.media[0].media_url_https) {
          mention_photo_url[0][0] = tweet.entities.media[0].media_url_https;
        }
      } catch (e) {
      }
    }
  }
  clearMentionTweetDom();
  addFirstMentionTweetToDom(tweet);
};

//メンション書き出し処理
var addFirstMentionTweetToDom = function (tweet) {
  for (var i = mention_id_str.length - 1; i >= 0; i--) {
    var $parent = $("#mentionBox");
    var $li = $("<li>").appendTo($parent);
    var $div = $("<div>").addClass("tweet").appendTo($li);
    var $userDiv = $("<div>").appendTo($div);
    var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($userDiv);

    $("<img>").addClass("tweetIcon").attr('id', mention_id_str[i]).attr('data-name', mention_screenName[i]).attr('src', mention_prof_img_url[i]).appendTo($userDiv);
    $("<span>").addClass("name").text(mention_name_str[i]).appendTo($userDiv);
    $("<span>").addClass("screenName").text("@" + mention_screenName[i]).appendTo($userDiv);
    $("<img>").addClass("menu-button").attr('id', mention_id_str[i]).attr('data-name', mention_screenName[i]).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
    $("<div>").addClass("tweetText").text(mention_tweetText[i]).appendTo($div);
    if (mention_photo_url[0][i]) {
      $("<img>").attr('src', mention_photo_url[0][i]).addClass('tweetImage').appendTo($div);
    }
    if (mention_photo_url[1][i]) {
      $("<img>").attr('src', mention_photo_url[1][i]).addClass('tweetImage').appendTo($div);
    }
    if (mention_photo_url[2][i]) {
      $("<img>").attr('src', mention_photo_url[2][i]).addClass('tweetImage').appendTo($div);
    }
    if (mention_photo_url[3][i]) {
      $("<img>").attr('src', mention_photo_url[3][i]).addClass('tweetImage').appendTo($div);
    }
  }

  var $parent = $("#mentionBox");
  var $li = $("<li>").attr('id', "getNextMentionTweet").appendTo($parent);
  var $div = $("<div>").addClass("tweet").appendTo($li);
  var $userDiv = $("<div>").appendTo($div);
  var $menudiv = $("<div>").appendTo($userDiv);

  $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);

  $(".tweetText").each(function () {
    $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
  });
};

