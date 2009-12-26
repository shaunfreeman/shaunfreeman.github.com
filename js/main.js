if (!window.console){
	window.console = {};
	window.console.log = function(){};
}

window.addEvent('domready', function(){
	
	$('logo').reflect();
	
	var reposList = $('repos-list');
	var mh = new MooHub();
	mh.grabUserInfo('vincentbluff', function(d){
		//console.log(d);
		var repos = d.user.repositories;
		var html = '<dl>';
		repos.each(function(repo){
			if (repo.private) return;
			html += '<dt><a href="{url}">{name}</a></dt><dd>{description} &middot; ({forks}f/{watchers}w)</dd>'.substitute(repo);
		});
		html += '</dl>';
		reposList.set('html', html);
		reposList.getElements('a').each(function(el){
			var shuffle = new shuffleText(el);
			var dd = el.getParent('dt').getNext('dd');
			el.addEvents({
				mouseenter: function(){
					shuffle.start();
					dd.tween('color', '#fff');
				},
	mouseleave: function(){
		dd.tween('color', '#ccc');
	}
			});
		});
	});
});