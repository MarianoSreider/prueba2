import React from 'react';
// import reactDom from 'react-dom';
import './App.css';
import Home from './rClgHome';
import ReportPage from './ReportPage';
import { Routes, Route, Link } from 'react-router-dom';
class App extends React.Component {
  state = {
    reports: [
      { id:1, R_Name:"Report 1", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:2, R_Name:"Report 2", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:3, R_Name:"Report 3", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:4, R_Name:"Report 4", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:5, R_Name:"Report 5", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:6, R_Name:"Report 6", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:7, R_Name:"Report 7", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:8, R_Name:"Report 8", R_link:"", shrt_Summary:"A short description of this Report" },
      { id:9, R_Name:"Report 9", R_link:"", shrt_Summary:"A short description of this Report" }
    ]

  }
  render() { 
    return <div>
      <Routes>
        <Route exact path="/" element={<Home reports={this.state.reports} />}/>

        {this.state.reports.map((report) => (
          <Route exact path={"/ReportPage_" + report.R_Name.replace(" ","_")} 
            element={<ReportPage report={report} R_Name={report.R_Name} />}
          />
        ))}
      </Routes>
        
    </div>
  }
}
 
export default App;
