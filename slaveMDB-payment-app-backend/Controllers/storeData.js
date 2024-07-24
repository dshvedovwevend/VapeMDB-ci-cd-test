const express = require("express");
const router = express.Router();
const { Order, User } = require("../Helpers/modelsDB");

router.post("/order", async (req, res) => {
  try {
    console.log("Request received in orders:", req.body);
    const newOrder = new Order({
      item_number: parseInt(req.body.itemNumber),
      item_price: req.body.itemPrice,
      tax: req.body.tax,
      transaction_id: req.body.transactionId,
      total_amount: req.body.amountPaid,
      vend_success: req.body.vendSuccess,
      payment_status: req.body.paymentStatus,
      purchase_type: req.body.purchaseType,
      terminal_id: req.body.terminalId,
      merchant_name: req.body.merchantName,
      merchant_address: req.body.merchantAddress,
      merchant_tel: req.body.merchantTel,
      merchant_id: req.body.merchantId,
      date: new Date(),
    });
    const savedOrder = await newOrder.save();
    console.log("Order details saved in collection", savedOrder._id);
    res.status(200).json({ orderId: savedOrder._id });
  } catch (error) {
    console.log("catch block: ", error);
    res.status(500).json({ error: error });
  }
});

router.post("/user", async (req, res) => {
  try {
    console.log("Request received in users:", req.body);
    const newUser = new User({
      order_id: req.body.orderId,
      phone_number: parseInt(req.body.phoneNumber),
      email: req.body.email,
      app: req.body.app,
      merchantName: req.body.merchantName
    });
    
    const savedUser = await newUser.save();
    console.log("User details saved in collection", savedUser._id );
    return res.status(200).json({ message: "User saved successfully", savedUser });
  } catch (error) {
    console.log("catch block: ", error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
