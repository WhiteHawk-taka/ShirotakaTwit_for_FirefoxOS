// oauthオブジェクト
var oauth;

var mention_screenName = new Array();
var mention_name_str = new Array();
var mention_tweetText = new Array();
var mention_id_str = new Array();
var mention_prof_img_url = new Array();
var mention_favorited = new Array();
var repId;


window.onload = function(){
	// OAuth関連の処理を開始する
	var loadingop = localStorage.getItem("loading");
	if(loadingop == 0){
		firstOAuthFunc();
		first_getMentionTimeline();
		localStorage.setItem("loading", 1);
	}else{
		addMentionTweetToDom();
	}

};

//メンションの削除
var clearMentionTweetDom = function(){
	var parent = $("#mentionBox");
	parent.empty();
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
	addMentionTweetToDom(tweet);
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

//メンション書き出し処理
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
