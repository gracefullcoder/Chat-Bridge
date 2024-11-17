import React, { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { useAuth0, User } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Container from './components/Container';
import displayRazorPay from "./razorpay";


function App() {

  const { user } = useAuth0();
  const [userDetails, setUserDetails] = useState({});
  const [status, setStatus] = useState(0);
  console.log(user);

  useEffect(() => {
    if (status == 1) {
      const requiredDetails = {
        userId: userDetails.userId
        , totalAmount: 500
        , paymentUrl: `${import.meta.env.VITE_BACKEND_DOMAIN}/payment`
        , userName: user.name
        , successUrl: `${import.meta.env.VITE_BACKEND_DOMAIN}/payment/success`
        // , orderDetails: cart.orders
        , updateChanges: () => { setStatus(2) }
      }
      displayRazorPay(requiredDetails);
    }
  }, [user, status])

  return (
    <>
      <Navbar user={user} setUserDetails={setUserDetails} setStatus={setStatus} />
      {user && status == 0 ? "LOADING" :
        status == 2 ? <Container user={{ ...userDetails, ...user }} /> :
          <></>
      }
    </>
  );
}

export default App;
