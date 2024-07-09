const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String },
  role: { type: String, default: "user" },
  orders: { type: [Schema.Types.Mixed] },
  salt: Buffer,
  //   orders:{ type: [Schema.Types.Mixed] },
});

const virtual = userSchema.virtual("id"); //this whole virtual thing will transform the _id to id virtually (will be send at frontend but won't be visible on db)
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
