import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => (
  <div className="container text-center mt-5">
    <h1 className="mb-4">Welcome to Captive Portal</h1>
    <form className="form-inline justify-content-center">
      <input
        type="text"
        className="form-control mr-2"
        placeholder="Username"
        name="username"
      />
      <input
        type="password"
        className="form-control mr-2"
        placeholder="Password"
        name="password"
      />
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  </div>
);

export default App;
