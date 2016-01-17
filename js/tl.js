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
        tweetIndex: for (var i = 0; i < tweetList.length; i++) {
                var tweet = tweetList[i];
                for (var j = 0; j < id_str.length; j++) {
                        var buf = id_str[j];
                        if (tweet.id_str == buf) {
                                break tweetIndex;
                        }
                }
                //retweeted
                console.log(tweet);
                if(tweet.retweeted_status){
                        retweeted_user.unshift(tweet.user.name);
                        screenName.unshift(tweet.retweeted_status.user.screen_name);
                        name_str.unshift(tweet.retweeted_status.user.name);
                        tweetText.unshift(tweet.retweeted_status.text);
                        id_str.unshift(tweet.retweeted_status.id_str);
                        prof_img_url.unshift(tweet.retweeted_status.user.profile_image_url);
                        try{
                                photo_url[0].unshift(tweet.retweeted_status.extended_entities.media[0].media_url_https);
                                photo_url[1].unshift(tweet.retweeted_status.extended_entities.media[1].media_url_https);
                                photo_url[2].unshift(tweet.retweeted_status.extended_entities.media[2].media_url_https);
                                photo_url[3].unshift(tweet.retweeted_status.extended_entities.media[3].media_url_https);

                        } catch (e) {
                                try{
                                        if(photo_url[0][i] === undefined){
                                                photo_url[0].unshift(tweet.retweeted_status.entities.media[0].media_url_https);
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
                } else{

                        //general
                        retweeted_user.unshift(null);
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

        }
        clearTweetDom();
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

                if(retweeted_user[i]){
                        $("<div>").addClass("retweetUser").text(retweeted_user[i] + " さんがリツイート").appendTo($div);
                }
	}
        var $parent = $("#tweetBox");
        var $li = $("<li>").attr('id', "getNextTweet").appendTo($parent);
        var $div = $("<div>").addClass("tweet").appendTo($li);
        var $userDiv = $("<div>").appendTo($div);
        var $menudiv = $("<div>").appendTo($userDiv);

        $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);

        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });


};

//通常ライムライン取得データ処理
var successGetHomeTimeline = function (data) {
        var buf_photo_url = [[], [], [], []];
        var tweetList = JSON.parse(data.text);
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
                        if(tweet.retweeted_status){
                                if(tweet.retweeted_status.id_str == buf){
                                        break tweetIndex1;
                                }
                        }else{
                                if (tweet.id_str == buf) {
                                        break tweetIndex1;
                                }
                        }
                }

                if(tweet.retweeted_status){
                        buf_retweeted_user.push(tweet.user.name);
                        buf_screenName.push(tweet.retweeted_status.user.screen_name);
                        buf_name_str.push(tweet.retweeted_status.user.name);
                        buf_tweetText.push(tweet.retweeted_status.text);
                        buf_id_str.push(tweet.retweeted_status.id_str);
                        buf_prof_img_url.push(tweet.retweeted_status.user.profile_image_url);
                        try{
                                buf_photo_url[0].push(tweet.retweeted_status.extended_entities.media[0].media_url_https);
                                buf_photo_url[1].push(tweet.retweeted_status.extended_entities.media[1].media_url_https);
                                buf_photo_url[2].push(tweet.retweeted_status.extended_entities.media[2].media_url_https);
                                buf_photo_url[3].push(tweet.retweeted_status.extended_entities.media[3].media_url_https);

                        } catch (e) {
                                try{
                                        if(buf_photo_url[0][i] === undefined){
                                                buf_photo_url[0].push(tweet.retweeted_status.entities.media[0].media_url_https);
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
                }else{
                        buf_retweeted_user.push(null);
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


        }
        buf_retweeted_user.reverse();
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

                if(retweeted_user[i]){
                        $("<div>").addClass("retweetUser").text(retweeted_user[i] + " さんがリツイート").appendTo($div);
                }
	}

        var $parent = $("#tweetBox");
        var $li = $("<li>").attr('id', "getNextTweet").appendTo($parent);
        var $div = $("<div>").addClass("tweet").appendTo($li);
        var $userDiv = $("<div>").appendTo($div);
        var $menudiv = $("<div>").appendTo($userDiv);

        $("<h2>").addClass("nextTweet").text("続きを取得").appendTo($userDiv);
        $(".tweetText").each(function(){
                $(this).html($(this).html().replace(/(https?|ftps?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a target="_blank" href="$&">$&</a>'));
        });

};


//続き取得データ処理
var successGetNextHomeTimeline = function (data) {
        var tweetList = JSON.parse(data.text);
        console.log(tweetList);
        for (var i = 1; i < tweetList.length; i++) {
                var tweet = tweetList[i];

                //retweeted
                console.log(tweet);
                if(tweet.retweeted_status){
                        retweeted_user.unshift(tweet.user.name);
                        screenName.unshift(tweet.retweeted_status.user.screen_name);
                        name_str.unshift(tweet.retweeted_status.user.name);
                        tweetText.unshift(tweet.retweeted_status.text);
                        id_str.unshift(tweet.retweeted_status.id_str);
                        prof_img_url.unshift(tweet.retweeted_status.user.profile_image_url);

                        photo_url[0].unshift(null);
                        photo_url[1].unshift(null);
                        photo_url[2].unshift(null);
                        photo_url[3].unshift(null);
                        try{
                                photo_url[0][0] = tweet.retweeted_status.extended_entities.media[0].media_url_https;
                                photo_url[1][0] = tweet.retweeted_status.extended_entities.media[1].media_url_https;
                                photo_url[2][0] = tweet.retweeted_status.extended_entities.media[2].media_url_https;
                                photo_url[3][0] = tweet.retweeted_status.extended_entities.media[3].media_url_https;

                        } catch (e) {
                        }
                } else{

                        //general
                        retweeted_user.unshift(null);
                        screenName.unshift(tweet.user.screen_name);
                        name_str.unshift(tweet.user.name);
                        tweetText.unshift(tweet.text);
                        id_str.unshift(tweet.id_str);
                        prof_img_url.unshift(tweet.user.profile_image_url);

                        photo_url[0].unshift(null);
                        photo_url[1].unshift(null);
                        photo_url[2].unshift(null);
                        photo_url[3].unshift(null);
                        try{
                                photo_url[0][0] = tweet.extended_entities.media[0].media_url_https;
                                photo_url[1][0] = tweet.extended_entities.media[1].media_url_https;
                                photo_url[2][0] = tweet.extended_entities.media[2].media_url_https;
                                photo_url[3][0] = tweet.extended_entities.media[3].media_url_https;

                        } catch (e) {
                        }
                }

        }
        clearTweetDom();
        addFirstTweetToDom(tweet);
};

