var User = require('../models/User');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user) {
				if(err || !user) return done(err, null);
				done(null, user);
			})
	});

	require('./passport_strategies/local')(passport);
};