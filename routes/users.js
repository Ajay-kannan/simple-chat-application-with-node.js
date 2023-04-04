const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    console.log(req.body.userName);
    console.log(req.body.friendName);
});

module.exports = router;