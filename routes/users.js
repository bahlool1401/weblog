const { Router } = require("express");


const userController = require('../controllers/userController');

const router = new Router();



// router.get("/login",userController.login );


router.post("/login",userController.handleLogin,userController.rememberMe );


router.get("/logout",userController.logout );


// router.get("/register", userController.register);


// router.get("/forget-password", userController.forgetPassword);


router.post("/forget-password", userController.handleForgetPassword);


router.get("/reset-password/:token", userController.resetPassword);


router.post("/reset-password/:id", userController.handleResetPassword);


router.post("/register",userController.createUser );

module.exports = router;
