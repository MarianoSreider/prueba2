import React from "react";
// import reactDom from "react-dom";
import "./App.css";
import Top_bar from "./components/top-bar/top-bar";
import M_body from "./components/main-body/Body";
import Embed from "./components/main-body/embed/Embed";
import * as config from "./Config";
import UserAuthentication from "./components/authentication/userAuthentication";
import { getSupportedCodeFixes } from "typescript";

class Home extends React.Component {
     constructor() {
          super(this.props);

          // this.state = { redirectTo: this.props.redirectTo };
     }
     render() {
          return (
               <React.Fragment>
                    <div>
                         <Top_bar />
                    </div>

                    {/* <UserAuthentication
                         redirectTo={this.props.redirectTo}
                         setTargetPath={this.props.setTargetPath}
                    /> */}
                    <div>
                         {/* <M_body
                              report="f891e3fa-98d2-4f31-88be-4b6309b91259"
                              workspace={config.workspaceId}
                              page="ReportSection65b9b0ba398295b02a0c"
                         /> */}
                         {/* <Embed></Embed> */}
                    </div>
               </React.Fragment>
          );
     }
}

export default Home;
