require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./Controller/Product");
const productsRouter = require("./routes/Products"); //default export ko kisi bhi naam se import kar satke hai
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Catergories");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Orders");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { User } = require("./Model/User");
const crypto = require("crypto");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require("path");
const { Order } = require("./Model/Order");
const corsConfig = {
  origin: "*",
  Credential: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
};
main().catch((err) => console.log(err));

//webhook  //baaki api ko json parser chahiye and isko raw parser chahiye jo ki iske andar he enabled hai isliye isko top pe rakha hai
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);
const endpointSecret = process.env.END_POINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//middlewares
// server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.options("", cors(corsConfig));
server.use(cors(corsConfig));
//webhook
// This is your test secret API key.
// server.use(express.raw({ type: "application/json" }));
server.use(express.json());

var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

server.use(express.static(path.resolve(__dirname, "build"))); //kahin aur deploy kar rahe ho toh unka directory different hoga isliye axact path likhne ke jagah code likhe hai
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);
server.use(passport.initialize());
server.use(passport.authenticate("session"));
// server.use(passport.session());
//Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    console.log({ email, password });
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            var token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token });
          } else {
            done(null, false, { message: "invalid credentials" });
          }
        }
      );
    } catch (err) {
      console.log("error aa gaya");
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("jwt payload id", jwt_payload.id);
    try {
      const user = await User.findOne({ _id: jwt_payload.id }); //id kaam nhi kiya (_id kiya)
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      console.log("jwt error");
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

 

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, //for decimal compensation
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
      //this info will go to stripe => and then to our webhook
      //so we can conclude payment was successful even if client closes window after pay
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// server.use(express.json()); //to parse req.body
server.use("/products", isAuth(), productsRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
//this line is to make react router work in case of other routes doesn't match
server.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("db started");
}

// server.get("/", (req, res) => {
//   res.json({ status: "success" });
// });
// server.post("/products", createProduct);

server.listen(process.env.PORT, () => {
  console.log("server started");
});
