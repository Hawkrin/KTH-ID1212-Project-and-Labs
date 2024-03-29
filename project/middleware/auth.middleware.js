const jwt = require("jsonwebtoken");
const User = require("../model/user.model")

const authenticated = function(req, res, next) {
    const token = req.cookies.Authenticate;

    if (token == null) {
        return res.redirect("/auth/login");
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, _id) => {
        if (err) {
            console.log(err);
            return res.redirect("/auth/login");
        }

        User.findById(_id)
            .then((user) => {
                req.user = user; 
                next();
            })
            .catch((error) => {
                console.log(error);
                next();
            })
    })
}

module.exports = authenticated;