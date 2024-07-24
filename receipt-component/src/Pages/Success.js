import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { sendReceipt, getOrderDetails, storeUserData } from "../lib/endpoints";
import { ToastContainer, toast } from "react-toastify";

const Success = ({ orderId, app }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotal] = useState(null);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const callToGetOrderDetails = async () => {
      try {
        let response = await getOrderDetails(orderId, app);
        if (response.status) {
          setOrderData(response.data.order);
        } else {
          toast.error("No order found for this order ID", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("An error occurred while fetching order details", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };

    if (orderId) callToGetOrderDetails();
  }, [orderId]);

  
  useEffect(() => {
    if (orderData) {
      setTotal(orderData?.total_amount);
      setTransactionId(orderData?.transaction_id);
    }
  }, [orderData]);

  console.log("order data gotten from backend", orderData);

  const merchantName = orderData?.merchant_name || "Merchant Name"

  const handleOnClick = async () => {
    if (!mobileNo) {
      toast.warn("Please give mobile no", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!orderId) {
      toast.error("Order Id not found", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    console.log(mobileNo);
    console.log(email);
    console.log(orderId);
    console.log(transactionId);
    setIsLoading(true);
    const isReceiptSent = await sendReceipt(mobileNo, email, orderId, transactionId, app, merchantName);
    if (isReceiptSent) {
      toast.success(
        `Receipt sent to your mobile number, if you haven't received it please check given contact number: ${mobileNo}`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } else {
      toast.error("Failed to send receipt", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    const isUserDataStored = await storeUserData(mobileNo, email, orderId, app, merchantName);
    if (isUserDataStored) {
      console.log("User data stored successfully");
    } else {
      console.log("Failed to store User data");
    }
    setIsLoading(false);
    setEmail("");
    setMobileNo("");
  };

  const handleMobileNoChange = (event) => {
    const inputValue = event.target.value;
    console.log(inputValue);
    const numericValue = inputValue.replace(/\D/g, "");
    setMobileNo(numericValue);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="successHolder">
      {isLoading ? (
        <div className="thankYouPageLoaderHolder">
          <div className="spinner">
            <ThreeDots
              height="80"
              width="80"
              color="grey"
              radius="6"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="rings-loading"
            />
          </div>
        </div>
      ) : (
        <div>
          {/* <Header canRedirect={true} /> */}
          <div className="thankYouTextContainer">
          <div className="merchantName">
          {merchantName}
        </div>

            <span className="thankYouText">THANK YOU!</span>
          </div>
          <div className="d-flex flex-column p-2 contactInfoInputsContainer">
            <h4 className="forReceiptText">For Receipt: </h4>
            <input
              id="mobileNo"
              placeholder="Mobile Number*"
              className="receiptInput"
              type="text"
              name="mobileNo"
              value={mobileNo}
              onChange={handleMobileNoChange}
              pattern="[0-9]*"
            />
            <input
              id="email"
              placeholder="Email"
              className="receiptInput"
              type="text"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
            <div className="mb-1 mt-2 disclaimerTextHolder">
              <span className="disclaimerText">
                *By entering your contact details you agree to receive
                promotional messages from time to time.
              </span>
            </div>
          </div>

          <div className="mb-4 transactionDetailsHolder">
            <div id="transactionIdDetails" style={{ marginBottom: "1rem" }}>
              <span className="transactionDetailsKey">Trans Id : &nbsp;</span>
              <span className="transactionDetailsValue">#{transactionId}</span>
            </div>
            <div id="amountPaidDetails">
              <span className="transactionDetailsKey">
                Amount Paid : &nbsp;
              </span>
              <span className="transactionDetailsValue">${total} USD</span>
            </div>
          </div>

          <div className="receiptButton mt-2" onClick={handleOnClick}>
            GET RECEIPT
          </div>
          <Footer />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Success;
