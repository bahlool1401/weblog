const { Router } = require('express');
const router = new Router()
const blogController  =require('../controllers/blogController');
//desc :  index weblog route


router.get("/",blogController.getIndex)


module.exports = router