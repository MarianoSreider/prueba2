import React from "react";
// import reactDom from "react-dom";
// import "./App.css";

import "../../Embed.css";
import "../../dropdown.css";
import "./modal.css";

class ViewsModal extends React.Component {
     render() {
          return (
               // <React.Fragment>
               <div
                    class="modal fade"
                    //  id="captureModal"
                    id="captureModal"
                    role="dialog"
                    aria-labelledby="capture-btn"
                    aria-hidden="true"
               >
                    <div class="vertical-alignment-helper">
                         <div class="modal-dialog vertical-align-center">
                              <div class="modal-content">
                                   <div class="d-flex flex-row-reverse">
                                        <button
                                             type="button"
                                             id="close-modal-btn"
                                             class="close"
                                             data-dismiss="modal"
                                             aria-label="Close dialog"
                                             onClick={() => {
                                                  let captureDropdown =
                                                       document.getElementById(
                                                            "captureModal"
                                                       );
                                                  if (captureDropdown) {
                                                       captureDropdown.style.display =
                                                            "none";
                                                  }
                                             }}
                                        >
                                             X
                                        </button>
                                   </div>
                                   <div class="modal-header">
                                        <h4
                                             class="modal-title modal-subject"
                                             id="my-modal-label"
                                        >
                                             What would you like to do with this
                                             view?
                                        </h4>
                                   </div>
                                   <div class="modal-body" role="tablist">
                                        <button
                                             role="tab"
                                             id="save-view-btn"
                                             className="btn-modal btn-links btn-active"
                                             aria-controls="save-view-div"
                                             onClick={
                                                  this.handleSave2ViewsClick
                                             }
                                        >
                                             Save to 'My Views'
                                        </button>
                                        <button
                                             role="tab"
                                             id="copy-link-btn"
                                             className="btn-modal btn-links"
                                             aria-controls="capture-view-div"
                                             onClick={this.handleCopyClick}
                                        >
                                             Copy Link
                                        </button>
                                   </div>
                                   <div id="content-div">
                                        <div
                                             role="tabpanel"
                                             id="save-view-div"
                                             aria-labelledby="save-view-btn"
                                        >
                                             <form novalidate>
                                                  <label
                                                       class="view-label"
                                                       for="viewname"
                                                  >
                                                       Enter a name for this
                                                       view:
                                                  </label>
                                                  <input
                                                       type="text"
                                                       class="modal-text"
                                                       id="viewname"
                                                       placeholder="Example: December 2019 Sales Profit"
                                                       required
                                                  />
                                                  <div class="invalid-feedback">
                                                       Please provide a valid
                                                       name
                                                  </div>
                                                  <div id="save-btn-div">
                                                       <button
                                                            id="btn-save2-my-views"
                                                            type="button"
                                                       >
                                                            Save
                                                       </button>
                                                  </div>
                                             </form>
                                        </div>
                                        <div
                                             role="tabpanel"
                                             id="capture-view-div"
                                             aria-labelledby="copy-link-btn"
                                        >
                                             <label class="capture-link-note">
                                                  Use this link to share the
                                                  view with colleagues
                                             </label>
                                             <input
                                                  type="text"
                                                  class="modal-text"
                                                  id="copy-link-text"
                                                  readonly
                                             />
                                             <div
                                                  id="copy-link-success-msg"
                                                  class="invisible"
                                             >
                                                  Copied successfully!
                                             </div>
                                             <div class="capture-btn-div">
                                                  <button
                                                       class="copy-bookmark modal-btn"
                                                       id="btn-copy-link"
                                                  >
                                                       {/* <img role="presentation" id="tick-icon" src="img/tickicon.svg" alt="tickmark"> */}
                                                       <span id="tick-btn">
                                                            Copy
                                                       </span>
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
               // </React.Fragment>
          );
     }

     handleCopyClick() {
          let sctCopy = document.getElementById("copy-link-btn");
          let divCopy = document.getElementById("capture-view-div");
          let sctSave = document.getElementById("save-view-btn");
          let divSave = document.getElementById("save-view-div");
          let copyMsg = document.getElementById("copy-link-success-msg");

          if ((sctCopy != null) & (sctSave != null)) {
               sctCopy.className = "btn-modal btn-links btn-active";
               sctSave.className = "btn-modal btn-links";

               if ((divCopy != null) & (divSave != null) & (copyMsg != null)) {
                    divCopy.style.display = "block";
                    divSave.style.display = "none";
                    copyMsg.style.display = "none";
               }
          }
     }

     handleSave2ViewsClick() {
          let sctCopy = document.getElementById("copy-link-btn");
          let divCopy = document.getElementById("capture-view-div");
          let sctSave = document.getElementById("save-view-btn");
          let divSave = document.getElementById("save-view-div");

          if ((sctCopy != null) & (sctSave != null)) {
               sctCopy.className = "btn-modal btn-links";
               sctSave.className = "btn-modal btn-links btn-active";

               if ((divCopy != null) & (divSave != null)) {
                    divCopy.style.display = "none";
                    divSave.style.display = "block";
               }
          }
     }
}

export default ViewsModal;
