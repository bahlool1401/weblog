const debug =require('debug')("weblog");
const fileUpload = require('express-fileupload');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan =require('morgan');
const app =express()
// const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);



//* body parser***
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//*fileUpload MiddleWare
app.use(fileUpload());

//*session section
app.use(session({
    secret:"secret"/*process.env.SESSION_SECRET ?????????????*/,
    // cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
    unset:"destroy",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),

}))

app.use(passport.initialize())
app.use(passport.session())

// flash`
app.use(flash())


// const connectDB= require('./config/db');
const connectDB = require("./config/db");

const winston = require('./config/winston');

const expressLayout = require('express-ejs-layouts');


const blogRoutes =require('./routes/blog');
const path = require('path');
const dotEnv = require("dotenv");
const dashRoutes = require('./routes/dashboard');
connectDB();
debug("connected to mongo😁")

//! load config
dotEnv.config({ path: "./config/config.env" });

// passport Configuratio*****
require('./config/passport');

//*view engine
app.use(expressLayout)
app.set('view engine','ejs')
app.set("layout","./layouts/mainLayout.ejs")
app.set('views','views')


//*static folder
app.use(express.static(path.join(__dirname,'public')))
// app.use(express.static(path.join(__dirname,process.env.BOOTSTRAP)))
// app.use(express.static(path.join(__dirname,process.env.FONTAWESOME)))

// DB*************
// connectDB()
connectDB();
//*Routes
app.use(blogRoutes);
app.use('/dashboard',dashRoutes);
app.use('/users',require('./routes/users'));


//! 404 page
app.use(require('./controllers/errorController').get404);


const PORT = process.env.PORT || 5000

//! logging 
if(process.env.NODE_ENV==='development'){
    debug("morgan enabled😊")
    app.use(morgan("combined", { stream: winston.stream }))
}

app.listen(PORT, ()=>console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))
