import React, { useState } from "react";
// import reactDom from "react-dom";
// import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import M_body from "../../components/main-body/Body";
import Embed from "../../components/main-body/embed/Embed";
import * as config from "../../Config";
import "./TestStyle.css";

// const [isExportInProgress, setIsExportInProgress] = useState < boolean > false;
// const [error, setError] = useState < string > "";

// const [isExportInProgress, setIsExportInProgress] = useState(false);
// const [error, setError] = useState("");
// const [state, setState] = useState(0);

// function toggleExportProgressState() {
//      setIsExportInProgress((prevState) => !prevState);
// }

class TestReport48 extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <div>
                         <Top_bar section="industries" />
                    </div> */}

                    <div id="Body">
                         <Embed
                              report="36ed2a5c-1209-4720-a651-e557a6d1008f"
                              workspace="3fab8396-2540-43b3-9b32-a532bed12660"
                              page="ReportSection3"
                              setTargetPath={this.props.setTargetPath}
                              getTargetPath={this.props.getTargetPath}
                              setAppliedFilters={this.props.setAppliedFilters}
                              getAppliedFilters={this.props.getAppliedFilters}
                              sendHome={() => {
                                   this.props.sendHome();
                              }}
                              // isExportInProgress={isExportInProgress}
                              // setError={() => setError()}
                              // toggleExportProgressState={() => {
                              //      toggleExportProgressState();
                              // }}
                              // updateApp={setState}
                         ></Embed>
                         {/* <Embed></Embed> */}
                    </div>
               </React.Fragment>
          );
     }
}

export default TestReport48;
