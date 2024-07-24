import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Thankyou from "../Components/Thankyou";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js";
import { getOrderDetails, getTransactionDetails } from "../lib/endpoints";

const ReceiptPage = () => {
  console.log("Inside receipt page ");
  const [searchParams, setSearchParams] = useSearchParams();
  const app = searchParams.get("app");
  const { orderId, transactionId } = useParams();
  console.log("app value:", app);
  console.log("Order ID: ", orderId);
  const [orderData, setOrderData] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const callToGetOrderDetails = async () => {
      try {
        let response = await getOrderDetails(orderId, app);
        console.log("Response: ", response);
        console.log(response.status);
        if (response.status) {
          setOrderData(response.data.order);
          console.log("OrderData#####", orderData);
          console.log(`Order Data: ${response.data.success}`);
        } else {
          console.log("Error: ", response.data, response.status);
          toast.error(`No order found for this order ID`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        console.error(`Error fetching order details ${error}`);
        toast.error(`An error occurred while fetching order details`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    const callToGetTransactionDetails = async () => {
      try {
        let response = await getTransactionDetails(transactionId, app);
        console.log("Response of getTransactionDetails: ", response?.data);
        if (response.status) {
          const cardType = response?.data?.cardType;
          const cardNumber = response?.data?.cardNumber;
          setCardNumber(cardNumber?.slice(-8));
          setCardType(cardType);
          console.log("Card Type : ", cardType);
          console.log("Card Number: ", cardNumber);
        } else {
          console.log("card type and card number not found");
          setCardType("CARD");
          setCardNumber("XXXXXXXX");
        }
      } catch (error) {
        console.error(`Error fetching transaction details ${error}`);
        toast.error(`An error occurred while fetching transaction details`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    console.log("Calling getOrderDetails");
    if (orderId) callToGetOrderDetails();
    if (transactionId) callToGetTransactionDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, orderId, transactionId]);

  console.log("Order Data: ", orderData)

  useEffect(() => {
    if (orderData && orderData.date) {
      const orderDate = new Date(orderData.date);
      const formattedDate = orderDate.toLocaleDateString();
      const formattedTime = orderDate.toLocaleTimeString();
      
      setDate(formattedDate);
      setTime(formattedTime);
      } else {
        setDate("00/00/00");
        setTime("00:00:00");
        }
        }, [orderData]);
        
  if(!orderData) return <div className="receiptHolder" id="receipt-content">
  {/* <Header />
  <Thankyou /> */}
  <div className="receiptDetails mt-3" id="receipt-content">
    <div style={{ fontSize: "24px", fontWeight: "600" }}>
          Transaction Receipt
        </div>
    <div className="notFound">
    <p className="loading">Order not found...</p>
    <ToastContainer />
    </div>
  </div>
  <Footer />
</div>

        const {tax, item_number, item_price, payment_status, transaction_id, total_amount, merchant_address, merchant_name, merchant_tel, terminal_id, purchase_type} = orderData

  const handleSaveAsPDF = () => {
    const content = document.getElementById("receipt-content");
    const contentClone = content.cloneNode(true);
    const buttonClone = contentClone.querySelector("#save-pdf-button");
    if (buttonClone) {
      buttonClone.parentNode.removeChild(buttonClone);
    }

    const pdfOptions = {
      margin: 20,
      filename: "receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(contentClone).set(pdfOptions).save();
  };

  const getTransactionMessage = (transactionType, paymentStatus) => {
    const messages = {
        sale: {
            APPROVAL: 'TRANSACTION APPROVED',
            DECLINED: 'TRANSACTION DECLINED',
            default: 'UNKNOWN PAYMENT STATUS'
        },
        auth: {
            APPROVAL: 'TRANSACTION APPROVED',
            DECLINED: 'TRANSACTION DECLINED',
            default: 'UNKNOWN PAYMENT STATUS'
        },
        refund: {
            APPROVAL: 'TRANSACTION REFUNDED',
            DECLINED: 'REFUND FAILED',
            default: 'UNKNOWN PAYMENT STATUS'
        },
        completion: {
            APPROVAL: 'TRANSACTION APPROVED',
            DECLINED: 'TRANSACTION DECLINED',
            default: 'UNKNOWN PAYMENT STATUS'
        },
        void: {
            APPROVAL: 'TRANSACTION VOIDED',
            DECLINED: 'VOID FAILED',
            default: 'UNKNOWN PAYMENT STATUS'
        }
    };

    return messages[transactionType]?.[paymentStatus] || messages[transactionType]?.default || 'UNKNOWN TRANSACTION TYPE';
}
  return (
    <div className="receiptHolder" id="receipt-content">
      {/* <Header />
      <Thankyou /> */}
      <div className="receiptDetails mt-3" id="receipt-content">
        <div style={{ fontSize: "32px", fontWeight: "600" }}>
          {merchant_name || "Merchant Name"}
        </div>
        <div id="receipt-address">
          <p style={{ fontSize: "16px", width: "230px" }}>Address: {merchant_address || "Merchant Address"}</p>
        </div>
        <div id="receipt-phone">
          <p style={{ fontSize: "16px", width: "230px" }}>Tel: {merchant_tel || "Merchant Telephone"}</p>
        </div>
        <br />
        <div className="receiptDataHolder">
          <span>Item No: {item_number}</span>
          <span>${item_price || 0.00}</span>
        </div>
        <hr />
        {(tax !== "0.00") && <div className="taxContent">
          <span>Tax</span>
          <span>${tax || 0.00}</span>
        </div>}
        <div className="totalContent">
          <span>Total </span>
          <span>${total_amount || 0.00}</span>
        </div>
        <hr />
        <div className="transactionInfoHolder">
             <div className="trnasctionInfo">
              <span>Type: {purchase_type?.toUpperCase() || 'NA'}</span>
            </div>
          <div className="trnasctionInfo">
            <span>
              {cardType} {cardNumber}
            </span>
          </div>
          <div className="trnasctionInfo">
            <span>
              {date} {time}
            </span>
          </div>
          <div className="trnasctionInfo">
            <span>RRN: #{transaction_id || "NA"}</span>
          </div>
          <div className="trnasctionInfo">
            <span>Terminal ID: {terminal_id ||  "NA"}</span>
          </div>
        </div>
        <div className="transactionStatus">
              <span>{getTransactionMessage(purchase_type, payment_status)}</span>
            </div>
        <br />
        <button id="save-pdf-button" onClick={handleSaveAsPDF}>
          Save as PDF
        </button>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default ReceiptPage;
