window.onload = function () {
  //ツイート数の設定
  document.getElementById("getTweetNumber").addEventListener("click", function(){
    document.getElementById("getTweetNumberMenu").className = 'fade-in';
  }, false);
  document.getElementById("getTweetNumberMenu").addEventListener ("click", function() {
    this.className = 'fade-out';
  });
  document.getElementById("getTweetNumber10").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 10);
  }, false);
  document.getElementById("getTweetNumber20").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 20);
  }, false);
  document.getElementById("getTweetNumber30").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 30);
  }, false);
  document.getElementById("getTweetNumber40").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 40);
  }, false);
  document.getElementById("getTweetNumber50").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 50);
  }, false);
  document.getElementById("getTweetNumber100").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 100);
  }, false);
  document.getElementById("getTweetNumber200").addEventListener("click", function(){
    localStorage.setItem("getTweetNumber", 200);
  }, false);
  //アイコン画像の高解像度化
  document.getElementById("iconimagebigger").addEventListener("click", function(){
    document.getElementById("iconimagebiggerMenu").className = 'fade-in';
  }, false);
  document.getElementById("iconimagebiggerMenu").addEventListener ("click", function() {
    this.className = 'fade-out';
  });
  document.getElementById("iconimagebigger_ON").addEventListener("click", function(){
    localStorage.setItem("iconimagebigger", 1);
  }, false);
  document.getElementById("iconimagebigger_OFF").addEventListener("click", function(){
    localStorage.setItem("iconimagebigger", 0);
  }, false);
  //検索からRTを除外
  document.getElementById("searchRT").addEventListener("click", function(){
    document.getElementById("searchRTMenu").className = 'fade-in';
  }, false);
  document.getElementById("searchRTMenu").addEventListener ("click", function() {
    this.className = 'fade-out';
  });
  document.getElementById("searchRT_ON").addEventListener("click", function(){
    localStorage.setItem("searchRT", 1);
  }, false);
  document.getElementById("searchRT_OFF").addEventListener("click", function(){
    localStorage.setItem("searchRT", 0);
  }, false);
  //サイトに飛ぶ
  document.getElementById("viewShirotakaSite").addEventListener("click", function(){
    new MozActivity({
      "name": "view",
      "data": {
        "type": "url",
        "url": "http://shirotaka.org/ShirotakaTwit"
      }
    });
  }, false);
}