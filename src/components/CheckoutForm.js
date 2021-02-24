import React, { lazy } from "react";
import { gql, useMutation } from "@apollo/client";
import { Container, Typography, CssBaseline, Button } from "@material-ui/core";

import PaymentForm from "./PaymentForm";
const PAYMENT_CONFIRMATION = gql`
  mutation PayOrConfirm(
    $uuidTrip: String
    $totalAmount: String
    $paymentMethod: String
  ) {
    TripCardPaymentCashConfirmation(
      uuidTrip: $uuidTrip
      totalAmount: $totalAmount
      paymentMethod: $paymentMethod
    )
  }
`;

export const CheckoutForm = ({ uuidTrip, totalAmount }) => {
  const createOptions = () => {
    return {
      style: {
        base: {
          fontSize: "16px",
          color: "#424770",
          fontFamily: "Open Sans, sans-serif",
          letterSpacing: "0.025em",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#c23d4b",
        },
      },
    };
  };
  const [PayOrConfirm, { called, error }] = useMutation(PAYMENT_CONFIRMATION, {
    errorPolicy: "all",
  });
  /*   console.log(uuidTrip, totalAmount, called, error && error.graphQLErrors); */

  const handleSubmit = async (event) => {};

  /* if (error)
    return (
      <p>
        An error has occured, Our server is down, your payment was not
        processed. You are welcome to try again or call our support team
      </p>
    ); */
  /*   if (uuidTrip === undefined || totalAmount === undefined)
    return <p>Page not available</p>; */
  return (
    <form onSubmit={handleSubmit}>
      <CssBaseline />
      <div className="header">
        <Typography
          style={{
            /* backgroundColor: "#cfe8fc", */

            color: "white",
          }}
          variant="h4"
          component="h1"
        ></Typography>
      </div>
      <Container maxWidth="sm">
        <div class="box effect2">
          <div class="buttonHolder">
            <Typography style={{ color: "white" }} variant="h5" component="h2">
              Trippy Driver
            </Typography>
            <Typography style={{ color: "white" }} variant="h6" component="h5">
              Total : R85
            </Typography>
            <p>this is just a test account no payments will be processed :=)</p>
            <PaymentForm />
          </div>
          <Typography
            style={{
              color: "white",
              fontWeight: "100",
              fontSize: 12,
              margin: 40,
            }}
            variant="h8"
            component="h2"
          >
            *By proceeding with the payment you agree to our Terms and
            conditions.
          </Typography>
          {/* <Button
            disabled={called ? true : false}
            onClick={() => {
              try {
                PayOrConfirm({
                  variables: {
                    uuidTrip: uuidTrip,
                    totalAmount: totalAmount,
                    paymentMethod: "Card",
                  },
                });
                window.close();
              } catch (err) {
                alert("Error has occured");
              }
            }}
            style={{ width: "70%" }}
            size="large"
            variant="contained"
            color="primary"
          >
            Pay
          </Button> */}
        </div>
      </Container>
    </form>
  );
};
