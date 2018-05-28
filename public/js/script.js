new Vue({
    el: "#main",
    data: {
        title: "Image board",
        heading: "Latest Images",
        images: []
    },
    mounted: function() {
        let me = this;
        axios.get("/images").then(function(resp) {
            me.images = resp.data.images;
            console.log("inside script.js: ", me.images);
        });
    }
});
