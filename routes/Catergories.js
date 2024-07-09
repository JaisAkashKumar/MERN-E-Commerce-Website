const express = require("express");
const { createCategory, fetchCategories } = require("../Controller/Category");

const router = express.Router();
router
  .post("/", createCategory) // /Brand is already in the base path
  .get("/", fetchCategories);
exports.router = router;
