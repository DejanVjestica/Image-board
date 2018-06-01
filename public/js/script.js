Vue.component("modal-component", {
    props: ["id"],
    data: function() {
        return {
            heading: "modal Component",
            image: {
                title: "",
                description: "",
                username: "",
                url: "",
                created_at: "",
                id: null
            },
            commentForm: {
                // id: "",
                comment: "",
                username: ""
            },
            comments: []
        };
    },
    mounted: function() {
        var self = this;
        // console.log("modal is open:", this.id);
        axios
            .get("/image/" + this.id)
            .then(function(result) {
                self.image = result.data;
                // mat told me i need to also fech comments anfd
                // populate self.comments whit the fechet comments
                // console.log("result");
                axios
                    .get("/image/comment/" + self.id)
                    .then(function(result) {
                        self.comments = result.data;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
            .catch(function(err) {
                // getImageById(result.id);
                console.log(err);
            });
    },
    watch: {
        id: function() {
            var self = this;
            console.log("id changed");
            axios
                .get("/image/" + this.id)
                .then(function(result) {
                    console.log(result.data.id);
                    self.image = result.data;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    },
    methods: {
        // close: function() {
        //     console.log("modal is closed:", this.id);
        // }
        closeModal: function() {
            console.log("close modal");
            console.log(this.id);
            // console.log(this.currentImageId);
            // this.$emit("close", this.id, this.currentImageId);
            this.$emit("close", this.id);
        },
        uploadComment: function() {
            let self = this;
            console.log(
                "upload comment",
                self.commentForm.comment,
                self.commentForm.username,
                self.id
            );
            axios
                .post("/image/comment/", {
                    comment: self.commentForm.comment,
                    username: self.commentForm.username,
                    img_id: self.id
                    // img_id: self.id
                })
                .then(function(result) {
                    console.log("upComm axios then", result);
                    self.comments.unshift({
                        id: result.data.newComment.id,
                        username: result.data.newComment.username,
                        img_id: result.data.newComment.img_id,
                        created_at: result.data.newComment.created_at
                    });
                    // console.log(this.comments);
                    // result.data.newComment;
                })
                .catch(function(err) {
                    console.log("upload comment: ", err);
                });
        }
        // closeModal: function() {}
    },
    template: "#modal-template"
});
// ------------------------
// main vue instance ------
// ------------------------
const app = new Vue({
    el: "#main",
    data: {
        // upload image
        // result box
        title: "Image board",
        heading: "Latest Images",
        imgFormInfo: {
            title: "",
            description: "",
            username: "",
            url: null
        },
        images: [],
        currentImageId: location.hash.slice(1),
        curAmountOfImgs: "",
        image: {
            title: "",
            description: "",
            username: ""
        }
        // error: ""
    },
    mounted: function() {
        // console.log(images);
        let me = this;
        axios.get("/images").then(function(resp) {
            // console.log("mounted vue", this.currentImageId);
            me.images = resp.data.images;
            // var length = me.images.length - 1;
            // me.lastImageId = app.images[5].id;
            // console.log(me.lastImageId);
            // console.log("inside script.js: ", me.images);
        });
    },
    // created: function() {
    //     addEventListener("hashchange", function() {
    //         console.log("mounted vue", this.currentImageId);
    //         self.currentImageId = location.hash.slice(1);
    //     });
    // },

    methods: {
        // showImage: function(imageId) {
        //     this.currentImageId = imageId;
        //     // var img = this.images.find(img => img.id == id);
        // },
        // ________________________________-
        loadMoreImages: function() {
            let me = this;
            // let imageLength = me.images.length;
            axios
                .get(`/more/${me.images.length}`)
                .then(function(resp) {
                    console.log("inside axios then: ", resp.data[0]);
                    console.log(" image array", me.images[0]);
                    // var newImages = resp.data;
                    // me.images.push(newImages);
                    me.images = [...me.images, ...resp.data];
                    // console.log(me.images);
                    // console.log(resp.data[5].id);
                    // console.log("mounted vue", this.currentImageId);
                    // me.images = resp.data.images;
                    // console.log(app.images[5].id);
                    // console.log("inside script.js: ", me.images);
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        openModal: function(imageId) {
            // console.log("open modal");
            this.currentImageId = imageId;
        },
        closeModal: function() {
            // console.log("modal is closed:", this.id);
            // this.$emit("close", this.id, e.target.value);
            location.hash = "#";
            this.currentImageId = "";
        },

        selectFile: function(e) {
            // console.log("in method select file");
            this.imgFormInfo.url = e.target.files[0];
        },
        uploadImage: function(e) {
            // console.log("in method upload image");
            e.preventDefault();
            // console.log(this.imgFormInfo);
            const fd = new FormData();
            fd.append("title", this.imgFormInfo.title);
            fd.append("description", this.imgFormInfo.description);
            fd.append("username", this.imgFormInfo.username);
            fd.append("file", this.imgFormInfo.url);
            // console.log("this.imgFormInfo.username", fd);
            axios
                .post("/upload", fd)
                .then(results => {
                    console.log(results.data.image.url);
                    // const url, username, title, result;
                    // console.log("result of axios ", results, fd);
                    // this.images.push(fd);
                    this.images.unshift({
                        id: results.data.image.id,
                        title: this.imgFormInfo.title,
                        description: this.imgFormInfo.description,
                        username: this.imgFormInfo.username,
                        url: results.data.image.url
                    });
                    // this.images.unshift(results.data.image);
                    // console.log(results.data.images);
                })
                .catch(function(err) {
                    console.log("catch route /upload", err);
                });
        }
    }
});
// ---------------------------
// ---- custom function ------
// ---------------------------
addEventListener("hashchange", () => {
    const imageId = location.hash.slice(1);
    app.openModal(imageId);
});
