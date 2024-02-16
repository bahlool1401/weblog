const { Router } = require('express');
const router = new Router()
const {authenticate} = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// router.get('/', authenticate, adminController.getDashboard)

// router.get('/add-post', authenticate, adminController.getAddPost)

// router.get("/edit-post/:id", authenticate, adminController.getEditPost);

router.delete("/delete-post/:id", authenticate, adminController.deletePost);


router.post('/add-post', authenticate, adminController.createPost)


router.put("/edit-post/:id", authenticate, adminController.editPost);


router.post('/image-upload', authenticate, adminController.uploadImage)


// router.post('/search', authenticate, adminController.handleDashSearch)


module.exports = router
