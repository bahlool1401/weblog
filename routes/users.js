const { Router } = require("express");


const userController = require('../controllers/userController');

const router = new Router();



//  @desc   Login Page
//  @route  GET /users/login
router.get("/login",userController.login );

//  @desc   Login handle
//  @route  post /users/login
router.post("/login",userController.handleLogin,userController.rememberMe );

//  @desc   logout handle
//  @route  /users/logout
router.get("/logout",userController.logout );


//  @desc   Register Page
//  @route  GET /users/register
router.get("/register", userController.register);

// forget password******
router.get("/forget-password", userController.forgetPassword);

// handle forget password****
router.post("/forget-password", userController.handleForgetPassword);


// get reset passWord*******
// router.get("/reset-password/:token",userController.resetPassword)

router.get("/reset-password/:token", userController.resetPassword);

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register",userController.createUser );

module.exports = router;
