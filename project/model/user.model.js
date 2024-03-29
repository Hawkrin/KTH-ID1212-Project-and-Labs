const mongoose = require("mongoose")
const validator = require('validator');

//Utils
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: "default"
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }]
})


userSchema.pre("save", function (next) {
    //User instance
    const user = this;

    //Checks if user has changed password, if not just continue.
    if (!user.isModified("password") && !user.isModified("email")) return next();

    //Validate password
    if (!validator.isLength(user.password, { min: 8, max: 16 })) return next(new Error("Password is not strong."))

    //Validate Email
    if (!validator.isEmail(user.email)) return next(new Error("Email is not a valid email."))

    //Generate encrypted password and setting password to the hash.
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(user.password, salt);
    user.password = encryptedPassword;

    next();
})

userSchema.statics.userAlreadyExists = function (username, email) {
    return this.findOne({ $or: [{ username }, { email }] })
}

userSchema.statics.getUser = function(_id) {
    return new Promise((resolve, reject) => {
        this.findById(id)
            .then((user) => { return resolve(user); })
            .catch((error) => { return reject(user); })
    })
}

userSchema.statics.loginUser = function(email, password) {
    return new Promise((resolve, reject) => {
        this.findOne({ email })
            .then((user) => {
                if (!user) { return reject("Email does not exists."); }

                bcrypt.compare(password, user.password, (error, result) => {
                    if (error) { return reject(error); }
                    if (result) {
                        return resolve(user);
                    }
                })
            })
    })
}

module.exports = mongoose.model("user", userSchema)