const { Router } = require("express");

const authenticated = require("../middleware/auth.middleware");

const router = Router();

router

    .get("/", authenticated, (req, res) => {
        res.render('home');
    })

module.exports = router;