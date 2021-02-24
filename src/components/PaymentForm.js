//import liraries
import React, { Suspense } from "react";

const PaymentForm = () => {
  return (
    <form
      action="https://peachpayments.docs.oppwa.com/tutorials/integration-guide/customisation"
      class="paymentWidgets"
      data-brands="VISA MASTER AMEX"
    ></form>
  );
};

export default PaymentForm;
