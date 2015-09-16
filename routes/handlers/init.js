var passport = require('passport');

exports.index = function(req, res) {
	res.render('index');
};
exports.login = function(req, res) {
	res.render('login');
};
exports.auth = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			return res.redirect('/login')
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/');
		});
	})(req, res, next);
};