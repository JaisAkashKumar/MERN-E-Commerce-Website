const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
  checked: { type: Boolean, default: false },
});

const virtual = categorySchema.virtual("id"); //this whole virtual thing will transform the _id to id virtually (will be send at frontend but won't be visible on db)
virtual.get(function () {
  return this._id;
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Category = mongoose.model("Category", categorySchema);
// mongoose.models.Category || mongoose.model("Category", categorySchema);
