var MooHub = new Class({

	Implements: [Options],
	
	options: {
		version: 'v3',
		url: 'https://api.github.com/users/shaunfreeman/repos'
	},
	
	initialize: function(options){
		this.setOptions(options);
	},
	
	grabCommits: function(username, repository, tree, fn){
		var data = encodeURIComponent(username) + '/' + encodeURIComponent(repository) + '/commits/' + encodeURIComponent(tree);
		this.request(data, fn);
	},

	grabCommit: function(username, repository, tree, commit, fn){
		var data = encodeURIComponent(username) + '/' + encodeURIComponent(repository) + '/commit/' + encodeURIComponent(commit);
		this.request(data, fn);
	},
	
	searchRepo: function(term, fn){
		var data = 'search/' + encodeURIComponent(term);
		this.request(data, fn);
	},
	
	grabUserInfo: function(username, fn){
		this.request(encodeURIComponent(username), fn);
	},

	request: function(data, fn){
		var url = 'http://github.com/api/' + this.options.version + '/json/' + data;
		new Request.JSONP({
			url: this.options.url,
			onComplete: fn
		}).send();
	}

});
