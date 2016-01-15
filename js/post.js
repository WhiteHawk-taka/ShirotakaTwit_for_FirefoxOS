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
