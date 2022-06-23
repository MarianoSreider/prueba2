import React, { Component } from "react";
// import reactDom from "react-dom";
import "./Gallery.css";
import ReportPreview from "./ReportPreview";

class Gallery extends React.Component {
    state = { reports: this.props.reports };
    render() {
        return (
            <div className="Pannel">
                {this.state.reports.map((report) => (
                    <ReportPreview key={report.id} report={report} />
                ))}
            </div>
        );
    }
}

export default Gallery;
