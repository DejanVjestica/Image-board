// Vue component single images popup
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
            comments: [],
            showCommentForm: false
        };
    },
    mounted: function() {
        var self = this;
        axios
            .get("/image/" + this.id)
            .then(function(result) {
                self.image = result.data;
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
        closeModal: function() {
            console.log("close modal");
            console.log(this.id);
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
                })
                .then(function(result) {
                    console.log("upComm axios then", result);
                    self.comments.unshift({
                        id: result.data.newComment.id,
                        username: result.data.newComment.username,
                        img_id: result.data.newComment.img_id,
                        created_at: result.data.newComment.created_at
                    });
                })
                .catch(function(err) {
                    console.log("upload comment: ", err);
                });
        },
        onCommentForm: function() {
            app.showCommentForm = !app.showCommentForm;
            console.log("showCommentForm is clicked: ", app.showCommentForm);
        }
    },
    template: "#modal-template"
});
// ------------------------
// main vue instance ------
// ------------------------
const app = new Vue({
    el: "#main",
    data: {
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
        },
        showForm: false
        // error: ""
    },
    mounted: function() {
        let me = this;
        axios.get("/images").then(function(resp) {
            me.images = resp.data.images;
        });
    },
    methods: {
        showUploadForm: function() {
            app.showForm = !app.showForm;
            // console.log(document.getElementById("uploadForm"));
            // document.getElementById("uploadForm").style.display = "block";
        },
        // ________________________________-
        loadMoreImages: function() {
            let me = this;
            axios
                .get(`/more/${me.images.length}`)
                .then(function(resp) {
                    console.log("inside axios then: ", resp.data[0]);
                    console.log(" image array", me.images[0]);
                    me.images = [...me.images, ...resp.data];
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        openModal: function(imageId) {
            this.currentImageId = imageId;
        },
        closeModal: function() {
            location.hash = "#";
            this.currentImageId = "";
        },

        selectFile: function(e) {
            this.imgFormInfo.url = e.target.files[0];
        },
        uploadImage: function(e) {
            e.preventDefault();
            const fd = new FormData();
            fd.append("title", this.imgFormInfo.title);
            fd.append("description", this.imgFormInfo.description);
            fd.append("username", this.imgFormInfo.username);
            fd.append("file", this.imgFormInfo.url);
            axios
                .post("/upload", fd)
                .then(results => {
                    console.log(results.data.image.url);
                    this.images.unshift({
                        id: results.data.image.id,
                        title: this.imgFormInfo.title,
                        description: this.imgFormInfo.description,
                        username: this.imgFormInfo.username,
                        url: results.data.image.url
                    });
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
    console.log("upload image is clicked");
    const imageId = location.hash.slice(1);
    app.openModal(imageId);
});
