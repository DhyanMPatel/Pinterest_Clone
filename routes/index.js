var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require("passport");
const { uploadPost, profilePics } = require("./multer")
require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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

router.post("/fileupload", isLoggedIn, profilePics.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("No File were uploaded.")
  }
  // res.send("File uploaded SuccesFully")
  const user = await userModel.findOne({ username: req.session.passport.user })

  user.dp = req.file.filename;    ///contain unic name of file
  await user.save();
  res.redirect("/profile");
})

router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts")
  // console.log(user);
  res.render('profile', { user })
})

router.get('/postlist', isLoggedIn, async function (req, res) {
  const user = await userModel.find()
  const posts = await postModel.find();
  res.render('postlist', { posts, user });
})

router.get('/post/:id', isLoggedIn, async function (req, res) {
  postModel.findOne({ _id: req.params.id }).populate("user")
    .then(post => {
      // res.send(post)
      res.render('post', { post });
    });
})

router.get('/profile/create', isLoggedIn, async function (req, res) {
  res.render("create");
})

/// form action                   this will help to upload(input field name)
router.post('/upload', isLoggedIn, uploadPost.single("file"), async (req, res) => {      /// here file is same as profile.ejs input field name.
  if (!req.file) {
    return res.status(404).send("No File Were uploaded.")
  }
  // res.send("File uploaded Succesfully.")
  const user = await userModel.findOne({ username: req.session.passport.user })

  // post created
  const post = await postModel.create({
    image: req.file.filename,
    title: req.body.title,   ///create.ejs name="title"
    description: req.body.description,   ///create.ejs name="description"
    user: user._id
  })

  /// push post to user's posts
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
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

router.get('/subscription', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render('subscription', { user });
})

router.get('/subscribe', isLoggedIn, async (req, res) => {
  const plan = req.query.plan

  if (!plan) {
    return res.status(400).send({ message: "Invalid plan" })
  }

  let priceId

  switch (plan.toLowerCase()) {
    case 'monthly':
      priceId = 'price_1Q8cJCP6O804XVHpHTIelhjt'  /// priceId of Month
      break;

    case 'yearly':
      priceId = 'price_1Q8jHxP6O804XVHpf89CuqIQ'  /// priceId of Year
      break;

    default:
      return res.status(400).send({ message: "Invalid plan" })
  }

  const user = await userModel.findOne({ username: req.session.passport.user })
  const userEmail = user.email

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    customer_email: userEmail,
    // redirect when user payment was Successfully deleteOne.
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
    expand: ['subscription', 'customer']
  })

  // console.log(session);
  res.redirect(session.url);  /// redirect to url of session
})

router.get('/success', isLoggedIn, async (req, res) => {
  const sessionId = req.query.session_id      /// from /subscribe Api success_url.
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });
    if (session.payment_status === 'paid') {
      const subscription = session.subscription;
      const customer = session.customer;

      // Find the user by email
      const user = await userModel.findOne({ email: session.customer_email });

      if (user) {
        // Update the user's subscription information
        user.subscription = {
          isActive: true,
          startDate: new Date(subscription.current_period_start * 1000), // Convert UNIX timestamp to Ms Date
          endDate: new Date(subscription.current_period_end * 1000), // Convert UNIX timestamp to Ms Date
          plan: subscription.plan.interval === 'month' ? 'monthly' : 'yearly',
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          lastPaymentDate: new Date(),
          paymentStatus: 'paid'
        };

        await user.save();

        res.render('success', {
          message: 'Subscription successful!',
          subscriptionDetails: user.subscription
        });
      } else {
        res.status(404).send('User not found');
      }
    }
  } catch (error) {
    // console.log(session)
    console.error('Error retrieving session:', error);
    res.status(500).send('An error occurred');
  }
})

router.get("/cancel", isLoggedIn, (req, res) => {
  res.render('cancel');
})


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login')
}

module.exports = router;
