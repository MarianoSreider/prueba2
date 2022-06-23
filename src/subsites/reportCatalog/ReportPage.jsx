import React from "react";
// import reactDom from "react-dom";
import "./App.css";
import SideBar from "../../components/reportCatalog/SideBar";
import RP_MainBody from "../../components/reportCatalog/reportPage-comp/mainBody";

class ReportPage extends React.Component {
     render() {
          return (
               <React.Fragment>
                    <div class="splitleft">
                         <SideBar />
                    </div>

                    <div class="splitright">
                         <div>
                              <RP_MainBody report={this.props.report} />
                         </div>
                    </div>
               </React.Fragment>
          );
     }
}

export default ReportPage;
