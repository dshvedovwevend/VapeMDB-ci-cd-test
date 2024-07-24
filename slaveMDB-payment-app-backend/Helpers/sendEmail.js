const AWS = require("aws-sdk");
require("dotenv").config();
exports.sendEmail = async (orderId, transactionId, emailId, app, merchantName) => {
  const ses = new AWS.SES();
  let successFlag = false;

  const appName = app.charAt(0).toUpperCase() + app.slice(1);

  const receiptMessage = `Thank you for your purchase at ${merchantName}. To see or download your receipt: ${process.env.RECEIPT_PAGE_URL}/${orderId}/${transactionId}?app=${app}`;
  const emailParams = {
    Destination: {
      ToAddresses: [emailId],
    },
    Message: {
      Body: {
        Text: {
          Data: receiptMessage,
        },
      },
      Subject: {
        Data: `${merchantName} ${appName} App Purchase Receipt`,
      },
    },
    Source: "jjamil@wevend.com",
  };

  try {
    const result = await ses.sendEmail(emailParams).promise();
    successFlag = true;
    console.log("result: ", result);
  } catch (error) {
    successFlag = false;
    console.error("Error sending Email receipt:", error);
  }
  return successFlag;
};
