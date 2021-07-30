const jwt = require('jsonwebtoken');
const {User} = require('../models/users');
const adminroutes = require('../routes/adminRoute');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
       // console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
//res.locals
/*An object that contains response local variables scoped to the request, and therefore available only to the view(s) 
rendered during that request / response cycle (if any).This property is useful for exposing request-level information such as 
the request path name, authenticated user, user settings, and so on.
*/

const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', async(err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        let user = await User.findById(decodedToken.id);
        if(user.admin){
          next();
        }
        else{
          res.render('accessRestricted', {user});
        }
   
      }
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = { requireAuth, checkUser, adminAuth };
