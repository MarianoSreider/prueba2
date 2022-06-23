import React, { Component } from "react";
// import reactDom from "react-dom";
import "./rClgTopBar.css";
import logo from "./logo.svg";
import { Link } from "react-router-dom";
class RCtlgTopBar extends React.Component {
     render() {
          return (
               <div className="top-bar">
                    {/* <img src={logo} className="SB-logo" alt="logo" /> */}
                    <Link to="/" id="Welcome" className="UserName">
                         Sign in
                    </Link>
               </div>
          );
     }
}

export default RCtlgTopBar;
