module.exports = function(app, mongoose) {
    var userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String
    });

    var User = mongoose.model("User", userSchema);
    app.post("/login", function(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        console.log("Getting item" + JSON.stringify(req.body));
        User.findOne({ email: email, password: password }, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    });

    app.post("/register", function(req, res) {
        console.log("Getting item" + JSON.stringify(req.body));
        var newUser = User(req.body).save(function(err, data) {
            if (err) throw err;
            console.log("Inserted item");
            res.json(data);
        });
    });

    // app.delete("/user/:item", function(req, res) {
    //     console.log("Removed item: " + req.params.item);
    //     Todo.find({
    //         item: req.params.item.replace(/ /g, "-")
    //     }).deleteOne(function(err, data) {
    //         if (err) throw err;
    //         console.log("Removed item");
    //         res.json(data);
    //     });
    // });
};