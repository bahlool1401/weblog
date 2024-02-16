const User = require('../model/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer');
const jwt = require("jsonwebtoken")

// exports.login = (req, res) => {
//     res.render("login", {
//         pageTitle: "ورود به بخش مدیریت",
//         path: "/login",
//         message: req.flash("success_msg"),
//         error: req.flash('error')
//     });
// };

exports.handleLogin = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
}

exports.rememberMe = (req, res) => {
    if (req.body.rememberMe) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect("/dashboard");
};

exports.logout = (req, res) => {
    req.session = null
    req.logout(function (err) {
        if (err) {
            return (err);
        }
    })
    // req.flash("success_msg", "خروج موفقیت آمیز بود.")
    res.redirect("/users/login")
}
// exports.logout = (req, res) => {
//     req.logout();
//     req.flash("success_msg", "خروج موفقیت آمیز بود");
//     res.redirect("/users/login");
// };

// exports.register = (req, res) => {
//     res.render("register", {
//         pageTitle: "ثبت نام کاربر جدید",
//         path: "/register",
//     });
// }

exports.createUser = async (req, res) => {
    const errors = []
    try {
        await User.userValidation(req.body)
        const { fullname, email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            errors.push({ message: 'کاربری با این ایمیل موجود هست.' })
            return res.render('register', {
                pageTitle: 'ثبت نام کاربر',
                path: '/register',
                errors
            })
        }

        // const hash = await bcrypt.hash(password, 10)
        // await User.create({
        //     fullname,
        //     email,
        //     password: hash
        // })
        await User.create({
            fullname,
            email,
            password
        })
        //* send welcome email👌
        sendMail(email, fullname, "خوش آمدی به وبلاگ خودت❤", "خوشحالیم که به جمع ما وبلاگرها خوش آمدی😍")
        req.flash("success_msg", "ثبت نام موفقیت آمیز بود😍")
        res.redirect("/users/login")

    } catch (err) {
        console.log(err)

        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        });
        return res.render('register', {
            pageTitle: 'ثبت نام کاربر',
            path: '/register',
            errors: errors
        })
    }
}

// exports.forgetPassword = async (req, res) => {
//     res.render("forgetPass", {
//         pageTitle: "فراموشی رمز عبور",
//         path: '/login',
//         message: req.flash("success_msg"),
//         error: req.flash("error")
//     })
// }


exports.handleForgetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        req.flash("error", "کاربری با این ایمیل در پایگاه داده ثبت نیست");

        return res.render("forgetPass", {
            pageTitle: "فراموشی رمز عبور",
            path: "/login",
            message: req.flash("success_msg"),
            error: req.flash("error"),
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    const resetLink = `http://localhost:2000/users/reset-password/${token}`;

    sendMail(
        user.email,
        user.fullname,
        "فراموشی رمز عبور",
        `
        برای تغییر رمز عبور فعلی، روی لینک زیر کلیک بفرمایید🌹 </br>

        <a href="${resetLink}">لینک تغییر رمز عبور</a>
    `
    );

    req.flash("success_msg", "ایمیل حاوی لینک با موفقیت ارسال شد");

    res.render("forgetPass", {
        pageTitle: "فراموشی رمز عبور",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
    });
};



exports.resetPassword = async (req, res) => {
    const token = req.params.token;

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET
            /* {complete:true    /*it can be or not (describe more iform) }*/
        );
        console.log('decodedToken :', decodedToken);
    } catch (err) {
        console.log('can`t decoding🤢', err);
        if (!decodedToken) {
            return res.redirect("/404");
        }
    }

    res.render("resetPass", {
        pageTitle: "تغییر پسورد",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        userId: decodedToken.userId,
    });
};


exports.handleResetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    console.log(password, confirmPassword);


    if (password !== confirmPassword) {
        req.flash("error", "کلمه های عبور یاکسان نیستند");

        return res.render("resetPass", {
            pageTitle: "تغییر پسورد",
            path: "/login",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            userId: req.params.id,
        });
    }

    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        return res.redirect("/404");
    }

    user.password = password;
    await user.save();

    req.flash("success_msg", "پسورد شما با موفقیت بروزرسانی شد");
    res.redirect("/users/login");
};