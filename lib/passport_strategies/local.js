var User = require('../../models/User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
	passport.use(new LocalStrategy(function(username, password, done) {
		process.nextTick(function() {
			User.findOne({ username: username }, function (err, user) {
				if (err) { return done(err); }
				if (!user) { 
					return done(null, false, { 
						message: 'There is no such user'
					}); 
				}
				if (!user.authenticate(password)) { 
					return done(null, false, {
						message: 'Incorrect password'
					}); 
				}
				return done(null, user);
			});
		});
	}));
};
