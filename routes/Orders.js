const express = require("express");
const {
  createOrder,
  fetchAllOrders,
  updateOrder,
  fetchOrderByUserId,
} = require("../Controller/Order");
const router = express.Router();
router
  .post("/", createOrder) // /product is already in the base path
  .get("/", fetchAllOrders)
  .patch("/:id", updateOrder)
  .get("/own", fetchOrderByUserId);
exports.router = router;
