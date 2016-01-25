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
                if(iconimagebigger == 1){
                        var img_tmp = tweet.user.profile_image_url_https.substring(0, tweet.user.profile_image_url_https.indexOf("normal"));
                        var fileextension = tweet.user.profile_image_url_https.slice(tweet.user.profile_image_url_https.lastIndexOf("."));
                        var profile_image_url_https2 = img_tmp + "bigger" + fileextension;
                }else{
                        var profile_image_url_https2 = tweet.user.profile_image_url_https;
                }
                mention_screenName.unshift(tweet.user.screen_name);
                mention_name_str.unshift(tweet.user.name);
                mention_tweetText.unshift(tweet.text);
                mention_id_str.unshift(tweet.id_str);
                mention_prof_img_url.unshift(profile_image_url_https2);
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
        clearMentionTweetDom();
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

        var $parent = $("#mentionBox");
        var $li = $("<li>").attr('id', "getNextMentionTweet").appendTo($parent);
        var $div = $("<div>").addClass("tweet").appendTo($li);
        var $userDiv = $("<div>").appendTo($div);
        var $menudiv = $("<div>").appendTo($userDiv);

        $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);

        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });

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
                if(iconimagebigger == 1){
                        var img_tmp = tweet.user.profile_image_url_https.substring(0, tweet.user.profile_image_url_https.indexOf("normal"));
                        var fileextension = tweet.user.profile_image_url_https.slice(tweet.user.profile_image_url_https.lastIndexOf("."));
                        var profile_image_url_https2 = img_tmp + "bigger" + fileextension;
                }else{
                        var profile_image_url_https2 = tweet.user.profile_image_url_https;
                }
                buf_screenName.push(tweet.user.screen_name);
                buf_name_str.push(tweet.user.name);
                buf_tweetText.push(tweet.text);
                buf_id_str.push(tweet.id_str);
                buf_prof_img_url.push(profile_image_url_https2);
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
        clearMentionTweetDom();
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

        var $parent = $("#mentionBox");
        var $li = $("<li>").attr('id', "getNextMentionTweet").appendTo($parent);
        var $div = $("<div>").addClass("tweet").appendTo($li);
        var $userDiv = $("<div>").appendTo($div);
        var $menudiv = $("<div>").appendTo($userDiv);

        $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);

        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });
};


//続き取得データ処理
var successGetNextMentionTimeline = function (data) {
        var tweetList = JSON.parse(data.text);
        for (var i = 1; i < tweetList.length; i++) {
                var tweet = tweetList[i];

                if(iconimagebigger == 1){
                        var img_tmp = tweet.user.profile_image_url_https.substring(0, tweet.user.profile_image_url_https.indexOf("normal"));
                        var fileextension = tweet.user.profile_image_url_https.slice(tweet.user.profile_image_url_https.lastIndexOf("."));
                        var profile_image_url_https2 = img_tmp + "bigger" + fileextension;
                }else{
                        var profile_image_url_https2 = tweet.user.profile_image_url_https;
                }
                mention_screenName.unshift(tweet.user.screen_name);
                mention_name_str.unshift(tweet.user.name);
                mention_tweetText.unshift(tweet.text);
                mention_id_str.unshift(tweet.id_str);
                mention_prof_img_url.unshift(profile_image_url_https2);

                mention_photo_url[0].unshift(null);
                mention_photo_url[1].unshift(null);
                mention_photo_url[2].unshift(null);
                mention_photo_url[3].unshift(null);
                try{
                        mention_photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
                        mention_photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
                        mention_photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
                        mention_photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;

                } catch (e) {
                }

        }
        clearMentionTweetDom();
        addFirstMentionTweetToDom(tweet);
};


