var menuData = {
	"menu": [
		{ "url": "index.html", "text": "Home" },
		{ "url": "Fx.MorphElement/index.html", "text": "Fx.MorphElement" },
		{ "url": "ElementSwap/index.html", "text": "ElementSwap" },
		{ "url": "Fx.ElementSwap/index.html", "text": "Fx.ElementSwap" },
		{ "url": "Tabs/index.html", "text": "Tabs" },
		{ "url": "Fx.Tabs/index.html", "text": "Fx.Tabs" }
	]
}

var demo = {};

var VincentBluff = new Class({
	
	Extends: Request.HTML,
	
	repos: {},
	
	initialize: function() {
		
		this.parent({
			method: 'get',
			noCache: true,
			useSpinner: true,
			spinnerOptions: {},
			spinnerTarget: $('contentWrap')
		});
		
		this.mh = new MooHub();

                this.mh.grabUserInfo('shaunfreeman', function(d){
                                        console.log(d);
					this.repos = d.user.repositories;
					//this.callChain();
				});

                this.TagCloud();
				this.repoSwitch();
		
		/*this.chain(
			function(){
				this.mh.grabUserInfo('shaunfreeman', function(d){
                                        console.log(d);
					this.repos = d.user.repositories;
					this.callChain();
				}.bind(this));
			}.bind(this),
			function(){
				this.TagCloud();
				this.repoSwitch();
			}
		);
		this.callChain();*/
		
		this.menu()
	},
	
	menu: function() {
		
		var ul = new Element('ul', { id: 'navibar' });
		
		menuData.menu.each(function(item){
			
			var li = new Element('li');
			
			var p = new Element('p', {
				class: 'buttonLeave',
				text: item.text
			});
			
			var a = new Element('a', {
				href: item.url,
				events: {
					'mouseenter': function(e){
						var el = this.getPrevious();
						el.addClass('buttonEnter');
						el.tween('color', '#daa520');
					},
					'mouseleave': function(e){
						var el = this.getPrevious();
						el.removeClass('buttonEnter');
						el.tween('color', '#fff');
					},
					'click': function(e){
						if (a.getPrevious().get('text') == 'Home') return;
						e.stop();
						this.options.url = a.get('href');
						this.send();
					}.bind(this)
				}
			});
			
			p.inject(li);
			a.inject(li);
			li.inject(ul);
			
		}.bind(this));
		
		ul.inject('sidebar');
	},
	
	TagCloud: function (repos) {
		var reposListTag = $('repos-list-tag');
		var html = '<dl>';
		
		this.repos.each(function(repo){
			if (repo.private || repo.fork || repo.name == 'shaunfreeman.github.com') return;
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
	},
	
	repoSwitch: function (repos) {
		var imgPath = '/master/screenshot.png';
		var el = $('swap');
		var imgs = [];
		var links = [];
		
		this.repos.each(function(repo){
			imgs.include(repo.url+imgPath);
		});
		
		var count = new Element('p').inject(el);
		
		imgs = new Asset.images(imgs, {
			onProgress: function(counter, index) {
				var text = counter+' of '+imgs.length;
				count.set('text', text);
			},
			onComplete: function() {
				
				var removedElement = count.dispose();
				
				imgs.each(function(img, index) {
					if (img.width > 0 && img.height > 0) {
						var uri = this.repos[index].name + '/index.html';
						links.include(uri);
						img.inject(el).addClass('swap');
					}
				}.bind(this));
				
				this.Swap = new Fx.ElementSwap('.swap', {
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
						this.options.url = links[index];
						this.send();
					}.bind(this)
				});
			}.bind(this)
		});
	},
	
	success: function(text) {
		
		var options = this.options, response = this.response;
		
		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});
		
		var title = text.match(/<title>([\s\S]*?)<\/title>/i);
		
		document.title = title[1];
		
		var html = this.processHTML(response.html);

		response.tree = html.childNodes;
		response.elements = html.getElements('div.container');
		
		document.id('content').empty().adopt(response.elements);
		
		$clear(demo.slideShow);
		
		$exec(response.javascript);
		
		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}
});

window.addEvent('domready', function(){
	var vb = new VincentBluff();
});