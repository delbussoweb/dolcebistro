module.exports = function(app, passport){
	// home page login
	app.get('/', function(req, res){
		res.render('index.html');
	});

	// login
	app.get('/login', function(req, res){
		res.redirect('/login/views/index.html', { message: req.flash('loginMessage') });
	});

	// show the signup form
	app.get('/signup', function(req, res){
		res.render('signup.html', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.get('/profile', function(req, res){
		req.logout();
		req.redirect('/');
	});

	function isLoggedIn(req, res, next){
		if(req.isAuthenticated())
			return next();

		res.redirect('/');
	}
}