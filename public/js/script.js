new Vue({
    el: "#main",
    data: {
        // upload image
        imgFormInfo: {
            inputTitle: "",
            inputDescription: "",
            inputUsername: "",
            inputImg: null
        },
        // result box
        title: "Image board",
        heading: "Latest Images",
        images: []
    },
    mounted: function() {
        let me = this;
        axios.get("/images").then(function(resp) {
            me.images = resp.data.images;
            // console.log("inside script.js: ", me.images);
        });
    },
    methods: {
        selectFile: function(e) {
            console.log("in method select file");
            this.imgFormInfo.inputImg = e.target.files[0];
        },
        uploadImage: function(e) {
            console.log("in method upload image");
            e.preventDefault();
            // console.log(this.imgFormInfo);
            const fd = new FormData();
            fd.append("title", this.imgFormInfo.inputTitle);
            fd.append("description", this.imgFormInfo.inputDescription);
            fd.append("username", this.imgFormInfo.inputUsername);
            fd.append("file", this.imgFormInfo.inputImg);

            axios
                .post("/upload", fd)
                .then(results => {
                    // const url, username, title, result;
                    // console.log("result of axios ", result);
                    // this.images.push(fd);
                    this.images.push({
                        inputTitle: this.imgFormInfo.title,
                        inputDescription: this.imgFormInfo.description,
                        inputUsername: this.imgFormInfo.username,
                        inputImg: results.data.imageUrl,
                        id: results.data.id
                    });
                })
                .catch(function(err) {
                    console.log("catch route /upload", err);
                });
        }
    }
});
