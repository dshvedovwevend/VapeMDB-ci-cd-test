const express = require("express");
const router = express.Router();
const { Order } = require("../Helpers/modelsDB");
const axios = require("axios");

router.get("/orders/:orderId", async (req, res) => {
  console.log("Got getOrders request from client");
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    console.log("Order doc: ", order);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.status(200).json({ order });
  } catch (error) {
    console.log("Error while fetching order details");
    res.status(500).send("Server Error");
  }
});

router.get("/cardDetails/:transactionId", async (req, res) => {
  console.log("Got card details request");
  const transactionId = req.params.transactionId;
  let url;
  const apiKey = process.env.API_KEY;
  try {
    console.log(transactionId);
    url = `${process.env.GATEWAY_URL}/gettransactiondetails?transactionId=${transactionId}`;
    console.log("Gate way url: ", process.env.GATEWAY_URL);
    let transactionDetails = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });
    console.log("response.data: ", transactionDetails.data);
    const cardType = transactionDetails?.data?.cardType;
    const cardNumber = transactionDetails?.data?.cardNum;
    if (cardNumber === undefined && cardType === undefined) {
      res.status(500).json({ message: transactionDetails.data });
    } else {
      res.status(200).json({ cardType: cardType, cardNumber: cardNumber });
    }
  } catch (error) {
    console.log("Error fetching transaction details: ", error);
    res.status(500).json({ message: "No transaction details found" });
  }
});

module.exports = router;
