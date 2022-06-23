import React from "react";
// import reactDom from "react-dom";
// import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import M_body from "../../components/main-body/Body";
import Embed from "../../components/main-body/embed/Embed";
import UserAuthentication from "../../components/authentication/userAuthentication";
import "./GB_Home.css";
import { Link } from "react-router-dom";
import Acc_Logo_All_White_RGB from "../../resources/images/GBeacon/Acc_Logo_All_White_RGB.svg";

class GB_Home extends React.Component {
     render() {
          return (
               <React.Fragment>
                    {/* <!-- Main Body --> */}
                    <div id="mainBody">
                         <div id="GBeaconBackground">
                              <img
                                   src={Acc_Logo_All_White_RGB}
                                   class="ACN_tr_logo"
                              />

                              <div>
                                   <div id="MainTitle">
                                        <h3 id="smallWhiteText">
                                             Global Growth Priorities <br />
                                             <l id="bigWhiteText">
                                                  GrowthBeacon
                                             </l>
                                        </h3>
                                        <p id="blueSubtext">
                                             Explore all financials results
                                             about Accenture’s <br /> focus to
                                             next wave of growth.
                                        </p>
                                   </div>

                                   <div className="buttonsPosition">
                                        <Link
                                             id="leftButton"
                                             to={"/GrowthBeacon/Priorities"}
                                             className="L-button"
                                        >
                                             Priorities &nbsp;{" "}
                                             <i class="fas fa-arrow-right"></i>
                                        </Link>

                                        <Link
                                             to={"/GrowthBeacon/Industries"}
                                             className="L-button"
                                        >
                                             Industries &nbsp;{" "}
                                             <i class="fas fa-arrow-right"></i>
                                        </Link>
                                   </div>
                              </div>
                         </div>
                    </div>
                    {/* <!-- End Main Body --> */}

                    {/* <!-- Footer --> */}
                    <div class="footer">
                         {/* <!-- <form class="form-inline my-2 my-lg-0"  style="padding-top: .5%;"> -->
                              
                              <!-- <span data-toggle="modal" data-target="#WNModal" style="margin-left: 10%;">
                                   
                                   <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15.556" height="15.556" viewBox="0 0 15.556 15.556"
                                             style="margin-bottom: 5px;">
                                             <path id="Rectángulo_235" data-name="Rectángulo 235" d="M3,3V8H8V3H3M0,0H11V11H0Z" transform="translate(7.778) rotate(45)"/>
                                        </svg>
                                        Help and Assumptions 
                                   </button>   
                              </span> -->
                                   */}
                         <a
                              id="aFooter"
                              href="mailto:FBM_PA_DASFeedback@accenture.com?subject=Feedback on Growth Beacon"
                         >
                              {/* <!-- type="button" data-tooltip="tooltip" data-toggle="tooltip" data-placement="top" 
                                   title="Email us!" class="nav-link btn btn-light feedback" --> */}
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="16"
                                   height="14"
                                   viewBox="0 0 16 14"
                                   className="iconBump"
                              >
                                   <path
                                        id="Polígono_10"
                                        data-name="Polígono 10"
                                        d="M8,5.039,4.308,11.5h7.384L8,5.039M8,0l8,14H0Z"
                                   />
                              </svg>
                              Give us your feedback
                         </a>
                         {/* <p>
                                   <small>
                                        Copyright 2021 <b>Accenture</b>. All rights reserved. <i>Highly confidential. Not to be distributed further without authorization of the sender.</i>
                                   </small>
                              </p> */}
                    </div>
                    {/* <!-- End Footer --> */}
               </React.Fragment>
          );
     }
}

export default GB_Home;
