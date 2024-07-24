require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();
const sendSMSHelper = require("../Helpers/sendSMS");
const sendEmailHelper = require("../Helpers/sendEmail");

router.post("/", async (req, res) => {
  console.log("Send Receipt req", req.body);
  try {
    const orderId = req.body.orderId;
    const transactionId = req.body.transactionId;
    const phoneNumber = req.body.phoneNumber;
    const app = req.body.app;
    const emailAddress = req.body.email;
    const merchantName = req.body.merchantName;

    if (!orderId) {
      console.log("Error: OrderId not found");
      res.status(404).json({ error: "OrderId not found" });
    }
    if (!phoneNumber) {
      console.error("Error phone number not found");
      return res.status(404).json({ error: "Phone number not found" });
    }
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
      region: process.env.AWS_REGION,
    };

    AWS.config.update(awsConfig);

    const sendSMSResponse = await sendSMSHelper.sendSMS(
      orderId,
      transactionId,
      phoneNumber,
      app,
      merchantName  
    );
    if (!sendSMSResponse) {
      return res.status(500).json({ error: "Failed to send receipt via SMS" });
    }
    console.log("Send SMS response: ", sendSMSResponse);

    if (emailAddress) {
      const sendEmailResponse = await sendEmailHelper.sendEmail(
        orderId,
        transactionId,
        emailAddress,
        app,
        merchantName
      );
      if (!sendEmailResponse) {
        return res.status(200).json({
          message:
            "Partial success: SMS sent successfully, failed to send email",
        });
      }
    }

    res.status(200).json({
      message:
        "Receipt sent successfully via SMS" +
        (emailAddress ? " and email" : ""),
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
