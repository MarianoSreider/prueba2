import React from "react";
// import reactDom from "react-dom";
import logo from "../logo.svg";
import "./styles.css";

class RP_MainBody extends React.Component {
    render() {
        return (
            <div>
                <h1 className="MainTitle"> {this.props.report.R_Name} </h1>
                {/* <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p className="top-pad">Details yet not defined.</p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header> */}
                <div className="pwbi" align="center">
                    <iframe
                        class="embebed_pbi"
                        src="https://app.powerbi.com/reportEmbed?reportId=46e97962-3e83-4a88-93c3-51093e425779&autoAuth=true&filterPaneEnabled=false&navContentPaneEnabled=false&ctid=e0793d39-0939-496d-b129-198edd916feb&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLW5vcnRoLWNlbnRyYWwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D&pageName=ReportSection638c9f33c2d5831d432d"
                        frameborder="0"
                        // allowFullScreen="true"
                    ></iframe>
                </div>
            </div>
        );
    }
}

export default RP_MainBody;
