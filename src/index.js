import React from "react";
import logo from "./logo.svg";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql, useMutation } from "@apollo/client";
import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import { PayButton, Wrapper } from "./styles";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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
  const [PayOrConfirm, { called, error }] = useMutation(PAYMENT_CONFIRMATION, {
    errorPolicy: "all",
  });
  console.log(uuidTrip, totalAmount, called, error && error.graphQLErrors);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
  };
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
      <Wrapper>
        <CardElement />
      </Wrapper>

      <PayButton
        onClick={() => {
          try {
            PayOrConfirm({
              variables: {
                uuidTrip: uuidTrip,
                totalAmount: totalAmount,
                paymentMethod: "Card",
              },
            }); /* window.close()  */
          } catch (err) {
            alert("Error has occured");
          }
        }}
        type="submit"
        disabled={!stripe || called ? true : false}
      >
        Pay
      </PayButton>
    </form>
  );
};

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

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
      <Elements stripe={stripePromise}>
        <CheckoutForm uuidTrip={uuidTrip} totalAmount={totalAmount} />
      </Elements>
    </ApolloProvider>
  );
};

ReactDOM.render(<App />, document.body);
