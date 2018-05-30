const knox = require("knox");
const fs = require("fs");
// const secrets = require("./secrets");
let secrets;
// console.log("secrets: ", secrets);
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.awsKey,
    secret: secrets.awsSecret,
    bucket: "spicedling"
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log("no file find");
        return res.sendStatus(500);
    }
    //
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        // const wasSuccessful = s3Response.statusCode == 200;
        console.log(s3Response.statusCode);
        if (s3Response.statusCode == 200) {
            // fs.uplink(req.file.path, () => {});
            next();
        } else {
            console.log("in the respons something went wrong");
            console.log(s3Response.statusCode);
            res.sendStatus(500);
        }
    });
};
