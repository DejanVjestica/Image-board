const spicedPg = require("spiced-pg");
const dbUrl = "postgres:dvjes:postgres@localhost:5432/imageboard";
const db = spicedPg(dbUrl);
// ------------------------------------
exports.loadMoreImages = function(curAmountOfImgs) {
    return db.query(
        `
			SELECT * FROM images ORDER BY id DESC LIMIT 6 OFFSET $1;
		`,
        [curAmountOfImgs]
    );
};
// ------------------------------------
exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};
// ------------------------------------
exports.insertImage = function(title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url)
    VALUES ($1, $2, $3, $4) RETURNING *`,
        [title || null, description || null, username || null, url || null]
    );
};
// ------------------------------------
exports.uploadComment = function(comment, username, img_id) {
    return db.query(
        `
		INSERT INTO comments (comment, username, img_id)
		VALUES ($1, $2, $3) RETURNING *
		`,
        [comment, username, img_id]
    );
};
// ------------------------------------
exports.getImageById = function(id) {
    return db.query(
        `
		SELECT * FROM images WHERE id=$1
		`,
        [id]
    );
};
// ------------------------------------
exports.getImageCommets = function(id) {
    return db.query(
        `
		SELECT * FROM comments WHERE img_id=$1
		`,
        [id]
    );
};
