const {User} = require("../models/users");
const jwt = require('jsonwebtoken');

// this is where we handle errors(basically we want to show custom error messages for diff. types of errors)
const handleErrors = (err) => {
   // console.log(err, err.code);
    let errors = { email: '', password: '' }; // an object

   // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) { //we use the error code that  is generated if  user tries to register with an email that already exists
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    //console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
     // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
//the user id is going to be used as jwt payload | the secret key which is used to sign the jwt
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {expiresIn: maxAge}); //	Convenient option for setting the expiry time relative to the current time in seconds.
}; //whereas cookie expects time in millisec
//the jwt will automatically be destroyed after maxage time
//SYNTAX jwt.sign(payload, secretOrPrivateKey, [options, callback])

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    //this code tries to create a new user in the database using the User model
    try {
      const user = await User.create({ email, password , admin: 'false'});
      //once the user is successfully created we create a jwt, that is sent to the server in a cookie and tells it that the user is logged in
      const token = createToken(user._id);
      // putting the created jwt in a cookie and sending it back as part of the res
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // name of the token, value of the token
      //httpOnly Flags the cookie to be accessible only by the web server.

      //in future whenever the user sends a req, this jwt along with the cookie is going to be sent to the server 
      // so the server can use it to verify if the user is logged in
      res.status(201).json({ user: user._id });
      // this json data is accessed in signup.ejs as res.json();
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
      // this json data is accessed in signup.ejs as res.json();
    }
   
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}

module.exports.logout = (req, res) =>{
  res.cookie('jwt', '', {maxAge:1}) //we replace the jwt with empty string and maxAge = 1ms as soon as logout function is fired
  res.redirect('/');
}
