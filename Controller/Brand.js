const { Brand } = require("../Model/Brand");

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body); //req.body ye frontend se aayega
  // const response = await Brand.save();
  // console.log(response);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch {
    res.status(400).json(err);
  }
};

exports.fetchBrands = async (req, res) => {
  let totalBrandsQuery = Brand.find({});
  const totalDocs = await totalBrandsQuery.countDocuments().exec();
  console.log({ totalDocs });
  try {
    const docs = await Brand.find({}).exec();
    res.set("X-Total-Count", totalDocs); //to set the response header
    res.status(201).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
