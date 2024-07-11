const { User } = require("../Model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
//ye bhi User model pe kaam karega but Authenticated hai isliye separate bana rahe hai

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 360000000),
      httpOnly: true,
    })
    .status(200)
    // .json(req.user.token);
    .json({ id: user.id, role: user.role, token: user.token });
};

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const email = req.body.email;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(500).json({ error: "Email already exists" });
        }
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        // console.log(req.body);
        const user = new User({ ...req.body, password: hashedPassword, salt }); //req.body ye frontend se aayega
        const doc = await user.save();
        req.login(sanitizeUser(doc), function (err) {
          //this also calls serializer and adds to session
          if (err) {
            return res.status(400).json(err);
          }
          var token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
          res
            .cookie("jwt", token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            })
            .status(201)
            .json({ id: doc.id, role: doc.role });
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
    console.log("authorized user");
  } else {
    res.status(401);
    console.log("Unauthorized user");
  }
};
