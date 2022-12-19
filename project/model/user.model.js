const mongoose = require("mongoose")
const validator = require('validator');

//Utils
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
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
    }
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

userSchema.statics.loginUser = function(email, password) {
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
}

module.exports = mongoose.model("user", userSchema)