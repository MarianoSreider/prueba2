import React from "react";
// import reactDom from "react-dom";
// import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import M_body from "../../components/main-body/Body";
import Embed from "../../components/main-body/embed/Embed";
import * as config from "../../Config";
import "./TestStyle.css";

class TestReport extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <div>
                         <Top_bar section="industries" />
                    </div> */}

                    <div
                    // id="Body"
                    >
                         <Embed
                              report="7fa6d624-e0cf-428b-b23b-c55950a6d590"
                              workspace="d95f98a4-ea38-4386-8ee8-efc6f0c719ec"
                              page="ReportSection"
                              setTargetPath={this.props.setTargetPath}
                              getTargetPath={this.props.getTargetPath}
                              setAppliedFilters={this.props.setAppliedFilters}
                              getAppliedFilters={this.props.getAppliedFilters}
                              sendHome={() => {
                                   this.props.sendHome();
                              }}
                         ></Embed>
                         {/* <Embed></Embed> */}
                    </div>
               </React.Fragment>
          );
     }
}

export default TestReport;
