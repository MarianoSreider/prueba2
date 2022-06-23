import React, { Component } from "react";
// import reactDom from "react-dom";
import "./modal.css";
// import ReportPreview from "./ReportPreview";

class CaptureModal extends React.Component {
     //     state = { reports: this.props.reports };
     render() {
          return (
               <div id='modal-capture-view' className='modal fade' role='dialog' data-backdrop='static'>
                    <div className='modal-dialog modal-dialog-centered' role='document'>
                         <div className={`modal-content ${theme}`}>
                              <div className={`modal-header ${theme}`}>
                                   <nav className='navbar p-0'>
                                        <p
                                             className={`pb-1 modal-tab mr-5 ${
                                                  activeTab === ModalTab.Bookmark ? 'modal-tab-active ' : ''
                                             }${theme}`}
                                             onClick={() => setActiveTab(ModalTab.Bookmark)}>
                                             {`Save to 'My Views'`}
                                        </p>
                                        <p
                                             className={`pb-1 modal-tab ${
                                                  activeTab === ModalTab.Export ? 'modal-tab-active ' : ''
                                             }${theme}`}
                                             onClick={() => setActiveTab(ModalTab.Export)}>
                                             Export to File
                                        </p>
                                   </nav>
                                   <button
                                        type='button'
                                        className={`close p-0 ${theme}`}
                                        aria-label='Close'
                                        onClick={closePopup}>
                                        <span aria-hidden='true'>&times;</span>
                                   </button>
                              </div>
                              {modalBody}
                         </div>
                    </div>
               </div>
          );
     }
}

export default CaptureModal;
