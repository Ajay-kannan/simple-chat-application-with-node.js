var mongoose = require("mongoose")
const schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var user = new schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
})


user.plugin(passportLocalMongoose);

module.exports = mongoose.model("test", user)
