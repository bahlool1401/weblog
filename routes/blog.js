const { Router } = require('express');
const router = new Router()
const blogController  =require('../controllers/blogController');
//desc :  index weblog route


router.get("/",blogController.getIndex)


router.get("/post/:id",blogController.getSinglePost)

// router.get("/contact",blogController.getContactPage)


router.get("/captcha.png",blogController.getCaptcha)

router.post("/contact",blogController.handleContactPage)


// router.post("/search",blogController.handleSearch)



module.exports = router