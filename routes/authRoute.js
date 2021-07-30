//we require Router function from the express package
const { Router } = require ('express');
const authController = require ('../controllers/authController');

//creating an instance of the Router
const authrouter = Router();

authrouter.get('/signup', authController. signup_get );
authrouter.post('/signup', authController.signup_post );

authrouter.get('/login', authController. login_get );
authrouter.post('/login', authController. login_post );

authrouter.get('/logout', authController.logout );

module.exports = authrouter;
