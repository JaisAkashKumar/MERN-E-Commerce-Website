const { User } = require("../Model/User");

exports.fetchUser = async (req, res) => {
  console.log("req.user", req.user);
  const { id } = req.user;
  try {
    // const docs = await Product.find({ id: id });
    //const user = await User.findById(id, "email name id"); //kya kya return karna hai wo as a second argument pass kiye hai kyunki password wagerah toh user ko return nhi karna hai na
    const user = await User.findById(id);
    res.status(200).json({
      id: user.id,
      role: user.role,
      addresses: user.addresses,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }); //new true nhi karoge toh backend me update hoga but response ke body me old wala he dikhega
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
