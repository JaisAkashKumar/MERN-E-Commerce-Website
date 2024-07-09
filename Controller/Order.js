const { Order } = require("../Model/Order");

exports.createOrder = async (req, res) => {
  const order = new Order(req.body); //req.body ye frontend se aayega
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchOrderByUserId = async (req, res) => {
  const { id } = req.user;
  try {
    const order = await Order.find({ user: id }).populate("user");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({}).populate("user");
  let totalOrdersQuery = Order.find({}).populate("user");
  if (req.query._sort) {
    const x = req.query._sort;
    const sortField = x.startsWith("-") ? x.substring(1) : x;
    const sortOrder = x.startsWith("-") ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
    totalOrdersQuery = totalOrdersQuery.sort({ [sortField]: sortOrder });
  }
  const totalDocs = await totalOrdersQuery.countDocuments().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._per_page) {
    const pageSize = req.query._per_page;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  try {
    const docs = await query.populate("user").exec();
    const orders = { data: docs }; //json API ke according karne ke liye esa karna pada
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    }); //new true nhi karoge toh backend me update hoga but response ke body me old wala he dikhega
    const doc = await order.populate("user");
    // .populate({
    //   path: "items",
    //   model: "Product",
    // });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
