import React from "react";
// import reactDom from "react-dom";
// import logo from "../logo.svg";
import "./Body.css";
import RCtlgTopBar from "../rClgTopBar";
import Gallery from "./body-components/Gallery";

class MainBody extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <div className="top-bar">
                         <RCtlgTopBar></RCtlgTopBar>
                    </div> */}
                    <div className="main-body">
                         <Gallery reports={this.props.reports} />
                    </div>
               </React.Fragment>
          );
     }
}

export default MainBody;
