window.onload = function(){
	/*clickボタン遷移*/
	$("#firstButton").click(function() {
		document.querySelector('#newSection').className = 'current';
		document.querySelector('[data-position="current"]').className = 'left';
	});

	$("#backButton").click(function() {
		document.querySelector('#newSection').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});

	/*webボタン遷移*/
	$("#secondButton").click(function() {
		var myUrl = "http://pronama.azurewebsites.net/"
		var activity = new MozActivity({
			name:"view",
			data:{
				type:"url",
				url:myUrl
			}
		});
	});

};