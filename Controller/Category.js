const { Category } = require("../Model/Category");

exports.createCategory = async (req, res) => {
  const category = new Category(req.body); //req.body ye frontend se aayega
  // const response = await category.save();
  // console.log(response);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch {
    res.status(400).json(err);
  }
};

exports.fetchCategories = async (req, res) => {
  let totalCategoriesQuery = Category.find({});
  const totalDocs = await totalCategoriesQuery.countDocuments().exec();
  console.log({ totalDocs });
  try {
    const docs = await Category.find({}).exec();
    res.set("X-Total-Count", totalDocs); //to set the response header
    res.status(201).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
