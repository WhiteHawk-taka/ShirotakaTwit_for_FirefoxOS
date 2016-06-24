var getSearch = function (word) {
  if (searchRT == 0) {
    word = word + " -rt";
  }
  var escapeWord = encodeURIComponent(word).replace(/['()]/g, escape).replace(/\*/g, '%2A');
  var url = "https://api.twitter.com/1.1/search/tweets.json?q=" + escapeWord + "&count=" + getTweetNumber;
  oauth.get(url, successGetSearch, failureSearchHandler);
};

var getNextSearch = function (id_str, word) {
  if (searchRT == 0) {
    word = word + " -rt";
  }
  var escapeWord = encodeURIComponent(word).replace(/['()]/g, escape).replace(/\*/g, '%2A');
  var url = "https://api.twitter.com/1.1/search/tweets.json?q=" + escapeWord + "&max_id=" + id_str + "&count=" + getTweetNumber;
  oauth.get(url, successGetNextSearch, failureSearchHandler);
};

var clearSearchTweetDom = function () {
  $("#searchTweetBox").empty();
};

var successGetSearch = function (data) {

  search_retweeted_user = [];
  search_screenName = [];
  search_name_str = [];
  search_tweetText = [];
  search_id_str = [];
  search_prof_img_url = [];
  search_photo_url = [[],[],[],[]];

  var responseData = JSON.parse(data.text);
  if (!(responseData.statuses)) {
    return;
  }
  for (var i = 0; i < responseData.statuses.length; i++) {
    var tweet = responseData.statuses[i];
    //retweeted
    if (tweet.retweeted_status) {
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https;
      }
      search_retweeted_user.unshift(tweet.user.name);
      search_screenName.unshift(tweet.retweeted_status.user.screen_name);
      search_name_str.unshift(tweet.retweeted_status.user.name);
      search_tweetText.unshift(tweet.retweeted_status.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      search_id_str.unshift(tweet.retweeted_status.search_id_str);
      search_prof_img_url.unshift(profile_image_url_https2);
      search_photo_url[0].unshift(null);
      search_photo_url[1].unshift(null);
      search_photo_url[2].unshift(null);
      search_photo_url[3].unshift(null);
      try {
        search_photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
        search_photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
        search_photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
        search_photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.retweeted_status.entities.media[0].media_url_https) {
            search_photo_url[0][0] = tweet.retweeted_status.entities.media[0].media_url_https;
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
      search_retweeted_user.unshift(null);
      search_screenName.unshift(tweet.user.screen_name);
      search_name_str.unshift(tweet.user.name);
      search_tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      search_id_str.unshift(tweet.id_str);
      search_prof_img_url.unshift(profile_image_url_https2);
      search_photo_url[0].unshift(null);
      search_photo_url[1].unshift(null);
      search_photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        search_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
        search_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
        search_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
        search_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.entities.media[0].media_url_https) {
            search_photo_url[0][0] = tweet.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    }
  }
  clearSearchTweetDom();
  addSearchTweetToDom(tweet);
};

var successGetNextSearch = function (data) {
  var responseData = JSON.parse(data.text);
  if (!(responseData.statuses)) {
    return;
  }
  for (var i = 1; i < responseData.statuses.length; i++) {
    var tweet = responseData.statuses[i];
    //retweeted
    if (tweet.retweeted_status) {
      if (iconimagebigger == 1) {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https.replace(/_normal/, '_bigger');
      } else {
        var profile_image_url_https2 = tweet.retweeted_status.user.profile_image_url_https;
      }
      search_retweeted_user.unshift(tweet.user.name);
      search_screenName.unshift(tweet.retweeted_status.user.screen_name);
      search_name_str.unshift(tweet.retweeted_status.user.name);
      search_tweetText.unshift(tweet.retweeted_status.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      search_id_str.unshift(tweet.retweeted_status.search_id_str);
      search_prof_img_url.unshift(profile_image_url_https2);
      search_photo_url[0].unshift(null);
      search_photo_url[1].unshift(null);
      search_photo_url[2].unshift(null);
      search_photo_url[3].unshift(null);
      try {
        search_photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
        search_photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
        search_photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
        search_photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.retweeted_status.entities.media[0].media_url_https) {
            search_photo_url[0][0] = tweet.retweeted_status.entities.media[0].media_url_https;
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
      search_retweeted_user.unshift(null);
      search_screenName.unshift(tweet.user.screen_name);
      search_name_str.unshift(tweet.user.name);
      search_tweetText.unshift(tweet.text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));
      search_id_str.unshift(tweet.id_str);
      search_prof_img_url.unshift(profile_image_url_https2);
      search_photo_url[0].unshift(null);
      search_photo_url[1].unshift(null);
      search_photo_url[2].unshift(null);
      photo_url[3].unshift(null);
      try {
        search_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
        search_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
        search_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
        search_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;
      } catch (e) {
        try {
          if (tweet.entities.media[0].media_url_https) {
            search_photo_url[0][0] = tweet.entities.media[0].media_url_https;
          }
        } catch (e) {
        }
      }
    }
  }
  clearSearchTweetDom();
  addSearchTweetToDom(tweet);
};

var addSearchTweetToDom = function (tweet) {
  for(var i = search_id_str.length - 1; i >= 0; i--){
    var $parent = $("#searchTweetBox");
    var $li = $("<li>").attr('id', "li" + search_id_str[i]).appendTo($parent);
    var $div = $("<div>").addClass("tweet").appendTo($li);
    var $userDiv = $("<div>").appendTo($div);
    var $menudiv = $("<div>").appendTo($userDiv);
    var $a1 = $("<a>").attr('href', "#drawer").addClass("tlmenu").appendTo($menudiv);

    $("<img>").addClass("tweetIcon").attr('id', search_id_str[i]).attr('data-name', search_screenName[i]).attr('src', search_prof_img_url[i]).appendTo($userDiv);
    $("<span>").addClass("name").text(search_name_str[i]).appendTo($userDiv);
    $("<span>").addClass("screenName").text("@" + search_screenName[i]).appendTo($userDiv);
    $("<img>").addClass("menu-button").attr('id', search_id_str[i]).attr('data-name', search_screenName[i]).attr('src', "img/Entypo+/Entypo+/menu.svg").appendTo($a1);
    $("<div>").addClass("tweetText").text(search_tweetText[i]).appendTo($div);
    if (search_photo_url[0][i]) {
      $("<img>").attr('src', search_photo_url[0][i]).addClass('tweetImage').appendTo($div);
    }
    if (search_photo_url[1][i]) {
      $("<img>").attr('src', search_photo_url[1][i]).addClass('tweetImage').appendTo($div);
    }
    if (search_photo_url[2][i]) {
      $("<img>").attr('src', search_photo_url[2][i]).addClass('tweetImage').appendTo($div);
    }
    if (search_photo_url[3][i]) {
      $("<img>").attr('src', search_photo_url[3][i]).addClass('tweetImage').appendTo($div);
    }

    if (search_retweeted_user[i]) {
      $("<div>").addClass("retweetUser").text(search_retweeted_user[i] + " さんがリツイート").appendTo($div);
    }
  }
  var $parent = $("#searchTweetBox");
  var $li = $("<li>").attr('id', "getNextSearchTweet").appendTo($parent);
  var $div = $("<div>").addClass("tweet").appendTo($li);
  var $userDiv = $("<div>").appendTo($div);
  var $menudiv = $("<div>").appendTo($userDiv);

  $("<h2>").addClass("nextSearchTweet").text("続きを取得").appendTo($userDiv);

  $(".tweetText").each(function () {
    $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
  });
};

