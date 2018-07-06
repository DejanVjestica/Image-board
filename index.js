// express
const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");

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
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db
        .getImages()
        .then(result => {
            res.json({
                images: result.rows
            });
        })
        .catch(function(err) {
            console.log("In route /images ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    db
        .insertImage(
            req.body.title,
            req.body.description,
            req.body.username,
            config.s3Url + req.file.filename
        )
        .then(function(results) {
            res.json({
                image: results.rows[0]
            });
        })
        .catch(function(err) {
            console.log("In route /upload ", err);
        });
});
app.get("/image/:id", (req, res) => {
    console.log(req.params.id);
    db
        .getImageById(req.params.id)
        .then(function(result) {
            res.json(result.rows[0]);
        })
        .catch(function(err) {
            console.log("/image/:id /in catch", err);
        });
});
app.post("/image/comment", (req, res) => {
    db
        .uploadComment(req.body.comment, req.body.username, req.body.img_id)
        .then(function(result) {
            res.json({
                newComment: result.rows[0]
            });
        })
        .catch(function(err) {
            console.log("in catch", err);
        });
});
app.get("/image/comment/:id", (req, res) => {
    console.log("req.params.id", req.params.id);
    db
        .getImageCommets(req.params.id)
        .then(function(result) {
            res.json(result.rows);
        })
        .catch(function(err) {
            console.log("/image/comment/:id", err);
        });
});
// -------------------------------------
app.get("/more/:curAmountOfImgs", (req, res) => {
    console.log("button is clicked");
    //
    const curAmountOfImgs = req.params.curAmountOfImgs;
    console.log(curAmountOfImgs);
    db
        .loadMoreImages(curAmountOfImgs)
        .then(function(result) {
            console.log(result.rows);
            //
            res.json(result.rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});
// ===============  End of server ==================
app.listen(8080, () => console.log("Listening on port 8080"));
// =================================================
// =================================================
