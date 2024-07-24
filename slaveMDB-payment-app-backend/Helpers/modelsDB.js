const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  order_id: String,
  phone_number: String,
  email: String,
  merchantName: String,
  app: String,
});

const orderSchema = new mongoose.Schema({
  item_number: { type: Number },
  item_price: { type: String },
  tax: { type: String },
  transaction_id: { type: String, required: true },
  total_amount: { type: String, required: true },
  vend_success: { type: Boolean },
  payment_status: { type: String },
  purchase_type: { type: String },
  terminal_id: { type: String },
  merchant_name: { type: String },
  merchant_address: { type: String },
  merchant_tel: { type: String },
  merchant_id: { type: String },
  date: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = {
  User,
  Order,
};
