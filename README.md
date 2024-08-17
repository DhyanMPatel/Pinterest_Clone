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



Data Association
    -> Refers to process linking or maching data points across different data sets, sources.
    -> Ex- user has multiple post. how we can say that this post is of that user? and also how we can say that this user make how much post? this Question's solution gives Data Association.
    -> Data Association will do just one thing. It take Id from user and post then give to each other to indicate that this post provided by this user and that user posted how much posts.


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

        user:{
            type: mongoose.Schema.Type.ObjectId,
            ref: 'User'
        }

    2. user.js

        posts:[{
            type:mongoose.Schema.Type.ObjectId,
            ref: "Post"
        }]

5. index.js
    1. get "/createuser"
        ->add new Attributes, as such 
            
            user: "id of user 66bbaa40a7c519ca2b419887"
    
    2. get "/createpost"
        ->first get id of user and then push product id using push()

            let user = await userModel.findOne({_id:"id of user 66bbaa40a7c519ca2b419887"})
            user.posts.push(createpost._id);
            await user.save();
            res.json(user);
    
    3. get "/alluserposts"
        ->use to find perticular user's posts also when we try to display all details of user that time we can't see posts details only postid can see there for we should use .populate("Field name of userModel which we wont document. ")

            let user = await userModel.findOne({_id:"66bbaa40a7c519ca2b419887"})
            .populate("posts")
            res.send(user);


6. install passport passport-local passport-local-mongoose mongoose express-session

        npm i passport passport-local passport-local-mongoose mongoose express-session

    -> create Session

        app.use(session({
            resave:false,
            saveUninitialized:false,
            secret:"created Session"
        }))

    -> Authentication & Authorization

        app.use(passport.initialize());
        app.use(passport.session());
        passport.serializeUser(usersRouter.serializeUser());
        passport.deserializeUser(usersRouter.deserializeUser());

Now Start the Project
    1. /Login and /SignUp route
    2. can see profile details on your /profile, can see saved photos, also can have a "Uploaded Section" 
    3. /feed can see all images.
    4. also can open images and save that images.
    5. /board/:boradname whole board Name can see

Now search "how many models are requiered for Pinterest Clone"

7. Register API
    ->During Register Page we need username, email, fullname from body.

        const { username, email, fullname } = req.body;
        const userData = new userModel({ username, email, fullname });

    -> Need to register Authentication we use passport.authenticate()
    
        userModel.register(userData, req.body.password)   
        .then(function () {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/profile");
            })
        })

8. Login API
    ->here we use meddleware passport.authenticate()

        passport.authenticate("local",{
            successRedirect: "/profile",
            failureRedirect: "/",
        })

9. Logout API
    ->here we use req.logout()

        req.logout(function (err){
            if(err) next(err)
            res.redirect('/');
        })

10. create a middleware and use at /profile

        function isLoggedIn(req,res,next){
            if(req.isAuthenticated()) return next();
            res.redirect('/')
        }
