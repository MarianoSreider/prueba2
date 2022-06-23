import React, { Component } from "react";
// import reactDom from "react-dom";
import "./ReportPreview.css";
import logo from "./logo.svg";
import { Link } from "react-router-dom";

class ReportPreview extends React.Component {
     render() {
          return (
               <Link
                    to={
                         this.props.report.linkTo == null
                              ? "/ReportPage_" +
                                this.props.report.R_Name.replace(" ", "_")
                              : this.props.report.linkTo
                    }
               >
                    <button className="SubPannel">
                         <img src={logo} className="SP-img" alt="logo" />
                         <h3>{this.props.report.R_Name}</h3>
                         <p className="top-pad">
                              {this.props.report.shrt_Summary}
                         </p>
                    </button>
               </Link>
          );
     }
}

export default ReportPreview;
