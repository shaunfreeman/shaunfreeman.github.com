if (!window.console){
	window.console = {};
	window.console.log = function(){};
}

function TagCloud(d) {
	var reposListTag = $('repos-list-tag');
	var repos = d.user.repositories;
	var html = '<dl>';
	repos.each(function(repo){
		if (repo.private || repo.fork) return;
		html += '<dt><a href="{url}">{name}</a></dt><dd>{description} &middot; ({forks}f/{watchers}w)</dd>'.substitute(repo);
	});
	html += '</dl>';
	reposListTag.set('html', html);
	reposListTag.getElements('a').each(function(el){
		var shuffle = new shuffleText(el);
		var dd = el.getParent('dt').getNext('dd');
		el.addEvents({
			mouseenter: function(){
				shuffle.start();
				dd.tween('color', '#fff');
			},
			mouseleave: function(){
				dd.tween('color', '#606060');
			}
		});
	});
}

window.addEvent('domready', function(){
	
	var mh = new MooHub();
	mh.grabUserInfo('vincentbluff', function(d){
		console.log(d);
		TagCloud(d);
	});
});