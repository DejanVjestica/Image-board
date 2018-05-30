// express
// console.log(app);
const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");
// public files ----------------------------------------

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    console.log("in route /images ");
    db
        .getImages()
        .then(result => {
            // res.json(result.rows);
            // console.log(result.rows);
            res.json({
                images: result.rows
            });
        })
        .catch(function(err) {
            console.log("In route /images ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log(req.body.title);
    // console.log(req.body.description);
    // console.log(req.body.username);
    // console.log(config.s3Url + req.file.filename);
    db
        .insertImage(
            req.body.title,
            req.body.description,
            req.body.username,
            config.s3Url + req.file.filename
        )
        .then(function(results) {
            // console.log(results);
            console.log("in route /upload then:");
            // res.json({
            //     id: results.rows[0].id,
            //     title: req.body.title,
            //     description: req.body.description,
            //     username: req.body.username,
            //     url: config.s3Url + req.file.filename
            // });
            res.json({
                image: results.rows[0]
            });
        })
        .catch(function(err) {
            console.log("In route /upload ", err);
        });

    // if (req.file) {
    // s3Upload(req.files).then(() => {
    //     return db.insertImage();
    // });
    // res.json({ img: req.file.filename });
    // } else {
    // }
    //
    // insertIma#ge(url, username, title, description);
    // res.json({ img: req.file.filename });
    // console.log("index.js: ");
});
// ===============  End of server ==================
app.listen(8080, () => console.log("Listening"));
// =================================================
// =================================================

// // express
// const express = require("express");
// const app = express();
// //
// const hb = require("express-handlebars");
// const csurf = require("csurf");
// const cookieSession = require("cookie-session");
// // custom modules
// const db = require("./db");
// const urlPublic = __dirname + "/public";
// // =====================================================
// // ==================== Midleware  =====================
// // =====================================================
// // handlebars ------------------------------------------
// app.engine("handlebars", hb());
// app.set("view engine", "handlebars");
// // body parser -----------------------------------------
// app.use(
//     require("body-parser").urlencoded({
//         extended: false
//     })
// );
// // cookie parser ---------------------------------------
// app.use(require("cookie-parser")());
// // public files ----------------------------------------
// app.use(express.static(urlPublic));
// // cookie session ---------------------------------------
// app.use(
//     cookieSession({
//         secret: `I'm always angry.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );
// // csurf creates a session ----------------------------
// app.use(csurf());
// app.use(function(req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     res.setHeader("X-Frame", "DENY");
//     next();
// });
// // =====================================================
// // ==================== Routes  ========================
// // =====================================================
// // Home page route, ------------------------------------
// app.get("/", (req, res) => {
//     // console.log("route /: ", req.session);
//     res.redirect("/register");
// });
// // register route ---------------------------------------
// app.get("/register", requireLoggedOut, (req, res) => {
//     // console.log("get register in");
//     res.render("register", {
//         layout: "main",
//         message: "Please register new acount"
//     });
// });
// app.post("/register", (req, res) => {
//     //
//     db
//         .hashPassword(req.body.password)
//         .then(function(hashedPassword) {
//             //
//             db
//                 .registerUser(
//                     req.body.first,
//                     req.body.last,
//                     req.body.email,
//                     hashedPassword
//                 )
//                 .then(function(body) {
//                     // console.log(body);
//                     let userId = body.rows[0].id;
//                     let first = req.body.first;
//                     let last = req.body.last;
//                     let email = req.body.email;
//                     // setting cookie session
//                     req.session.userId = userId;
//                     req.session.last = last;
//                     req.session.first = first;
//                     req.session.email = email;
//                     res.redirect("/profile");
//                 })
//                 .catch(function(e) {
//                     console.log("register user: ", e);
//                     res.render("register", {
//                         layout: "main",
//                         message: "Please register new acount",
//                         error: "email already exist, please use diferent one"
//                     });
//                 });
//         })
//         .catch(function(e) {
//             console.log("/register: ", e);
//         });
//
//     // ------------------------
// });
// // profile route ---------------------------------------
// app.get("/profile", (req, res) => {
//     res.render("profile", {
//         layout: "main",
//         message: req.session.first + " please tell us more about you self"
//         // error: "email already exist, please use diferent one"
//     });
//     // res.redirect("/register");
// });
// app.post("/profile", requireNoUserId, (req, res) => {
//     // res.redirect("/register");
//     let age, city, homepage;
//     db
//         .profile(
//             req.body.age,
//             req.body.city,
//             req.body.homepage,
//             req.session.userId
//         )
//         .then(function() {
//             age = req.body.age;
//             city = req.body.city;
//             homepage = req.body.homepage;
//             req.session.age = age;
//             req.session.city = city;
//             req.session.homepage = homepage;
//             // console.log(age, city, homepage);
//             res.redirect("/petition");
//         })
//         .catch(function(e) {
//             console.log("route /profile: ", e);
//         });
// });
// // editing profile
// app.get("/profile/edit", (req, res) => {
//     console.log("EDIT ROUTE");
//     db
//         .getProfile(req.session.userId)
//         .then(function(result) {
//             res.render("profile_edit", {
//                 layout: "main",
//                 signer: result.rows[0],
//                 message: "You can edit your personal data"
//             });
//         })
//         .catch(function(err) {
//             console.log("profile edit error  ", err);
//         });
// });
// app.post("/profile/edit", (req, res) => {
//     const { first, last, email, age, city, homepage, password } = req.body;
//     const { userId } = req.session;
//     console.log(first, last, email, homepage, city);
//     if (password) {
//         db
//             .hashPassword(password)
//             .then(function(hashedPassword) {
//                 Promise.all([
//                     db.updateUser(first, last, email, hashedPassword, userId),
//                     db.updateUserProfile(age, city, homepage, userId)
//                 ]);
//             })
//             .then(function() {
//                 res.session.first = first;
//                 res.session.last = last;
//                 return res.redirect("/thanks");
//             })
//             .catch(function(err) {
//                 console.log(err);
//             });
//     } else {
//         console.log("route/edit: ", first, last, email, homepage, city);
//         Promise.all([
//             db.updateUserOutPassword(first, last, email, userId),
//             db.updateUserProfile(age, city, homepage, userId),
//             console.log(
//                 "route/edit, in promiseAll: ",
//                 first,
//                 last,
//                 email,
//                 homepage,
//                 city
//             )
//         ])
//             .then(function() {
//                 res.session.first = first;
//                 res.session.last = last;
//                 return res.redirect("/thanks");
//             })
//             .catch(function(err) {
//                 console.log("catch error else: ", err);
//             });
//     }
// });
// // app.get("/profile/edit", function(req, res) {
// //     // req.session = null;
// //     // res.redirect("/");
// //     db
// //         .updateUser(req.session.userId)
// //         .then(function(userProfile) {
// //             res.render("profile_edit", {
// //                 layout: "main",
// //                 message: "Edit your Profile page"
// //             });
// //         })
// //         .catch(function(e) {
// //             console.log("route / profile edit: ", e);
// //         });
// // });
// // ====================================================
// // login route ---------------------------------------
// app.get("/login", requireLoggedOut, (req, res) => {
//     //
//     res.render("login", {
//         layout: "main",
//         message: "Login to your account"
//     });
// });
//
// app.post("/login", requireLoggedOut, (req, res) => {
//     //
//     // console.log(req.session);
//
//     let first, last, userId, sigId, email;
//     db
//         .getUserByEmail(req.body.email)
//         .then(function(result) {
//             // console.log("result rows 0 ", result.rows[0]);
//             first = result.rows[0].first;
//             last = result.rows[0].last;
//             sigId = result.rows[0].sig_id;
//             userId = result.rows[0].user_id;
//             email = req.body.email;
//
//             return db
//                 .checkPassword(req.body.password, result.rows[0].hash_password)
//                 .then(function(doesMatch) {
//                     if (!doesMatch) {
//                         throw new Error(
//                             console.log("login route after check password")
//                         );
//                     } else {
//                         // console.log("correct");
//                         req.session.first = first;
//                         req.session.last = last;
//                         req.session.userId = userId;
//                         req.session.sigId = sigId;
//                         req.session.email = email;
//
//                         console.log("route /login: ", req.session);
//                         return res.redirect("/petition");
//                     }
//                 });
//         })
//         .catch(function(e) {
//             console.log("login route get hashPassword", e);
//             res.render("login", {
//                 layout: "main",
//                 message: "Login to your account",
//                 error: " error"
//             });
//         });
// });
// // logout raute -------------------------
// app.get("/logout", function(req, res) {
//     req.session = null;
//     console.log("route /logout: ", req.session);
//     res.redirect("/");
// });
// // Petition route ------------------------------------
// app.get("/petition", requireNoSignature, (req, res) => {
//     res.render("petition", {
//         layout: "main",
//         message: "Sign our petition to help us give animals human"
//     });
// });
// app.post("/petition", requireNoSignature, (req, res) => {
//     db
//         .signPetition(req.session.userId, req.body.sig)
//         .then(function(result) {
//             let sigId = result.rows[0].id;
//             req.session.sigId = sigId;
//             res.redirect("/thanks");
//             // console.log("user ID    ");
//             // console.log("sig: ", sigId);
//             // console.log("session: ", req.session);
//             // console.log("result: ", result);
//         })
//         .catch(function(e) {
//             console.log("/petition: ", e);
//         });
// });
// // thanks route ----------------------------------------
// app.get("/thanks", requireSignature, (req, res) => {
//     // console.log("sigid", req.session.sigId);
//     db
//         .getSignatureById(req.session.sigId)
//         .then(function(result) {
//             res.render("thanks", {
//                 layout: "main",
//                 message:
//                     "Dear " +
//                     req.session.first +
//                     " " +
//                     req.session.last +
//                     " thank you for signing our petition",
//
//                 signature: result
//             });
//         })
//         .catch(function(e) {
//             console.log("there is a error in get thanks", e);
//         });
// });
// // signers route --------------------------------------------
// // app.get("/signers", requireUserId, requireSignature, (req, res) => {});
// app.get("/signers", requireUserId, requireSignature, (req, res) => {
//     db
//         .getSigners()
//         .then(function(result) {
//             res.render("signers", {
//                 layout: "main",
//                 signers: result.rows,
//                 message: "List of all partisipants."
//             });
//         })
//         .catch(function(err) {
//             console.log(err);
//         });
// });
// app.get("/signers/:city", (req, res) => {
//     // console.log("city");
//     db.getSignersByCity(req.params.city).then(function(result) {
//         // console.log(result);
//         res.render("signers", {
//             layout: "main",
//             signers: result.rows
//         });
//     });
// });
//
// // this rout adress all request and return 404 if file doesent exist
// app.get("*", (req, res) => {
//     res.redirect("/");
//     // res.render("404", {
//     //     layout: "main",
//     //     message: "File you are loocking for does not exist on this server"
//     // });
// });
//
// // =================================================
// // ===============  End of server ==================
// app.listen(process.env.PORT || 8080, () => console.log("Listening"));
// // =================================================
// // =================================================
//
// // it check if user has sigh petition
// function requireNoSignature(req, res, next) {
//     // console.log("reqNoSig: ", req.session);
//     if (req.session.sigId) {
//         res.redirect("/thanks");
//     } else {
//         next();
//     }
// }
// function requireSignature(req, res, next) {
//     if (!req.session.sigId) {
//         res.redirect("/thanks");
//     } else {
//         next();
//     }
// }
// // functions that checks if there is a cookie setHeader
// // it check if user is registerd
// function requireUserId(req, res, next) {
//     if (!req.session.userId) {
//         res.redirect("/register");
//     } else {
//         next();
//     }
// }
// function requireLoggedOut(req, res, next) {
//     if (req.session.userId) {
//         // console.log("requireLoggedOut");
//         res.redirect("/petition");
//     } else {
//         next();
//     }
// }
// function requireNoUserId(req, res, next) {
//     if (!req.session.userId) {
//         res.redirect("/petition");
//     } else {
//         next();
//     }
// }
