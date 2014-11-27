(function(){
	function l(s) {
		if (console) {
			console.log(s);
		}
	};

	function getJSON(URL, cb) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				cb(JSON.parse(xhr.responseText));
			}
		};
		xhr.open("GET", URL, false);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.send(null);
	}

	function run () {
		var nodes, usernames, collection = {}, URI, pieces, repo;

		pieces 	= location.pathname.split('/');
		repo 	= pieces[1] + '/' + pieces[2];
		URI 	= 'https://gitscoring.herokuapp.com/' + repo;

		l('repo endpoint: ' + URI);


		nodes = document.querySelectorAll(".timeline-comment-wrapper.js-comment-container > a");

		if (nodes.length === 0) {
			console.log('no nodes to display');
			return true;
		}

		getJSON(URI, function (res) {
			log('gs data recieved', res);
		});
	}

	l('git score extension loaded');
	window.addEventListener('load', run, false);
}());