import React, { Component } from "react";
// import reactDom from "react-dom";
import "./SideBar.css";
import logo from "./logo.svg";
import { Link } from "react-router-dom";
import UserAuthentication from "../authentication/userAuthentication";
class SideBar extends React.Component {
     constructor() {
          super();

          // this.state = { redirectTo: this.props.redirectTo };
     }

     render() {
          return (
               <div>
                    <img src={logo} className="SB-logo" alt="logo" />
                    <Link to="/">
                         <button
                              id="welcome"
                              className="PannelButton"
                              onClick={() => this.userPage()}
                         >
                              Login
                         </button>
                    </Link>
                    <Link to="/">
                         <button className="PannelButton">Home</button>
                    </Link>

                    <button className="PannelButton">Reports</button>
                    <button className="PannelButton">Settings</button>

                    {/* <UserAuthentication /> */}
                    <UserAuthentication
                         redirectTo={this.props.redirectTo}
                         getTargetPath={this.props.getTargetPath}
                         setTargetPath={this.props.setTargetPath}
                    />
               </div>
          );
     }

     userPage() {
          const welcome = document.getElementById("welcome");
          if (welcome !== null) {
               if (welcome.innerText !== "Login") {
                    let userName = welcome.innerText
                         .toLowerCase()
                         .split(" ")
                         .reverse()
                         .join(".")
                         .replace(",", "");
                    let peopleLink =
                         "https://people.accenture.com/People/user/" + userName;
                    console.log(userName);
                    console.log(peopleLink);
                    window.location.href = peopleLink;
               }
          }
     }
}

export default SideBar;
