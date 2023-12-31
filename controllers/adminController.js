const Blog = require('../model/Blog');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');

const { storage, fileFilter } = require("../utils/multer");

const multer = require("multer");
// const uuid = require('uuid').v4;✖
const shortId = require('shortid');/*✔*/
const sharp = require('sharp');

exports.getDashboard = async (req, res) => {
    const page = +req.query.page || 1
    const postPerPage = 2
    try {
        const numberOfPost = await Blog.find({
            user:req.user._id
        }).countDocuments()

        const blogs = await Blog.find({ user: req.user.id }).skip((page - 1) * postPerPage).limit(postPerPage)

        res.render("private/blogs", {
            pageTitle: "داشبورد |  بخش مدیریت",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate,
            currentPage:page,
            nextPage:page + 1,
            previousPage:page - 1,
            hasNextPage:postPerPage * page < numberOfPost,
            hasPreviousPage:page>1 ,
            lastPage:Math.ceil(numberOfPost/postPerPage)
        })
    } catch (err) {
        console.log(err)
        get500(req, res)
    }

}

exports.getAddPost = (req, res) => {
    res.render("private/addPost", {
        pageTitle: 'بخش مدیریت | ساخت پست جدید',
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}


exports.createPost = async (req, res) => {
    const errorArr = [];

    try {
        await Blog.postValidation(req.body); /* اول اعتبار سنجی میکنه که از إBlog.js آمده اند. */
        await Blog.create({ ...req.body, user: req.user.id });
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/addPost", {
            pageTitle: "بخش مدیریت | ساخت پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
        });
    }
};
exports.getEditPost = async (req, res) => {
    const post = await Blog.findOne({
        _id: req.params.id,
    });

    if (!post) {
        return res.redirect("errors/404");
    }

    if (post.user.toString() != req.user._id) {
        return res.redirect("/dashboard");
    } else {
        res.render("private/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post,
        });
    }
};

exports.editPost = async (req, res) => {
    const errorArr = [];

    const post = await Blog.findOne({ _id: req.params.id });
    try {
        await Blog.postValidation(req.body);

        if (!post) {
            return res.redirect("errors/404");
        }

        if (post.user.toString() != req.user._id) {
            return res.redirect("/dashboard");
        } else {
            const { title, status, body } = req.body;
            post.title = title;
            post.status = status;
            post.body = body;

            await post.save();
            return res.redirect("/dashboard");
        }
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
            post,
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const result = await Blog.findByIdAndRemove(req.params.id);
        console.log(result);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;
    const upload = multer({
        limits: { fileSize: 4000000 },
        dest: "uploads/",
        storage: storage,
        fileFilter: fileFilter,
    }).single("image");

    upload(req, res, async (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send("حجم نباید بیش از 4 مگابایت باشد.")
            }
            res.status(400).send(err);
        } else {
            if (req.file) {
                console.log(req.file);
                const fileName = `${shortId.generate()}_${req.file.originalname}`;
                console.log("🚀 ~ upload ~ fileName:", fileName)
                await sharp({})
                    .jpeg({quality: 40})
                    .toFile(`./public/${fileName}`)
                    .catch((err) => console.log(err));
                res.status(200).send(
                    `http://localhost:3000/uploads/${fileName}`)
            } else {
                res.send("جهت آپلود باید عکسی انتخاب کنید");
            }
        }
    }); 
};