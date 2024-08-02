import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header2 from '../components/header2';
import Footer from '../components/footer';
import {login} from '../api/internal'; // Import the login function from the API module

import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [phoneNumber, setphoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const data = {phoneNumber,password};
    console.log(data);

    try {
      const response = await login(data);

      console.log("response");
      console.log(response);
      console.log("response data")
      console.log(response.data);
      if (response.status === 200) {
        
        
        const user = {
          isVerified: response.data.isVerified,
          userId: response.data.userId,
          username: response.data.username,
          user_type: response.data.user_type,
          token: response.data.token,
          phoneNumber: response.data.phoneNumber
         
    
        };
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUser(user));

        navigate('/dashboard');
      } else if (response.code === 'ERR_BAD_REQUEST') {
        setError(response.response.data.message);
      }
    } catch (error) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <Header2 />
      <section className="contact-us section">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="inner" style={{ width: '700px' }}>
            <div className="row">
              <div style={{ width: '100%' }}>
                <div className="contact-us-form">
                  <h2>Login For Wishtun</h2>
                  <p>Login Now To Listen To Songs</p>
                  {error && <p className="error">{error}</p>}
                  {/* Form */}
                  <form className="form" method="post" onSubmit={handleSubmit}>
                    <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input
                            type="text"
                            name="phoneNumber"
                            placeholder="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setphoneNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group login-btn">
                          <button className="btn" type="submit">Login!</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0px' }}>
                          <p style={{ marginBottom: '0px!important' }}>
                            Don't Have An Account? <Link to="/signup">Sign Up</Link>
                          </p>
                        </div>
{/* 
                        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0px' }}>
                          <p style={{ marginBottom: '0px!important' }}>
                            Have A DJ Account? <Link to="/Djlogin">Log In Here</Link>
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </form>
                  {/* End Form */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
