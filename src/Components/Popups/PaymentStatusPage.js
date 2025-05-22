import React from "react";
import { useLocation } from "react-router-dom";

function PaymentStatusPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const success = params.get("success") === "true";
    const orderId = params.get("orderId");
    const transactionId = params.get("transactionId");
    const status = params.get("status");
    const message = params.get("message");

    return (
        <div style={{ padding: 40, textAlign: "center" }}>
            {success ? (
                <>
                    <h2 style={{ color: "green" }}>Payment Successful!</h2>
                    <p>Your payment was successful.</p>
                    {transactionId && <p>Transaction ID: <b>{transactionId}</b></p>}
                    {orderId && <p>Order ID: <b>{orderId}</b></p>}
                </>
            ) : (
                <>
                    <h2 style={{ color: "red" }}>Payment Failed</h2>
                    <p>{message || "Your payment could not be processed."}</p>
                    {status && <p>Status: {status}</p>}
                </>
            )}
        </div>
    );
}

export default PaymentStatusPage;