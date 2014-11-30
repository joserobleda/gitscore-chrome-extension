(function(){
	function l(s) {
		if (console) {
			console.log(s);
		}
	};

	function getEndPoint() {
		var pieces, repo, URI;

		pieces 	= location.pathname.split('/');
		repo 	= pieces[1] + '/' + pieces[2];
		URI 	= 'https://gitscoring.herokuapp.com/' + repo;

		return URI;
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
		var URI = getEndPoint() + '?days=10';

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

				var username, user;

				username 	= node.getAttribute('href').substring(1);
				user 		= collection[username];

				if (user) {
					render(node, user);
				} else {

				}
			});
		});
	}

	function getNumberIcon(number) {
		if (number > 9) {
			return;
		}

		return 'https://assets-cdn.github.com/images/icons/emoji/unicode/003'+ number +'-20e3.png';
	};

	function qualityCircle(quality) {
		var html, endpoint;

		endpoint 	= getEndPoint() + '?days=10';
		quality 	= Math.round(quality, 2);

		html  = '<a href="'+ endpoint +'" target="_blank" style="color:#555">';
		html += '<div style="position: absolute;top: 0;left: -60px;">';
		html += '<div style="background-color: #f7f7f7; width: 50px; height: 50px;position: absolute;border-radius: 50%;top: 0;left: 0;vertical-align: middle; text-align: center;font-family: helvetica;border: 1px solid #ddd;line-height: 50px;text-indent:3px">';
		html += '<strong style="font-size: 20px;">' + quality + '</strong><span style="font-size: 9px;">%</span></div></div>';
		html += '</a>';
		return html;
	}

	function render(node, user) {
		var html, layer, icon, number;

		icon  	= getIcon(user.icon);
		number 	= getNumberIcon(user.ranking);
		layer 	= document.createElement('div');

		layer.setAttribute('style', 'float:left;margin: 52px 0 0 -64px; font-size: 11px; color: #555; text-align:left');
		html = '';

		// the quality icon
		html += '<div style="position: absolute;top:30px;left:-30px;z-index:2">';
		html += '<img src="'+ icon +'" width="24" height="24" />';
		html += '</div>';

		// the quality circle
		html += qualityCircle(user.quality);

		if (number) {
			html += '<div style="position: absolute;top:36px;left:38px;z-index:2">';
			html += '<img src="'+ number +'" width="18" height="18" title="with '+ user.score + ' points of '+ user.pulls +' pull requests" />';
			html += '</div>';
		}

		layer.innerHTML = html;

		node.parentNode.insertBefore(layer, node);
	};

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