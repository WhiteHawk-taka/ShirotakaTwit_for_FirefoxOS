//エラー系のダイアログ処理/////////////////////////////////////////////////////
//成功時の出力ログ
var successHandler = function () {
  console.log("success");
};

var failureTimeLineHandler = function (data) {
  alert("タイムラインの取得に失敗しました");
};

var failurePostHandler = function (data) {
  alert("ツイートに失敗しました");
};

var failureGetUserDataHandler = function (data) {
  alert("ユーザー情報の取得に失敗しました");
};

var failureSearchHandler = function (data) {
  alert("検索に失敗しました");
};

var nonerror = function (data) {
};
