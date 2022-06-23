import React from "react";
// import reactDom from 'react-dom';
import GB_Home from "./GB_Home";
import GB_Priorities from "./GB_Priorities";
import { Routes, Route, Link } from "react-router-dom";
class GB_App extends React.Component {
     render() {
          return (
               <div>
                    <Routes>
                         <Route path="/" element={<GB_Home />} />

                         <Route
                              path="/Priorities"
                              element={<GB_Priorities />}
                         />

                         {/* {this.state.reports.map((report) => (
          <Route exact path={"/ReportPage_" + report.R_Name.replace(" ","_")} 
            element={<ReportPage report={report} R_Name={report.R_Name} />}
          />
        ))} */}
                    </Routes>
               </div>
          );
     }
}

export default GB_App;
