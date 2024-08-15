var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require("passport");

/// throuh this line user can login
const localStrategy = require("passoprt-local")
passport.authenticate(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.send("Profile page");
})

router.post('/register', function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req, body.password)   /// simplify user registration
    .then(function () {
      passport.authenticate("local")/* now middleware comes -> */(req, res, function () {
        res.redirect("/profile");
      })
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: '/'
}), function (req, res) {

})

router.get("/logout", function (req, res) {
  req.logout(function (error) {
    if (error) { return next(error) }
    res.redirect('/');
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/')
}

module.exports = router;
