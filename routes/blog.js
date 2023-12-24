const { Router } = require('express');
const router = new Router()

//desc :  index weblog route
router.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'اولین وبلاگ بهلول',
        path:'/'
     })
})

module.exports = router