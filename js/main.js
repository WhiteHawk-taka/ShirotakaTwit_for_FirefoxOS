window.addEventListener("load", function() {
  document.getElementById("form-textarea").addEventListener("focus", function() {
    document.getElementById("footer").className += " hidden";
  }, false);
    document.getElementById("form-textarea").addEventListener("blur", function() {
    document.getElementById("footer").className = "";
  }, false);
}, false);