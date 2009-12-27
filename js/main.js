
function TagCloud(repos) {
	var reposListTag = $('repos-list-tag');
	var html = '<dl>';
	
	repos.each(function(repo){
		if (repo.private || repo.fork || repo.name == 'vincentbluff.github.com') return;
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

function repoSwitch(repos) {
	var imgPath = '/raw/master/screenshot.png';
	var el = $('swap');
	var imgs = [];
	var links = [];
	
	repos.each(function(repo){
		imgs.include(repo.url+imgPath);
	});
	
	imgs = new Asset.images(imgs);
	
	imgs.each(function(img, index) {
		if (img.width > 0 && img.height > 0) {
			var uri = repos[index].name;
			links.include(uri.toURI());
			img.inject(el, 'before').addClass('swap');
		}
	});
	
	var elSwap = new Fx.ElementSwap('.swap', {
		TransitionFx: {
			duration: 3000,
			transition: 'bounce:in:out'
		},
		elementSwapDelay: 5,
		showFx: 'slide:left',
		hideFx: 'blind:left',
		autoPlay: true,
		wait: false,
		onClickView: function(index) {
			links[index].go();
		}
	});
}

window.addEvent('domready', function(){
	
	var mh = new MooHub();
	mh.grabUserInfo('vincentbluff', function(d){
		TagCloud(d.user.repositories);
		repoSwitch(d.user.repositories);
	});
});