import React, { useEffect, useState } from 'react';
import '../styles/otp.css'
import {getUserById} from '../api/internal'

import { useNavigate } from 'react-router-dom';
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {verifyUser} from '../api/internal'
const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneNumber = useSelector(state => state.user.phoneNumber); // Fetch the phoneNumber from the Redux store
  const[user,SetUser]=useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userWithoutOtp } = location.state || {};
  const {_id}= userWithoutOtp
  console.log(_id);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserById(_id);
        if (response?.status === 200) {
          SetUser(response.data); // Set user data from response
          console.log(user)
        } else {
          // setError('Failed to get user by ID');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        // setError('An error occurred while fetching user details');
      } finally {
        //setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUserDetails();
  }, [_id]); // Dependency array to re-fetch if userId changes

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };
  const handleSubmit =async(event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
  // const otp = user.otp
  const phoneNumber = user.phoneNumber
  console.log("phone"+phoneNumber)

    
      console.log("correct otp")
      const data={
        phoneNumber,
         otp
      }
      const response = await verifyUser(data)
      if(response.status === 200){
        // console.log("verified")
        console.log(response)
        console.log(response.data)
        const user = {
          isVerified: response.data.isVerified,
          userId: response.data._id,
          username: response.data.username,
          user_type: response.data.user_type,
          token: response.token,
          phoneNumber: response.data.phoneNumber,
        };

        dispatch(setUser(user));

        // dispatch(setUser(user));
        navigate('/dashboard');
        // navigate('/dashboard'); // Replace with the desired next page path
      }
    
    // Redirect or update the state as needed
  };

  const handleResendCode = () => {
    // Handle resend code logic here
    console.log('Resend code');
  };

  return (
    <div className="containerbody">
<div className="otp-container">
      <h1>OTP Verification</h1>
      <p>Enter OTP Code sent to +92(******)</p>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          {otp.map((value, index) => (
            <input
              key={index}
              type="number"
              id={`otp-input-${index}`}
              value={value}
              onChange={(event) => handleInputChange(index, event)}
              disabled={false}
              maxLength="1"
              autoFocus={index === 0}
            />
          ))}
        </div>
        <div className="p">
          <p className="p-h">Did not receive OTP code?</p>
          <a href="#" onClick={handleResendCode}>Resend Code</a>
        </div>
        <button type="submit" disabled={isSubmitting}>
          Verify & Proceed
        </button>
      </form>
    </div>
    </div>
    
  );
};

export default OTPVerification;
