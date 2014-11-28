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
	};

	var collection = null;
	function getCollection(cb) {
		var pieces, repo, URI;

		pieces 	= location.pathname.split('/');
		repo 	= pieces[1] + '/' + pieces[2];
		URI 	= 'https://gitscoring.herokuapp.com/' + repo + '?days=10';

		if (collection) {
			return cb(collection);
		}

		l('gs: repo endpoint: ' + URI);

		getJSON(URI, function (res) {
			l('gs: data recieved', res);

			collection = {};
			res.forEach(function (user) {
				collection[user.login] = user;
			});

			cb(collection);
		});
	};


	function getIcon(icon)
	{
		if (!icon || !icon.unicode) {
			return '';
		}

		return 'https://assets-cdn.github.com/images/icons/emoji/unicode/'+ icon.unicode + '.png';
	}

	/**
	 * Put the new HTML
	 * @param  ctx DOM layer to perform the look up
	 *
	 */
	function run (ctx) {
		ctx = ctx || document;
		var nodes = ctx.querySelectorAll(".timeline-comment-wrapper.js-comment-container > a");

		if (nodes.length === 0) {
			// console.log('gs: no nodes to display');
			return true;
		}

		getCollection(function (collection) {

			[].forEach.call(nodes, function (node) {
				if (node.hasAttribute('gs-loaded') === true) {
					return;
				}

				// run once
				node.setAttribute('gs-loaded', '');

				var html, username, user, layer, icon;

				layer 		= document.createElement('div');
				username 	= node.getAttribute('href').substring(1);
				user 		= collection[username];
				icon 		= getIcon(user.icon);

				layer.setAttribute('style', 'float:left;margin: 52px 0 0 -64px; font-size: 11px; color: #555; text-align:left');
				html =  '<div style="position: absolute;top: 30px;left: 34px;"><img src="'+ icon +'" width="24" height="24" /></div>';
				html += '<div>Q: '+ Math.round(user.quality, 2) +'%</div>';
				html += '<div>S: '+ user.score +' </div>';
				html += '<div>R: '+ user.ranking +' </div>';
				layer.innerHTML = html;

				node.parentNode.insertBefore(layer, node);
			});
		});
	}

	l('gs: extension loaded');
	run();

	window.addEventListener('load', function () {
		setTimeout(function () {
			document.addEventListener("DOMSubtreeModified", function(e){
				if (e.target.tagName.toLowerCase() === 'div' && e.target.hasAttribute('data-pjax') === true) {
					run(e.target);
					return;
				}
			});
		}, 1000);
	}, false);

}());