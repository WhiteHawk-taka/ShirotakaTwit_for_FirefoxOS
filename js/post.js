//ポスト系の処理///////////////////////////////////////////////////////////
//ツイート
var newTweetPost = function () {
  post_tweettext = "";
  post_tweettext = document.getElementById("newTweetText").value;
  tweet_media = [];
  post_imagefile = [];
  var imageFiles = document.getElementsByClassName("postImageform");
  for (var i = 0; i < imageFiles.length; i++){
    if (imageFiles[i].files[0]) {
      post_imagefile.push(imageFiles[i].files[0]);
    }
  }
  Promise.all(post_imagefile.map(function (val, index) {
    return setTweetMedia(index);
  })).then(function (data) {
    for (var i = 0; i < data.length; i++) {
      tweet_media[i] = data[i];
    }
    tweetPost();
    tweet_media.push(data);
  }, nonerror);
};

var setTweetMedia = function (i) {
  return new Promise(function (resolve, reject) {
    var data = {
      "media": post_imagefile[i]
    };
    oauth.post('https://upload.twitter.com/1.1/media/upload.json', data , function (row) {
      var mediaids = JSON.parse(row.text);
      resolve(mediaids.media_id_string);
    }, function () {
      reject();
    });
  });
};

var tweetPost = function () {
  var setdata;
  var medias = "";
  if (typeof tweet_media[0] === "undefined") {
    if (post_tweettext === "") {
      return;
    }
    setdata = {
      "status": post_tweettext
    };
    oauth.post('https://api.twitter.com/1.1/statuses/update.json', setdata, successHandler, failurePostHandler);
    return false;
  }
  for (var i = 0; i < tweet_media.length; i++) {
    medias = medias + tweet_media[i] + ",";
  }
  var medias_s = medias.substr(0 , medias.length - 1);
  if (post_tweettext === "") {
    var setdata = {
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
  tweet_media = [];
  post_imagefile = [];
  var imageFiles = document.getElementsByClassName("postImageform");
  for (var i = 0; i < imageFiles.length; i++){
    if (imageFiles[i].files[0]) {
      post_imagefile.push(imageFiles[i].files[0]);
    }
  }
  Promise.all(post_imagefile.map(function (val, index) {
    return setTweetMedia(index);
  })).then(function (data) {
    for (var i = 0; i < data.length; i++) {
      tweet_media[i] = data[i];
    }
    tweetReplyPost(repId);
    tweet_media.push(data);
  }, nonerror);
};

var tweetReplyPost = function (repId) {
  var setdata;
  var medias = "";
  if (typeof tweet_media[0] === "undefined") {
    if (post_tweettext === "") {
      return;
    }
    setdata = {
      "status": post_tweettext
    };
    oauth.post('https://api.twitter.com/1.1/statuses/update.json?in_reply_to_status_id=' + repId, setdata, successHandler, failurePostHandler);
    post_repId = "";
    return false;
  }
  for (var i = 0; i < tweet_media.length; i++) {
    medias = medias + tweet_media[i] + ",";
  }
  var medias_s = medias.substr(0 , medias.length - 1);
  if (post_tweettext === "") {
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
  $("<input>").attr("type", "file").attr("accept", "image/*").addClass("postImageform").appendTo("#postTweetImage");
  var $clearbutton = $("<button>").addClass("clearImage").appendTo("#postTweetImage");
  $("<img>").attr("id", "clearImageicon").attr("src", "img/Entypo+/Entypo+/trash.svg").appendTo($clearbutton);
};

//画像削除
var clearImageValue = function (num) {
  document.getElementsByClassName("postImageform")[num].value = "";
  if (this.value === undefined && num != 0) {
    $(".postImageform")[num].remove();
    $(".clearImage")[num].remove();
    if (document.getElementById("addPostImagebutton")) {
      return;
    }
    addNewPostImage();
  } else if (num === 0 && document.getElementsByClassName("postImageform")[num+1]) {
    $(".postImageform")[num].remove();
    $(".clearImage")[num].remove();
    if (document.getElementById("addPostImagebutton")) {
      return;
    }

  }
};

//戻す
var removeImagebutton = function () {
  for (var i = 3; i > 0; i--) {
    try {
      $(".postImageform")[i].remove();
      $(".clearImage")[i].remove();
    } catch (e) {
    }
  }
  $("#addPostImagebutton").remove();
};
