const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
  checked: { type: Boolean, default: false },
});

const virtual = brandSchema.virtual("id"); //this whole virtual thing will transform the _id to id virtually (will be send at frontend but won't be visible on db)
virtual.get(function () {
  return this._id;
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Brand = mongoose.model("Brand", brandSchema);
