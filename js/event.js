$(document).on('click', '#mentionlink', function(){
	localStorage.setItem("loading",1);
});
$(document).on('click', '#homelink', function(){
	localStorage.setItem("loading",1);
});
$(document).on('click', '.newPostButton', function(){
	document.querySelector('#newTweetSection').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
$(document).on('click', '#backButton', function(){
	document.querySelector('#newTweetSection').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});
$(document).on('click', '.updateButton', function(){
	getHomeTimeline();
});
$(document).on('click', '#mentionupdateButton', function(){
	getMentionTimeline();
});

$(document).on('click', '#statusUpdateButton', function(){
	newTweetPost();
	removeImagebutton();
	document.getElementById("newTweetText").value = "";
	document.getElementsByClassName("postImageform")[0].value = "";
	document.querySelector('#newTweetSection').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});
$(document).on('click', '.clearImage', function(){
	var num = $(".clearImage").index(this);
	clearImageValue(num);
	return false;
});

//画像複数対応
$(document).change('.postImageform', function(){
	addNewPostImage();
});

$(document).on('click', '#addPostImagebutton', function(){
	addNewImageForm();
});

//ユーザー情報の表示関連
$(document).on('click', '.tweetIcon', function(){
	clearUserData();
	document.querySelector('#userdataSection').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
	getUserData($(this).attr('data-name'));
});
$(document).on('click', '#userbackButton', function(){
	document.querySelector('#userdataSection').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

//メニューを開いた時の処理
$(document).on('click', '.menu-button', function() {
	$(".tlfavicon").attr('id', $(this).attr('id'));
	$(".tlreplyicon").attr('id', $(this).attr('id'));
	$(".tlreplyicon").attr('data-name', $(this).attr('data-name'));
	$(".tlretweeticon").attr('id', $(this).attr('id'));
	$(".tltrashicon").attr('id', $(this).attr('id'));
	scname = $(this).attr('data-name');
	if(my_screenName !== scname){
		$(".tltrashicon").addClass("hide");
	}else{
	}
});
//メニューを閉じた時の処理
$(document).on('click', '.icon-closecancel', function(){
	$(".tlfavicon").attr('id', "");
	$(".tlreplyicon").attr('id', "");
	$(".tlreplyicon").attr('data-name', "");
	$(".tlretweeticon").attr('id', "");
});


//リプ
$(document).on('click', '.repform', function(){
	var repId = "";
	repId = $(this).attr('id');
	var repName = $(this).attr('data-name');
	replyCreate(repId, repName);
});
//リプ用のボタン
$(document).on('click', '#replyUpdateButton', function(){
	var repId = document.getElementById("replyUpdateButton").className;
	replyTweetPost(repId);
	removeImagebutton();
	document.getElementById("newTweetText").value = "";
	document.getElementsByClassName("postImageform")[0].value = "";
	document.querySelector('#newTweetSection').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
	$("#replyUpdateButton").attr('id', "statusUpdateButton");
	$("#replyBackButton").attr('id', "backButton");
});
$(document).on('click', '#replyBackButton', function(){
	document.getElementById("newTweetText").value = "";
	document.getElementsByClassName("postImageform")[0].value = "";
	document.querySelector('#newTweetSection').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
	$("#replyUpdateButton").attr('id', "statusUpdateButton");
	$("#replyBackButton").attr('id', "backButton");
});

//リツイート
$(document).on('click', '.tlretweeticon', function(){
	var rtId = "";
	rtId = $(this).attr('id');
	rtCreate(rtId);
	utils.status.show('リツイートしました');
});

//ふぁぼ
$(document).on('click', '.tlfavicon', function(){
	var favId = "";
	favId = $(this).attr('id');
	favoriteCreate(favId);
	utils.status.show('お気に入りに追加しました');
});

//つい消し
$(document).on('click', '.tltrashicon', function() {
	trashtweet($(this).attr('id'));
	$(".tlfavicon").attr('id', "");
	$(".tlreplyicon").attr('id', "");
	$(".tlreplyicon").attr('data-name', "");
	$(".tlretweeticon").attr('id', "");
	utils.status.show('ツイートを削除しました');
});

