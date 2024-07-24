export const getOrderDetails = async (orderId, app) => {
  console.log("Calling getOrderDetails");
  let apiUrl;

  if (app === "vending") {
    console.log("Inside getOrderDetails if: app = vending ");
    apiUrl = `${process.env.REACT_APP_GENERIC_VENDING_BACKEND_URL}/getData/orders/${orderId}`;
  }
  if (app === "vape") {
    console.log("Inside getOrderDetails if: app = vape ");
    apiUrl = `${process.env.REACT_APP_SLAVE_MDB_BACKEND_URL}/getData/orders/${orderId}`;
  }

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (response.status === 200) {
      console.log(`Response from getOrderDetails: ${result}`);
      return { data: result, status: true };
    } else {
      console.log(`Request from getOrderDetails: ${response.status}`);
      return { data: result, status: false };
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

export const getTransactionDetails = async (transactionId, app) => {
  let url;
  console.log("transaction Id: ", transactionId);
  if (app === "vending") {
    console.log("Inside getTransactionDetails if: app = vending ");
    url = `${process.env.REACT_APP_GENERIC_VENDING_BACKEND_URL}/getData/cardDetails/${transactionId}`;
  }
  if (app === "vape") {
    console.log("Inside getTransactionDetails if: app = vape ");
    url = `${process.env.REACT_APP_SLAVE_MDB_BACKEND_URL}/getData/cardDetails/${transactionId}`;
  }
  try {
    const getTransactionDetailsResponse = await fetch(url);
    const result = await getTransactionDetailsResponse.json();

    if (getTransactionDetailsResponse.status === 200) {
      console.log(`Response from getTransactionDetails: ${result}`);
      return { data: result, status: true };
    } else {
      console.log(
        `Request from getTransactionDetails: ${getTransactionDetailsResponse.status}`
      );
      return { data: result, status: false };
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const sendReceipt = async (phoneNo, email, orderId, transactionId, app, merchantName) => {
  const reqBody = {
    phoneNumber: `+1${phoneNo}`,
    email,
    orderId,
    transactionId,
    app,
    merchantName
  };
  console.log(reqBody);

  let url = `${process.env.REACT_APP_BACKEND_URL}/sendReceipt`;

  if (app === "vending") {
    console.log("Inside getOrderDetails if: app = vending ");
    url = `${process.env.REACT_APP_GENERIC_VENDING_BACKEND_URL}/sendReceipt`;
  }
  if (app === "vape") {
    console.log("Inside getOrderDetails if: app = vape ");
    url = `${process.env.REACT_APP_SLAVE_MDB_BACKEND_URL}/sendReceipt`;
  }

  const sendReceiptResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

  console.log(sendReceiptResponse);
  const sendReceiptResult = await sendReceiptResponse.json();
  if (sendReceiptResponse.status === 200) {
    console.log("Response from send receipt:", sendReceiptResult);
    return true;
  } else {
    console.log(
      `Request failed for send receipt, with status: ${sendReceiptResponse.status}`
    );
    console.log("error : ", sendReceiptResult);
    return false;
  }
};

export const storeUserData = async (phoneNo, email, orderId, app, merchantName) => {
  const reqBody = {
    phoneNumber: `+1${phoneNo}`,
    email: email,
    orderId: orderId,
    app: app,
    merchantName: merchantName};

  let url;

  if (app === "vending") {
    console.log("Inside getOrderDetails if: app = vending ");
    url = `${process.env.REACT_APP_GENERIC_VENDING_BACKEND_URL}/storeData/user`;
  }
  if (app === "vape") {
    console.log("Inside getOrderDetails if: app = vape ");
    url = `${process.env.REACT_APP_SLAVE_MDB_BACKEND_URL}/storeData/user`;
  }

  const storeDataResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

  console.log(storeDataResponse);
  const sendReceiptResult = await storeDataResponse.json();
  if (storeDataResponse.status === 200) {
    console.log("Response from store user data:", sendReceiptResult);
    return true;
  } else {
    console.log(
      `Request failed for store user data receipt, with status: ${storeDataResponse.status}`
    );
    console.log("error : ", sendReceiptResult);
    return false;
  }
};
