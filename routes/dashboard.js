const { Router } = require('express');
const router = new Router()
const {authenticate} = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/', authenticate, adminController.getDashboard)


router.get('/add-post', authenticate, adminController.getAddPost)


router.post('/add-post', authenticate, adminController.createPost)


router.post('/image-upload', authenticate, adminController.uploadImage)


module.exports = router
