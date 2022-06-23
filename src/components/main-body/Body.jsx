import React, { Component } from "react";
// import reactDom from "react-dom";
import "./Body.css";
import Embed from "./embed/Embed";
import { Link } from "react-router-dom";
import * as config from "../../Config";

class M_body extends React.Component {
     render() {
          return (
               <div className="main-body">
                    <Embed
                         report={this.props.report}
                         workspace={this.props.workspace}
                         page={this.props.page}
                         setTargetPath={this.props.setTargetPath}
                         getTargetPath={this.props.getTargetPath}
                         setAppliedFilters={this.props.setAppliedFilters}
                         getAppliedFilters={this.props.getAppliedFilters}
                         sendHome={() => {
                              this.props.sendHome();
                         }}
                    >
                         {" "}
                    </Embed>
               </div>
          );
     }
}

export default M_body;
