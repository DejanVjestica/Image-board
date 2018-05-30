// ------------------------
// main vue instance ------
// ------------------------
new Vue({
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
        currentImageId: ""
    },
    mounted: function() {
        // console.log(images);
        let me = this;
        axios.get("/images").then(function(resp) {
            me.images = resp.data.images;
            // console.log("inside script.js: ", me.images);
        });
    },
    methods: {
        openModal: function(imageId) {
            console.log("open modal");
            this.currentImageId = imageId;
        },
        closeModal: function(e) {
            console.log("modal is closed:", this.id);
            this.$emit("close", this.id, e.target.value);
        },
        // closeModal: function(e) {
        //     this.$emit("close", this.id, e.target.value);
        //     // this.currentImageId = "";
        // },
        selectFile: function(e) {
            console.log("in method select file");
            this.imgFormInfo.url = e.target.files[0];
        },
        uploadImage: function(e) {
            console.log("in method upload image");
            e.preventDefault();
            // console.log(this.imgFormInfo);
            const fd = new FormData();
            fd.append("title", this.imgFormInfo.title);
            fd.append("description", this.imgFormInfo.description);
            fd.append("username", this.imgFormInfo.username);
            fd.append("file", this.imgFormInfo.url);
            console.log("this.imgFormInfo.username", fd);
            axios
                .post("/upload", fd)
                .then(results => {
                    // const url, username, title, result;
                    console.log("result of axios ", results, fd);
                    // this.images.push(fd);
                    this.images.unshift({
                        id: results.data.image.id,
                        title: this.imgFormInfo.title,
                        description: this.imgFormInfo.description,
                        username: this.imgFormInfo.username,
                        img: results.data.image.url
                    });
                    // this.images.unshift(results.data.image);
                    console.log(results.data.images);
                })
                .catch(function(err) {
                    console.log("catch route /upload", err);
                });
        }
    }
});
// ----------------------------
// component image modal ------
// ----------------------------
// Vue.component("imagemodal-component", {
//     /* data, methods, etc. go here */
//     data: function() {
//         return {
//             heading: "Image modal"
//         };
//     },
//     template: ".imagemodal-template"
// });
Vue.component("modal-component", {
    props: ["id", "currentImageId"],
    data: function() {
        return {
            heading: "modal Component",
            image: {
                title: "",
                description: "",
                username: ""
            },
            // commentForm: {
            //     comment: "",
            //     username: ""
            // },
            comments: []
        };
    },
    mounted: function() {
        console.log("modal is open:", this.id);
        axios.get("/image/" + this.id).then(function(result) {
            // getImageById(result.id);
        });
    },
    methods: {
        // closeModal: function(e) {
        //     console.log("modal is closed:", this.id);
        //     this.$emit("close", this.id, e.target.value);
        // }
        // openModal: function() {
        //     console.log("open modal");
        // }
        // closeModal: function() {}
    },
    template: "#modal-template"
});
