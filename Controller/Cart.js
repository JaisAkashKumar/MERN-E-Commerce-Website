const { CartItem } = require("../Model/Cart");

exports.addItemToCart = async (req, res) => {
  const { id } = req.user;
  const cartItem = new CartItem({ ...req.body, user: id }); //req.body ye frontend se aayega
  try {
    const doc = await cartItem.save();
    const item = await doc.populate("product");
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchCartItems = async (req, res) => {
  try {
    // const docs = await CartItem.find({ user: req.query.user })
    const docs = await CartItem.find({ user: req.user.id })
      .populate("user")
      .populate("product")
      .exec();
    res.status(201).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const item = await cartItem.populate("product");
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByIdAndDelete(id);
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.resetCartItems = async (req, res) => {
  try {
    const docs = await CartItem.deleteMany().exec();
    res.status(201).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
