var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createuser', async function (req, res) {
  let createdUser = await userModel.create({
    username: "Dhyan",
    password: "Dhyan1234",
    posts: [],
    email: "dhyan@test.com",
    fullName: "Dhyan M Patel",
  })
  res.send(createdUser)
})

router.get('/createpost', async function (req, res) {
  let createdPost = await postModel.create({
    postText: "This is Post Text Description.",
    user:"66bbaa40a7c519ca2b419887"
  })
  // res.send(createPost);
  let user = await userModel.findOne({_id:"66bbaa40a7c519ca2b419887"});  /// contain user, That posted content
  user.posts.push(createdPost._id);      /// push post id to user's post Array
  await user.save();    /// save user with updated post array
  res.send('Done');
})

module.exports = router;
