const express = require("express");
const userController = require("./controllers/userController");
const contactController = require("./controllers/contactController");
const cors = require('cors');
const bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://contactBookUser:root@localhost:27017/contact-book-app", {
    useNewUrlParser: true
});

app.set("view engine", "ejs");
app.use(cors());
var urlbodyEncoder = bodyParser.urlencoded({ extended: false });
app.use(urlbodyEncoder);
app.use(express.static("./public"));
userController(app, mongoose);
contactController(app, mongoose);
var server = app.listen(8888, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})