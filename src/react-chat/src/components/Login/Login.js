import React, { useState } from 'react';
import * as SharedFunctions from '../../lib/SharedFunctions'
import axios from "axios";
import { API_BASE_URL, API_TOKEN, USER_NAME, USER_ID } from "../../constants/api_constants";

function Login(props) {
  
  const [state, setState] = useState({
    email: "",
    password: "",
    successMessage: null
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();

    const payload = {
      email: state.email,
      password: state.password
    };
    axios
      .post(API_BASE_URL + "/login", payload)
      .then(function (response) {
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            successMessage: "Login successful. Redirecting to home page."
          }));
          localStorage.setItem(USER_ID, response.data.data.id);
          localStorage.setItem(USER_NAME, response.data.data._name);
          localStorage.setItem(API_TOKEN, response.data.data.api_token);
          redirectToHome();
          props.showError(null);
        } else {
          props.showError("Username does not exists");
        }
      })
      .catch(function (error) {
        props.showError("Username does not exists");
      });
  };

  const redirectToHome = () => {
    props.navigate("/home");
  };

  const redirectToRegister = () => {
    props.navigate("/register");
  };

  return (
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={state.email}
            onChange={handleChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-check"></div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Submit
        </button>
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
      <div className="registerMessage">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>
          Register
        </span>
      </div>
    </div>
  );
}

export default SharedFunctions.withRouter(Login);
