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


