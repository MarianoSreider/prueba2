import React from "react";
// import reactDom from "react-dom";
// import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import M_body from "../../components/main-body/Body";
import Embed from "../../components/main-body/embed/Embed";
import * as config from "../../Config";
class GB_Priorities extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <div>
                         <Top_bar section="Priorities" />
                    </div>

                    <div>
                         <M_body
                              report="6a0431b1-28c9-49e8-8ab2-fee2c53abce7"
                              workspace={config.workspaceId}
                              page="ReportSection65b9b0ba398295b02a0c"
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
                         <Top_bar section="Priorities" />
                    </Embed>
               </React.Fragment>
          );
     }
}

export default GB_Priorities;
