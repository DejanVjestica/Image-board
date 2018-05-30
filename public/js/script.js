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
        images: []
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
