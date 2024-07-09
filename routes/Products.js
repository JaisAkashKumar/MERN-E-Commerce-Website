const express = require("express");
const {
  createProduct,
  fetchProductsByFilter,
  fetchProductById,
  updateProduct,
} = require("../Controller/Product");
const router = express.Router();
router
  .post("/", createProduct) // /product is already in the base path
  .get("/", fetchProductsByFilter)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);
exports.router = router;
