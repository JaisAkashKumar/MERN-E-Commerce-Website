const { Product } = require("../Model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body); //req.body ye frontend se aayega
  const response = await product.save();
  console.log(response);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductsByFilter = async (req, res) => {
  const condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }

  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  if (req.query._sort) {
    const x = req.query._sort;
    const sortField = x.startsWith("-") ? x.substring(1) : x;
    const order = x.startsWith("-") ? -1 : 1;
    query = query.sort({ [sortField]: order });
    totalProductsQuery = totalProductsQuery.sort({ [sortField]: order });
  }
  const totalDocs = await totalProductsQuery.countDocuments().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._per_page) {
    const pageSize = req.query._per_page;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  try {
    const docs = await query.exec();
    const products = { data: docs }; //json API ke according karne ke liye esa karna pada
    res.status(200).json(products);
    // res.set("X-Total-Count", totalDocs); //to set the response header
  } catch (err) {
    console.log("error de raha");
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    // const docs = await Product.find({ id: id });
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    }); //new true nhi karoge toh backend me update hoga but response ke body me old wala he dikhega
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// product.save((err, doc) => { //save no longer accepts a callback, ab sirf async await he use kar sakte ho
//   console.log({ err, doc });
//   if (err) {
//     res.status(400).json(err);
//   } else {
//     res.status(201).json(doc);
//   }
// });
