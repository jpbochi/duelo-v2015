define(function () {
	var routes = {
		root: function(req, res) {
			res.send([
				{ rel: 'self', href: '/api' }
			]);
		}
	};

  function register(app) {
    app.get('/api', routes.root);
  }

  return { register: register };
});
