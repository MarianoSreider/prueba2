import React from "react";
// import reactDom from "react-dom";
// import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import M_body from "../../components/main-body/Body";
import Embed from "../../components/main-body/embed/Embed";
import * as config from "../../Config";

class GB_Industries extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <div>
                         <Top_bar section="industries" />
                    </div>

                    <div>
                         <M_body
                              report="f891e3fa-98d2-4f31-88be-4b6309b91259"
                              workspace={config.workspaceId}
                              page="ReportSection"
                              setTargetPath={this.props.setTargetPath}
                              getTargetPath={this.props.getTargetPath}
                              setAppliedFilters={this.props.setAppliedFilters}
                              getAppliedFilters={this.props.getAppliedFilters}
                              sendHome={() => {
                                   this.props.sendHome();
                              }}
                         />
                         
                    </div> */}
                    <Embed
                         report={config.reportId}
                         workspace={config.workspaceId}
                         setTargetPath={this.props.setTargetPath}
                         getTargetPath={this.props.getTargetPath}
                         setAppliedFilters={this.props.setAppliedFilters}
                         getAppliedFilters={this.props.getAppliedFilters}
                         sendHome={() => {
                              this.props.sendHome();
                         }}
                    >
                         <Top_bar section="industries" />
                    </Embed>
               </React.Fragment>
          );
     }
}

export default GB_Industries;
