import React from "react";
import "./Transactions.css";

export const Transactions = ({transactions = []}) => {

const parseTx = (tx) => {
  
  if (!tx.checking_id || !tx.time || typeof tx.amount !== "number") {
    console.warn("Invalid transaction:", tx);
    return null; 
  }
  
  const formatDate = (time) => {
    if (!time) return "No Date Available"; 
    const date = new Date(time); 
    return isNaN(date.getTime())
      ? "Invalid Date" 
      : date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
      }); 
  };
  
  const formattedDate = formatDate(tx.time);
  
  // Handle pending (incomplete) payments
  if (tx.pending || tx.status === "pending") {
    return (
      <div key={tx.checking_id} className="tx-item pending">
        <p>
          {tx.amount === 0 ? "Internal" : tx.amount > 0 ? "Receiving" : "Sending"}{" "}
          {tx.bolt11 ? `${tx.bolt11.substring(0, 25)}...` : "Payment"}
        </p>
        <p className="tx-amount">
          {tx.amount / 1000} sats (Pending)
        </p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
    );
  }

  // Handle internal payments (amount === 0 or specific tag/memo)
  if (tx.amount === 0 || tx.tag === "internal" || tx.memo?.includes("internal")) {
    return (
      <div key={tx.checking_id} className="tx-item internal">
        <p>Internal Transfer {tx.memo || tx.bolt11?.substring(0, 25) + "..."}</p>
        <p className="tx-amount">0 sats</p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
    );
  }

  // Handle received payments
  if (tx.amount > 0) {
    return (
      <div key={tx.checking_id} className="tx-item">
        <p>Received from {tx.bolt11.substring(0, 25)}...</p>
        <p>+{tx.amount / 1000} sats</p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
    );
  }

  // Handle sent payments
  if (tx.amount < 0) {
    return (
      <div id={tx.checking_id} key={tx.checking_id} className="tx-item">
        <p>Sent with {tx.bolt11.substring(0, 25)}...</p>
        <p className="tx-amount">{tx.amount / 1000} sats</p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
    );
  }

  // Fallback for unhandled cases
  console.warn("Unhandled transaction type:", tx);
  return null;
  };

  return (
    <div>
      <h3>Transactions</h3>
      {transactions.length === 0 ? 
      <p>No transactions available</p> 
      : transactions.map(parseTx)}
    </div>
  );
  };

export default Transactions;

