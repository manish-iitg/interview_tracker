//require is same as import in django
const express = require('express');
const mongoose = require('mongoose');        
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, adminAuth } = require('./middleware/authmiddle');

//importing the routes handler moules
const authroutes = require ('./routes/authRoute');  
const adminroutes = require('./routes/adminRoute');
const progroutes = require('./routes/progRoute');
const IVexproutes = require('./routes/interviewRoute');

//creating a express application
//this object, which is traditionally named app, has methods for routing HTTP requests,
// configuring middleware, rendering HTML views, registering a template engine, 
//and modifying application settings that control how the application behaves 
//(e.g. the environment mode, whether route definitions are case sensitive, etc.)
const app = express();


//mongodb(NoSQL) database connection using mongoose
// create this connection string(database that is hoisted online) on mongodb.com using clusters
const dbURI = 'mongodb+srv://Manish:test123123@cluster0.moy8o.mongodb.net/test';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
// this options obj allows us to run the code without any deprication,warning, etc
// once the connection is successful, only then the app listens to the requests made at the client side using port 3000
//since this is asyn we use then (we want to list to port  3000 only after we have made the connection)
  .then((result) => app.listen(5000))
//if the connection fails it just logs an error into the console
  .catch((err) => console.log(err));
// the above async code return a promise. if it is resolved, the .then method is run . otherwise if it is rejacted or some
//error is thrown then catch block is run.


// middleware - the code that runs b/w the req and the res
// it makes static files like css public
//This example shows a middleware function with no mount path.
// The function is executed every time the app receives a request.
app.use(express.static('public'));
app.use(express.json());
// load the cookie-parsing middleware
app.use(cookieParser());
app.use('/admin', 
  adminAuth,
  adminroutes);
app.listen(process.env.PORT || 8080, () => console.log('Admin Bro is under localhost:5000/admin'));
//To load the middleware function in the express middleware stack , call app.use(), specifying the middleware function.


// view engine ejs is used to display dynamic data on the website(such as variable name,etc) 
//instead of simple html
//A template engine is a tool that enables insertion of variables into the final output of the template or run some programming 
//logic at run-time before sending the final HTML to the browser for display.
app.set('view engine', 'ejs');
//default view/templating engine of express is jade


// routes handler
app.get('*', checkUser); // the asterisk symbol denotes that for all routes the checkUser middleware will be fired
//home route renders home view
//The function handles GET requests to the / path.
app.get('/', requireAuth, (req, res) => res.render('home')); // the second parameter says that unauthorized users will not be shown this page
app.get('/about', (req, res) => res.render('about'));
app.get('/contacts', (req, res) => res.render('contacts'));
app.use('/admin', adminroutes);
app.use(authroutes);
app.use(progroutes);
app.use(IVexproutes);
app.get('/*', (req, res) => res.render('404error'));