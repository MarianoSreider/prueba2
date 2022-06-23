import React from "react";
// import reactDom from 'react-dom';
import "./App.css";
import Home from "./OldHome";
import GB_App from "./subsites/Growth-Beacon/GB";
import GB_Industries from "./subsites/Growth-Beacon/GB_Industries";
import GB_Priorities from "./subsites/Growth-Beacon/GB_Priorities";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import GB_Home from "./subsites/Growth-Beacon/GB_Home";
import ReportPage from "./subsites/reportCatalog/ReportPage";
import RClgHome from "./subsites/reportCatalog/rClgHome";
import TestReport from "./subsites/TestWork47/Report";
import TestReport48 from "./subsites/TestWork48/Report";
// import { useHistory } from 'react-router';
class App extends React.Component {
     // state = {
     //      targetPath: "Null",
     //      reports: [
     //           {
     //                id: 1,
     //                R_Name: "Growth Beacon",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //                linkTo: "/GrowthBeacon",
     //           },
     //           {
     //                id: 2,
     //                R_Name: "Report 2",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 3,
     //                R_Name: "Report 3",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 4,
     //                R_Name: "Report 4",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 5,
     //                R_Name: "Report 5",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 6,
     //                R_Name: "Report 6",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 7,
     //                R_Name: "Report 7",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 8,
     //                R_Name: "Report 8",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //           {
     //                id: 9,
     //                R_Name: "Report 9",
     //                R_link: "",
     //                shrt_Summary: "A short description of this Report",
     //           },
     //      ],
     // };
     constructor() {
          super();

          this.state = {
               targetPath: null,
               appliedFilters: null,
               reports: [
                    {
                         id: 1,
                         R_Name: "Growth Beacon",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                         linkTo: "/GrowthBeacon",
                    },
                    {
                         id: 2,
                         R_Name: "Test Report 47",
                         R_link: "",
                         linkTo: "/TestReport47",
                         shrt_Summary: "Report in workspace 47",
                    },
                    {
                         id: 3,
                         R_Name: "Test Dashboard",
                         R_link: "",
                         linkTo: "/TestDashboard",
                         shrt_Summary: "Dashboard in workspace 47",
                    },
                    {
                         id: 4,
                         R_Name: "Test Report 48",
                         R_link: "",
                         linkTo: "/TestReport48",
                         shrt_Summary: "Report in workspace 48",
                    },
                    {
                         id: 5,
                         R_Name: "Report 5",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                    },
                    {
                         id: 6,
                         R_Name: "Report 6",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                    },
                    {
                         id: 7,
                         R_Name: "Report 7",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                    },
                    {
                         id: 8,
                         R_Name: "Report 8",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                    },
                    {
                         id: 9,
                         R_Name: "Report 9",
                         R_link: "",
                         shrt_Summary: "A short description of this Report",
                    },
               ],
          };

          this.setTargetPath = this.setTargetPath.bind(this);
          this.getTargetPath = this.getTargetPath.bind(this);
          this.getAppliedFilters = this.getAppliedFilters.bind(this);
          this.setAppliedFilters = this.setAppliedFilters.bind(this);
     }
     // setTargetPath(newTargetPath) {

     sendHome() {
          let navigate = useNavigate();
          navigate("/");
     }

     setTargetPath(newTargetPath) {
          this.state.targetPath = newTargetPath;
          return;
     }

     getTargetPath() {
          return this.state.targetPath;
     }

     setAppliedFilters(appliedFilters) {
          this.state.appliedFilters = appliedFilters;
          return;
     }

     getAppliedFilters() {
          return this.state.appliedFilters;
     }

     render() {
          return (
               <div>
                    <Routes>
                         <Route
                              path="/"
                              element={
                                   <RClgHome
                                        reports={this.state.reports}
                                        redirectTo={this.state.targetPath}
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                   />
                              }
                         />

                         {/* <Route path="/" element={<Home />} /> */}

                         {/* Growth Beacon */}
                         <Route path="/GrowthBeacon" element={<GB_Home />} />
                         <Route
                              path="/GrowthBeacon/Priorities"
                              element={
                                   <GB_Priorities
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                        setAppliedFilters={
                                             this.setAppliedFilters
                                        }
                                        getAppliedFilters={
                                             this.getAppliedFilters
                                        }
                                        sendHome={() => {
                                             this.sendHome();
                                        }}
                                   />
                              }
                         />
                         <Route
                              path="/GrowthBeacon/Industries"
                              element={
                                   <GB_Industries
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                        setAppliedFilters={
                                             this.setAppliedFilters
                                        }
                                        getAppliedFilters={
                                             this.getAppliedFilters
                                        }
                                        sendHome={() => {
                                             this.sendHome();
                                        }}
                                   />
                              }
                         />

                         <Route
                              path="/TestReport47"
                              element={
                                   <TestReport
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                        setAppliedFilters={
                                             this.setAppliedFilters
                                        }
                                        getAppliedFilters={
                                             this.getAppliedFilters
                                        }
                                        sendHome={() => {
                                             this.sendHome();
                                        }}
                                   />
                              }
                         />

                         <Route
                              path="/TestDashboard"
                              element={
                                   <TestReport
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                        setAppliedFilters={
                                             this.setAppliedFilters
                                        }
                                        getAppliedFilters={
                                             this.getAppliedFilters
                                        }
                                        sendHome={() => {
                                             this.sendHome();
                                        }}
                                   />
                              }
                         />

                         <Route
                              path="/TestReport48"
                              element={
                                   <TestReport48
                                        setTargetPath={this.setTargetPath}
                                        getTargetPath={this.getTargetPath}
                                        setAppliedFilters={
                                             this.setAppliedFilters
                                        }
                                        getAppliedFilters={
                                             this.getAppliedFilters
                                        }
                                        sendHome={() => {
                                             this.sendHome();
                                        }}
                                   />
                              }
                         />

                         {this.state.reports.map((report) => (
                              <Route
                                   exact
                                   path={
                                        "/ReportPage_" +
                                        report.R_Name.replace(" ", "_")
                                   }
                                   element={
                                        <ReportPage
                                             report={report}
                                             R_Name={report.R_Name}
                                             setTargetPath={this.setTargetPath}
                                             getTargetPath={this.getTargetPath}
                                             sendHome={() => {
                                                  this.sendHome();
                                             }}
                                        />
                                   }
                              />
                         ))}
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

export default App;
