const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  // items: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  items: { type: [Schema.Types.Mixed], required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalItems: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
  status: { type: String, default: "pending" },
});

const virtual = orderSchema.virtual("id"); //this whole virtual thing will transform the _id to id virtually (will be send at frontend but won't be visible on db)
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
