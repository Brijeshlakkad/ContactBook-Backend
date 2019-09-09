const url = require("url");
module.exports = function(app, mongoose) {
    var phoneSchema = new mongoose.Schema({
        phone: String,
        userId: String
    });
    var contactSchema = new mongoose.Schema({
        userId: {
            type: String
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
        company: String,
        email: String,
        phone: {
            type: String,
            required: true
        },
    });
    var Contact = mongoose.model("Contact", contactSchema);
    app.get("/contact", function(req, res) {
        let url_parts = url.parse(req.url, true);
        let userId = url_parts.query.userId;
        let limit = url_parts.query.limit == undefined ? 10 : Number(url_parts.query.limit);
        let skip = url_parts.query.skip == undefined ? 0 : Number(url_parts.query.skip);
        console.log("Getting item: " + userId);
        // let userId = req.params.userId;
        // console.log("Getting item: " + req.params.userId);

        // console.log("Getting item: " + JSON.stringify(req.body));
        Contact.find({ userId: userId }, function(err, data) {
            if (err) throw err;
            res.json(data);
        }).sort({ firstName: 1, lastName: 1 }).skip(skip).limit(limit);
    });
    app.get("/contacts/:userId", function(req, res) {
        let url_parts = url.parse(req.url, true);
        let userId = req.params.userId;
        let contactName = url_parts.query.contactName;
        console.log("Getting item: " + userId);
        if (contactName == null || contactName == undefined || contactName == "") {
            res.json([]);
        } else {
            Contact.find({ userId: userId, $or: [{ firstName: { $regex: contactName, $options: 'i' } }, { lastName: { $regex: contactName, $options: 'i' } }] }, function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        }
    });
    app.post("/contactPage", function(req, res) {
        let userId = req.body.userId;
        let pageSteps = req.body.pageSteps == undefined ? 0 : Number(req.body.pageSteps);
        console.log("Getting item" + JSON.stringify(req.body));
        Contact.find({ userId: userId }).count(function(err, dataCount) {
            if (err) throw err;
            let pageCount = pageSteps > dataCount ? 1 : dataCount / pageSteps;
            res.json({ pageCount: Math.ceil(pageCount), dataCount: dataCount });
        });
    });
    app.post("/contact", function(req, res) {
        console.log("Getting item" + JSON.stringify(req.body));
        var newContact = Contact(req.body).save(function(err, data) {
            if (err) throw err;
            console.log("Inserted item");
            res.json(data);
        });
    });

    app.put("/contact/:contactId", function(req, res) {
        let contactId = req.params.contactId;
        console.log("Getting item" + JSON.stringify(req.body));
        Contact.updateOne({ _id: contactId }, req.body, function(err, data) {
            if (err) throw err;
            console.log("Updated item");
            res.json(data);
        });
    });

    app.delete("/contact/:contactId", function(req, res) {
        console.log("Removing item: " + req.params.contactId);
        Contact.find({
            _id: req.params.contactId.replace(/ /g, "-")
        }).deleteOne(function(err, data) {
            if (err) throw err;
            console.log("Removed item");
            res.json(data);
        });
    });
};