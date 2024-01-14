const { Router } = require('express');
const router = new Router()
const blogController  =require('../controllers/blogController');
//desc :  index weblog route


router.get("/",blogController.getIndex)


router.get("/post/:id",blogController.getSinglePost)





module.exports = router