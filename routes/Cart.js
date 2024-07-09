const express = require("express");
const {
  addItemToCart,
  fetchCartItems,
  updateCartItem,
  deleteCartItem,
  resetCartItems,
} = require("../Controller/Cart");
const router = express.Router();
router
  .post("/", addItemToCart) // /product is already in the base path
  .get("/", fetchCartItems)
  .delete("/", resetCartItems)
  .patch("/:id", updateCartItem)
  .delete("/:id", deleteCartItem);
exports.router = router;
