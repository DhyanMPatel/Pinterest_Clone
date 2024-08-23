var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require("passport");

// Add these lines before your routes
router.use(express.json()); // to parse JSON bodies
router.use(express.urlencoded({ extended: true }));  // to parse URL-encoded bodies

/// through this line user can login
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  // console.log(req.flash("error"))         // this will print flash value when failureFlash becomes true
  res.render('login', { error: req.flash("error") })
})

router.get('/feed', isLoggedIn, function (req, res, next) {
  res.render('feed')
})

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
})

router.post('/register', function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)   /// simplify user registration
    .then(function () {
      passport.authenticate("local")/* now middleware comes -> */(req, res, function () {
        res.redirect("/profile");
      })
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: '/login',
  failureFlash: true,       /// this will return array in console.
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
  res.redirect('/login')
}


module.exports = router;
