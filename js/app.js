window.onload = function(){
	$("#firstButton").click(function() {
		document.querySelector('#newSection').className = 'current';
		document.querySelector('[data-position="current"]').className = 'left';
	});

	$("#backButton").click(function() {
		document.querySelector('#newSection').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});
};