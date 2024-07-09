const express = require("express");
const { fetchUser, updateUser } = require("../Controller/User");
const router = express.Router();
router.get("/own", fetchUser).patch("/own", updateUser);
exports.router = router;
