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
			res.forEach(function (user) {
				collection[user.login] = user;
			});

			[].forEach.call(nodes, function (node) {
				var html, username, user, layer;

				layer 		= document.createElement('div');
				username 	= node.getAttribute('href').substring(1);
				user 		= collection[username];

				layer.setAttribute('style', 'float:left;margin: 52px 0 0 -64px; font-size: 11px; color: #555; text-align:left');
				html = '<div>Q: '+ Math.round(user.quality, 2) +'%</div>';
				html += '<div>S: '+ user.score +' </div>';
				html += '<div>R: '+ user.ranking +' </div>';
				layer.innerHTML = html;

				node.parentNode.insertBefore(layer, node);
			});

			l('gs data recieved', res);
		});
	}

	l('git score extension loaded');
	run();
}());