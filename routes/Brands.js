const express = require("express");
const { createBrand, fetchBrands } = require("../Controller/Brand");

const router = express.Router();
router
  .post("/", createBrand) // /Brand is already in the base path
  .get("/", fetchBrands);
exports.router = router;
