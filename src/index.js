import React from "react";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql, useMutation } from "@apollo/client";
import "./styles/index.css";
import ReactDOM from "react-dom";
import "./styles/index.css";
import { Container, Typography, CssBaseline, Button } from "@material-ui/core";

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

const CheckoutForm = ({ uuidTrip, totalAmount }) => {
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
            alignSelf: "flex-start",
            color: "white",
          }}
          variant="h4"
          component="h1"
        >
          Payment
        </Typography>
      </div>
      <Container maxWidth="sm">
        <div class="buttonHolder">
          <form
            action="{http://localhost:4000/graphql}"
            class="paymentWidgets"
            data-brands="VISA MASTER AMEX"
          ></form>

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

const App = () => {
  const [token, setToken] = React.useState(null);
  const [uuidTrip, setuuidTrip] = React.useState(null);
  const [totalAmount, settotalAmount] = React.useState(null);

  document.addEventListener("DOMContentLoaded", function (event) {
    var token = decodeURIComponent(document.location).split("?")[1];
    var totalAmount = decodeURIComponent(document.location).split("?")[2];
    var uuidTrip = decodeURIComponent(document.location).split("?")[3];
    settotalAmount(totalAmount);
    setuuidTrip(uuidTrip);
    setToken(token);
  });
  const httpLink = createHttpLink({
    uri: "http://192.168.8.125:4000/graphql",
  });
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    credentials: "same-origin",
  });
  return (
    <ApolloProvider client={client}>
      <CheckoutForm uuidTrip={uuidTrip} totalAmount={totalAmount} />
    </ApolloProvider>
  );
};

ReactDOM.render(<App />, document.body);
