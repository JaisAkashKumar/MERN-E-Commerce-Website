const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  // title: { type: String, required: true, unique: true },
  // price: { type: Number, required: true, min: [1, "wrong min price"] },
  // discountPercentage: {
  //   type: Number,
  //   min: [1, "wrong min discount%"],
  //   max: [99, "wrong max discount%"],
  // },
  // brand: { type: String, required: true },
  // thumbnail: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, default: 1 },
});

const virtual = cartItemSchema.virtual("id"); //this whole virtual thing will transform the _id to id virtually (will be send at frontend but won't be visible on db)
virtual.get(function () {
  return this._id;
});
cartItemSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.CartItem = mongoose.model("CartItem", cartItemSchema);
