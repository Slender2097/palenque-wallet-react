import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./PaymentsModal.css";

const customStyles = {
 content: {
  top: "10%", 
  left: "30%", 
  right: "30%", 
  bottom: "10%", 
  height: "auto", 
  maxHeight: "80vh", 
  overflow: "auto",
 },
};

const PaymentsModal = ({ modalState, setModalState }) => {
  const API_KEY = process.env.REACT_APP_X_API_KEY;

// Our state for the info we will send to either generate a new invoice or pay an invoice
 const [formData, setFormData] = useState({
    amount: 0,
    invoiceToPay: "",
    memo: "",
  });
  // Our state for storing the invoice we created to be paid
  const [invoice, setInvoice] = useState("");
  // Our state for the invoice we paid
  const [paymentInfo, setPaymentInfo] = useState({
    paymentHash: "",
    checkingId: "",
  });

  const handleSend = (e) => {
    // Keep the page from refreshing when the form is submitted
    e.preventDefault();
    console.log(process.env.REACT_APP_X_API_KEY);
    console.log("API Key from .env:", API_KEY);
 
    const headers = {
      "X-Api-Key": API_KEY,
    };

    const data = {
      bolt11: formData.invoiceToPay,
      out: true,
    };
    axios
      .post("https://demo.lnbits.com/api/v1/payments", data, { headers })
      .then((res) =>
        setPaymentInfo({
          paymentHash: res.data.payment_hash,
          checkingId: res.data.checking_id,
        })
      )
      .catch((err) => console.log(err));

      return;
  };
 

  const handleReceive = (e) => {
    // Keep the page from refreshing when the form is submitted
    e.preventDefault();
    console.log(process.env.REACT_APP_X_API_KEY);
 
    const headers = {
      "X-Api-Key": API_KEY,
    };
    const data = {
      amount: formData.amount,
      out: false,
      memo: formData.memo || "LNBits",
    };
    axios
      .post("https://demo.lnbits.com/api/v1/payments", data, { headers })
      .then((res) => {
        console.log("Invoice Response:", res.data); // Log full response
    
        if (res.data && res.data.bolt11) {
          setInvoice(res.data.bolt11); // Set the bolt11 invoice value
        } else {
          console.error("No bolt11 in the response", res.data);
        }
      })
      .catch((err) => console.log(err));

      return;
  }; 

  // Function to clear all of our state when we close the modal
 const clearForms = () => {
  setModalState({
    type: "",
    open: false,
  });
  setInvoice("");
  setPaymentInfo({
    paymentHash: "",
    checkingId: "",
  });
  setFormData({
    amount: 0,
    invoiceToPay: "",
    memo: formData.memo || "LNBits",
  });
};

 return (
<Modal
     isOpen={modalState.open}
     style={customStyles}
     contentLabel="Example Modal"
     appElement={document.getElementById("root")}
   >
     <p
       className="close-button"
       onClick={() => {
         clearForms();
       }}
     >
       X
     </p>
     {/* If it is a send */}
     {modalState.type === "send" && (
       <form>
         <label>paste an invoice</label>
         <input
           type="text"
           value={formData.invoiceToPay}
           onChange={(e) =>
             setFormData({ ...formData, invoiceToPay: e.target.value })
           }
         />
         <button className="button" onClick={(e) => handleSend(e)}>
           Submit
         </button>
       </form>
     )}
     {/* If it is a receive */}
     {modalState.type === "receive" && (
       <form>
         <label>enter amount</label>
         <input
           type="number"
           min="0"
           value={formData.amount}
           onChange={(e) =>
             setFormData({ ...formData, amount: e.target.value })
           }
         />
          
          {/* Memo */}
          <label>enter memo</label>
          <input
            type="text"
            value={formData.memo}
            onChange={(e) =>
              setFormData({ ...formData, memo: e.target.value })
            }
            placeholder="Optional memo"
          />

         <button className="button" onClick={(e) => handleReceive(e)}>
           Submit
         </button>
       </form>
     )}

     {/* If we are displaying our newly created invoice */}
     {invoice && (
       <section>
         <h3>Invoice created</h3>
         <div className="qr-code-container">
            <QRCodeCanvas
              value={invoice}
              size={128} // Adjust size as needed
              bgColor="#1A1A2E" // Match background
              fgColor="#ffe28a" // Match text color
            />
          </div>
          <p className="invoice-text">{invoice}</p>
       </section>
     )}
     
     {/* If we are displaying the status of our successful payment */}
     {paymentInfo.paymentHash && (
       <section>
         <h3>Payment sent</h3>
         <p>Payment hash: {paymentInfo.paymentHash}</p>
         <p>Checking id: {paymentInfo.checkingId}</p>
       </section>
     )}
   </Modal>
 );
};

export default PaymentsModal;