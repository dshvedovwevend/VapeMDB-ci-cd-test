const AWS = require("aws-sdk");
require("dotenv").config();

exports.sendSMS = async (orderId, transactionId, phone, app, merchantName) => {
  const sns = new AWS.SNS();
  let successFlag = false;

  const receiptMessage = `Thank you for your purchase at ${merchantName}. To see or download your receipt: ${process.env.RECEIPT_PAGE_URL}/${orderId}/${transactionId}?app=${app}`;

  const smsParams = {
    Message: receiptMessage,
    PhoneNumber: phone,
  };

  try {
    const result = await sns.publish(smsParams).promise();
    console.log(result);
    successFlag = true;
  } catch (error) {
    successFlag = false;
    console.error("Error sending SMS receipt:", error);
  }
  return successFlag;
};
