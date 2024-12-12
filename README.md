Ejs- ejs is to generate server side rendering HTML templates


Data Association - when we joint User with their post using exchange their _Ids is called Data Association.




->At Starting we have npm install with Node.

-> Then install express-generator Globally

    npm i express-generator -g        
        -> install from CMD in Desktop



Steps to Creeate new App =>

->open CMD move to your Folder and Open CMD with that folder, and then write

    express appName --view=ejs

-> Enter in appName project

    cd appName

->then write "npm i"
    
-> Write "code ." to open VS Code.



Data Association (Work between 2 models)
    -> Refers to process linking or maching data points across different data sets, sources.
    -> Ex- user has multiple post. how we can say that this post is of that user? and also how we can say that this user make how much post? this Question's solution gives Data Association.
    -> Data Association will do just one thing. It take Id from user and post then give to each other to indicate that this post provided by this user and that user posted how much posts.
    -> Data Association - when we joint User with their post using exchange their _Ids is called Data Association.


Now Here i provide all Steps i do in This Post.
1. Install mongoose
2. Make 2 models in routes.
    1. users.js
    2. posts.js
3. index.js from routes will use that model and create 2 routes,
    1. get "/createuser"
    2. get "/createpost"
4. provide own id to each other Collection in Schema inside routes

    1. posts.js

        <!-- user:{
            type: mongoose.Schema.Type.ObjectId,
            ref: 'User'
        } -->

    2. user.js

        <!-- posts:[{
            type:mongoose.Schema.Type.ObjectId,
            ref: "Post"
        }] -->

5. index.js
    1. get "/createuser"
        ->add new Attributes, as such 
            
            <!-- user: "id of user 66bbaa40a7c519ca2b419887" -->
    
    2. get "/createpost"
        ->first get id of user and then push product id using push()

            <!-- let user = await userModel.findOne({_id:"id of user 66bbaa40a7c519ca2b419887"})
            user.posts.push(createpost._id);
            await user.save();
            res.json(user); -->
    
    3. get "/alluserposts"
        ->use to find perticular user's posts also when we try to display all details of user that time we can't see posts details only postid can see there for we should use .populate("Field name of userModel which we wont document. ")

            <!-- let user = await userModel.findOne({_id:"66bbaa40a7c519ca2b419887"})
            .populate("posts")
            res.send(user); -->


6. install passport passport-local passport-local-mongoose mongoose express-session

        npm i passport passport-local passport-local-mongoose mongoose express-session

    -> create Session

        <!-- app.use(session({
            resave:false,
            saveUninitialized:false,
            secret:"created Session"
        })) -->

    -> Authentication & Authorization

        <!-- app.use(passport.initialize());
        app.use(passport.session());
        passport.serializeUser(usersRouter.serializeUser());
        passport.deserializeUser(usersRouter.deserializeUser()); -->

Now Start the Project
    1. /Login and /SignUp route
    2. can see profile details on your /profile, can see saved photos, also can have a "Uploaded Section" 
    3. /feed can see all images.
    4. also can open images and save that images.
    5. /board/:boradname whole board Name can see

Now search "how many models are requiered for Pinterest Clone"

7. Register API

    ->During Register Page we need username, email, fullname from body.

        <!-- const { username, email, fullname } = req.body; -->
        <!-- const userData = new userModel({ username, email, fullname }); -->

    -> Need to register Authentication we use passport.authenticate()
    
        <!-- userModel.register(userData, req.body.password)   
        .then(function () {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/profile");
            })
        }) -->

8. Login API

    ->here we use meddleware passport.authenticate()

        <!-- passport.authenticate("local",{
            successRedirect: "/profile",
            failureRedirect: "/",
        }) -->

9. Logout API
    ->here we use req.logout()

        <!-- req.logout(function (err){
            if(err) next(err)
            res.redirect('/');
        }) -->

10. create a middleware and use at /profile

        <!-- function isLoggedIn(req,res,next){
            if(req.isAuthenticated()) return next();
            res.redirect('/')
        } -->

    -> here a catch, in index.js file we just add localStrategy and use in passport const and pass userModel.authenticate()

        <!-- const localStrategy = require("passport-local")
        passport.use(new localStrategy(userModel.authenticate())); -->

11. index.ejs => Created Register UI like pinterest UI

    ![Registration Page](public/images/github%20Photos/Registration%20Page.png)

12. login.ejs => Created Login UI like pinterest Login UI

    ![Login Page](public/images/github%20Photos/Login%20Page.png)

13. new need to show flash messages using connect-flash package
    -> import connect-flash package
    
        npm i connect-flash

    -> To display flash messages we just add one line to "/login" API after failureRedirect:"/login". in index.js routes

        failureFlash: true

    -> Then go to app.js file and write one line of code before app.use(session()),

        <!-- const flash = require("connect-flash");
        app.use(flash); -->

            - This indicates flash meassages are new Active.

    -> /login router contain,

        <!-- console.log(req.flash("error")); -->

            - This error is a just like sql command it shows error which is "Password or username is incorrect".
    
    -> new we impliment flash()

        <!-- res.render("login", {error:req.flash("error")}) -->

            - pass error to login.ejs file

        <!-- <% if(error.length>0) {%>
            <p class="error">
                <%= error %>
            </p>
        <% } %> -->

            - this is use to display error inside login form

14. Make profile page with Dynamic name and username feature

    ![Profile Page](public/images/github%20Photos/User%20Profile%20Page.png)

    -> we want to pass user details from userModel to .ejs file in "/profile" API

        <!-- router.get("/profile", isLoggedIn, async function(req,res){
            const user = await userModel.findOne({
                username: req.session.passport.user
            })
            res.render("profile",{user})
        }) -->

    -> In profile.ejs file contain user details

        - To name write <%= user.fullname %>
        - To username write <%= user.username %>  


15. Now we try to make posts
    -multer : can upload images
    -uuid : provide unic name to any post. When we try to download any post that time give random(Unic) name to that file

    steps:
    1. Installation

        npm i uuid multer

    2. Create form in profile.ejs file

        <!-- <form action="/upload" method="Post" enctype="multipart/form-data">
            <input type="file" name="file">
            <button type="submit">Upload</button>
        </form> -->
    
    3. make multer.js file : this file manage all post storage destination and filename like things

        <!-- const multer = require("multer");
        const {v4: uuidv4} = require("uuid");
        const path = require("path")

        const storage = multer.diskStorage({
            destination: function (req,file,cb){
                cb(null, "./public/images/uploads")
            },
            filename:function(req,file,cb){
                const filename = uuidv4();
                cb(null, filename + path.extname(file.originalname));
            }
        }) -->

    4. Atlast index.js file should have API : this file should be post method and /upload url

        <!-- router.post("/upload", upload.single("file"),function(req,res){
            if(!req.file){
                res.status(404).send("No File were Uploaded.")
            }
            res.send("File Succesfully Uploaded.")
        }) -->

    5. Now uploaded file will be save as a post and postid should be sent to user and userid to post.

        -> first find user id in 4th Step

            <!-- const user = await userModel.findOne({username: req.session.passport.user}); -->
        
        -> create post in 4th Step

            <!-- const post = await postModel.create({
                image: req.file.filename,
                imageText: req.body.filecation
                user: user._id
            }) -->

        -> push post to user's posts in 4th Step
        
            <!-- user.posts.push(post._id); -->
            <!-- await user.save(); -->


16. Now display that posts to /profile route

    ![Posts in Profile Page](public/images/github%20Photos/User%20Profile%20with%20Post%20Page.png)

    steps:
    1. populate posts from user in index.js file

        <!-- .populate("posts"); -->

    2. go to profile.ejs file and wrap posts div.container tag

        <!-- <div class="cards">
            <% user.posts.forEach(function(post){ %>
                <div class="card" style="width: 18rem">
                    <img src="/images/uploads/<%= post.image %>" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title"><%= post.imageText %></h5>
                    </div>
                </div>
            <% }) %>
        </div> -->

    3. After post submit we need to redirect to /profile route
        -> go to index.js file and find upload API and change res.send("done") to,

        <!-- res.redirect("/profile  ") -->



17. Today, we create Edit Profile Image Button. 
    1. To do that we first add button. There we use Remix icon wesite github link at <head> to use Remix's all icons.

        <!-- <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
            rel="stylesheet"
        /> -->

    2. Now add icon button before img tag. Inside profileEdit id of div tag.

        <!-- <div class="profileEdit">
            <div class="profile-picture">
                <img
                    src="https://plus.unsplash.com/premium_photo-1696949706250-90624f778f6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile Picture">
            </div>
            <span id="uploadIcon" class="profileEditSpan">
                <i class="ri-pencil-fill"></i>
            </span>
        </div> -->

    3. Create a Form where input will be file

        <!-- <form id="uploadForm" hidden action="/fileupload" method="post" enctype="multipart/form-data">
            <input type="file" name="image">
        </form> -->

    4. when we click on edit icon that time we can select any profile photo. But how?

        <!-- <script>
            document.querySelector("#uploadIcon").addEventListener("click", function(){
                document.querySelector("#uploadForm input").click()
            })
        </script> -->


18. Now, We design post input field in profile.ejs file and add some CSS in profile.css file

    <!-- <div class="postDiv">
        <form action="/upload" method="post" enctype="multipart/form-data" class="postDiv">
            <div class="uploadDP">
                <input type="text" name="filecaption" placeholder="Some Caption" class="caption" />
                <i class="ri-folder-upload-line ProfileIcon"><input type="file" name="file" hidden /></i>
            </div>
            <input type="submit" class="submit-btn" />
        </form>
    </div> -->

19. When user click on upload button that time file upload option should open,

    <!-- document.querySelector(".uploadDP i").addEventListener("click", function () {
      document.querySelector(".uploadDP i input").click();
    }) -->

20. Navbar Arrenge to profile page
21. Provide Alternative image to new Account if they have no any DP image initially using JS Script tag.

    <!-- <script>
        document.getelementById("profile-image").addEventListener("error", function(){
            this.src = "/images/profilePics/alterImage.jpg";
        });
    </script> -->


22. We joint Nav.ejs file with Profile.ejs file

    <!-- <%- include("nav") %>   // in profile.js file -->

23. Want to Add Date to Created time in posts then,

    <!-- <%= new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(post.createdAt)) %> -->

24. Want to add Dynamic posts of all users then,

    ![Feed Page](public/images/github%20Photos/Feed%20Page.png)

    <!-- <% if (typeof posts !== 'undefined' && posts.length > 0) { %>
        <% posts.forEach(post => { %>
        <div class="box">
            <a
                    href="/images/uploads/<%= post.image %>" target="_blank">
                    <img src="/images/uploads/<%= post.image %>"
                        alt="image">
                </a>
                <div class="caption"><%= post.imageText %></div>
        </div>
        <% }) %>
    <% } else { %>
        <p>not Found Images</p>
    <% } %> -->


25. create.ejs to create User posts

    ![Create Post Page](public/images/github%20Photos/Create%20Post%20Page.png)

    1. Add link to Create Post into Nav.ejs file.
        
        <!-- <a href="/profile/create"></a> -->
    
    2. Add route for Create Post in Index.js file.
        
        <!-- router.get("/profile/create", (req, res) => {
            res.render("create");
        }) -->
    
    3. Create Form tag and make UI to Create post include Image, Title, Description also button such as Submit and Cancle.

        

    4. Form has Action and Method Attribute which is,
        
        <!-- <form action="/upload" method="post" enctype="multipart/form-data"> -->

    5. Now Create API which name is "/upload" which will check if image will not post then send status "404" and will not submit.
        
        <!-- router.post("/upload", isLoggedIn, uploadPost.single("file"), async (req,res)=>{
            if(!req.file){
                return res.status(404).send("No File Found")
            }
        }) -->

    6. Also take User details from userModel and Create post into postModel Module with take some values like Image, Title, Description, also take User ID which is most Importent.

        <!-- const user = await userModel.findOne({username:req,session.passport})
        const post = await postModel.create({
            image: req.file.filename,
            title: req.body.title,
            description: res.body.description,
            user: user._id
        }) -->

    7. Also we provide Post ID to User through push() and redirect to profile page.

        <!-- user.posts.push(post._id);
        await user.save();
        res.redirect("/profile") -->


26. When user click on Image then all Details about Image will display to use, but how?

    1. First pass post id from postlist.ejs file through URL, How?

        <!-- <a href="/post/<%= post._id %>">
            <img src="/image/uploads/<%= post.image %>">
        </a> -->

    2. Create API in index.js file which is use to past id to post.ejs file

        <!-- router.get("/post/:id", isLoggedIn, async function(req,res)=>{
            postModel.findOne({_id: req.params.id}).populate("user")
            .then(post => {
                res.render('post',{ post });
            });
        }) -->
    
    3. Now, Create that page where we Want to Display all Things 
        => post.ejs
    
    4. Now display all things using API,

        <!-- <%= post.image %>
        <%= post.title %>
        <%= post.user.username%>
        <%= post.decription%>
        <%= post.createdAt%> -->

27. Now Create Payment Option => To do this we need to import and install "stripe" Api and import,

    ![Subscription Based Plan Page](public/images/github%20Photos/Subscription%20Plan%20Page.png)

    ![Payment Gateway Page](public/images/github%20Photos/Payment%20Gateway%20Page.png)

        <!-- const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) -->

    -here secret key we get from "stripe.com => developer => API Keys => Secret Key"

    -also need to import dotenv Api for .env variable config.

        <!-- require("dotenv").config() -->

    1. Create API "/subscription" in index.js.

        <!-- router.get('/subscription',isLoggedIn, async(req,res)=>{
            res.render('subscription');
        }); -->
    
    2. Add Subscription Feature in user.js Schema with isActive, startDate, endDate, Plan, StrinpeCustomerId,StripesubscriptionId, lastPaymentDate, paymentStatus like features.

    3. Create Subscription.ejs file where user can Select plan.

    4. At "Subscribe now" button create a "a" tag which is redirect to "/subscribe" and pass "plan".
    
    5. Now When user can Select any Subscription from both. That time user will go on it's plan

    6. now plan if monthly then priceId should be of monthly plan which we can get from "stripe.com => Product Catalogue => Monthly paln => 59 rupee => At right-top corner"

    7. If plan is Yearly then "stripe.com => Product Catalogue => Yearly paln => 599 rupee => At right-top corner".

    8. Now Create session, in index.js

        <!-- const session = await stripe.checkout.sessions.create({
            mode:"subscription",
            line_items: [price:priceId,quantity:1]
            success_url: "",
            cancel_url: "",
            expand:['subscription','customer']
        }) -->

    9. Now Success_url and cancel_url needs API

        Success
        <!-- router.get('/success',isLoggedIn, async(req,res)=>{
            const sessionId = req.query.session_id
            try{
                const session = await stripe.checkout.sessions.retrieve(sessionId,{
                    expand:['subscription','customer']
                });
                if(session.payment_status === 'paid'){
                    const subscription = session.subscription;
                    const customer = session.customer;

                    find user Email

                    if(user){
                        user.subscription = {
                            isActive: true,
                            startDate: new Date(subscription.current_period_start*1000),
                            endDate: new Date(subscription.current_period_end*1000),
                            plan: subscription.plan.inerval === 'month'?"monthly":"yearly",
                            stripeCustomerId: customer.id,
                            stripeSubscriptionId: subscription.id,
                            lastPaumentDate: new Date(),
                            paymentStatus: 'paid',
                        }
                    };
                    await user.save();
                    res.render('success')
                }
            } catch(err){
                console.error('Error retrieving session:', error);
            }
        } -->


        Cancel
        <!-- router.get('/cancel', isLoggedIn, (req,res)=>{
            res.render('cancel');
        }) -->

    10. Now create success UI and cancel UI.

    ![Success Page](public/images/github%20Photos/Success%20Page.png)

    ![Failure Page](public/images/github%20Photos/Failure%20Page.png)


