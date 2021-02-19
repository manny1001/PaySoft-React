import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql, useMutation } from "@apollo/client";
export const PAYMENT_CONFIRMATION = gql`
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
function App({ uuidTrip, totalAmount }) {
  const [PayOrConfirm, { called }] = useMutation(PAYMENT_CONFIRMATION);
  console.log(uuidTrip, totalAmount, called);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          disabled={called ? true : false}
          onClick={() => /* window.close() */ {
            PayOrConfirm({
              variables: {
                uuidTrip: uuidTrip,
                totalAmount: totalAmount,
                paymentMethod: "Card",
              },
            });
          }}
        >
          click
        </button>
      </header>
    </div>
  );
}

export default function Application() {
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
      <App uuidTrip={uuidTrip} totalAmount={totalAmount} />
    </ApolloProvider>
  );
}
