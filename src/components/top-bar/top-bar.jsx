import React, { Component } from "react";
// import reactDom from "react-dom";
import "./top-bar.css";
import { Link } from "react-router-dom";
import {
     service,
     factories,
     models,
     IEmbedConfiguration,
     Report,
} from "powerbi-client";
import * as config from "../../Config";

const powerbi = new service.Service(
     factories.hpmFactory,
     factories.wpmpFactory,
     factories.routerFactory
);

class Top_bar extends React.Component {
     render() {
          return (
               <div className="top-bar smooth-nav">
                    {/* <header className="top-bar smooth-nav"> */}
                    <ul>
                         <li id="GBeaconIcon">
                              <Link
                                   to={"/GrowthBeacon/"}
                                   className={"navbar_section selected".concat(
                                        this.props.section === "Home"
                                             ? " "
                                             : " nobar ",
                                        this.props.section
                                   )}
                                   // style={"border: none;"}
                              >
                                   <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22.016"
                                        height="34"
                                        viewBox="0 0 22.016 34"
                                   >
                                        <g
                                             id="Grupo_256"
                                             data-name="Grupo 256"
                                             transform="translate(-84.812 -19.5)"
                                        >
                                             <path
                                                  id="Trazado_105"
                                                  data-name="Trazado 105"
                                                  d="M1069.82,527.74h3l-.68,12.26h16.135l-.68-12.26h3a.641.641,0,0,0,.623-.657v-.742a.641.641,0,0,0-.623-.657H1089.1v-5.74h1.489a.64.64,0,0,0,.623-.657v-.742a.641.641,0,0,0-.623-.657h-2.383v-2.741h2.349a.657.657,0,0,0,.657-.657v-.742a.657.657,0,0,0-.657-.657h-3.308a7.591,7.591,0,0,0-4.949-5.807.176.176,0,0,0-.062-.268l-2.048-1a.174.174,0,0,0-.155,0l-2.048,1a.176.176,0,0,0-.072.254,7.586,7.586,0,0,0-5,5.822h-3.064a.657.657,0,0,0-.657.657v.742a.657.657,0,0,0,.657.657h2.349v2.741h-2.383a.64.64,0,0,0-.623.657v.742a.64.64,0,0,0,.623.657h1.733v5.74h-1.733a.64.64,0,0,0-.623.657v.742A.64.64,0,0,0,1069.82,527.74Zm16.129-7.8h1.365v5.74h-1.365Zm-3.153,0h1.365v5.74H1082.8Zm-3.152,0h1.365v5.74h-1.365Zm-3.152,0h1.365v5.74h-1.365Zm-3.152,0h1.365v5.74h-1.365Z"
                                                  transform="translate(-984.385 -486.5)"
                                             />
                                        </g>
                                   </svg>
                              </Link>
                         </li>

                         <li id="GBPrioritiesB">
                              <Link
                                   id="Link_GBPriorities"
                                   to={"/GrowthBeacon/Priorities"}
                                   className="invisible"
                              ></Link>
                              <button
                                   id="Btn_GBPriorities"
                                   className={
                                        this.props.section === "Priorities"
                                             ? "navbar_section selected"
                                             : "navbar_section"
                                   }
                                   // onClick={() => {
                                   //      document
                                   //           .getElementById(
                                   //                "Link_GBPriorities"
                                   //           )
                                   //           .click();
                                   // }}
                              >
                                   <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                   >
                                        <path
                                             id="Trazado_104"
                                             data-name="Trazado 104"
                                             d="M1284.5,76.232V74.768h-4.609a7.94,7.94,0,0,0-1.8-4.322l3.267-3.267-1.036-1.036-3.266,3.266a7.94,7.94,0,0,0-4.322-1.808V63h-1.465v4.594a7.939,7.939,0,0,0-4.366,1.771l-3.222-3.222-1.036,1.036,3.215,3.215a7.94,7.94,0,0,0-1.846,4.374H1259.5v1.465h4.506a7.94,7.94,0,0,0,1.815,4.411l-2.646,2.645c-.032-.056-.083-.055-.18.041a.817.817,0,0,0-.206.345l-.146.146.112.112a.83.83,0,0,0,.809.809l.115.115.151-.151a.814.814,0,0,0,.338-.2c.1-.1.1-.149.042-.177l2.647-2.647a7.94,7.94,0,0,0,4.411,1.808V88h1.465V83.479a7.94,7.94,0,0,0,4.365-1.846l3.223,3.223,1.036-1.036-3.231-3.231a7.941,7.941,0,0,0,1.771-4.358Zm-6.549-1.465h-2.711a3.356,3.356,0,0,0-.435-1.036l1.915-1.915A6.018,6.018,0,0,1,1277.951,74.768Zm-2.267-3.987-1.914,1.914a3.36,3.36,0,0,0-1.037-.44V69.542A6.019,6.019,0,0,1,1275.684,70.78Zm-4.416-1.251v2.7a3.356,3.356,0,0,0-1.075.425l-1.919-1.919A6.018,6.018,0,0,1,1271.268,69.529Zm-4.041,2.233,1.91,1.91a3.361,3.361,0,0,0-.474,1.1h-2.711A6.022,6.022,0,0,1,1267.227,71.762Zm-1.285,4.47h2.7a3.356,3.356,0,0,0,.461,1.126l-1.914,1.914A6.02,6.02,0,0,1,1265.942,76.232Zm2.287,4.075,1.915-1.915a3.357,3.357,0,0,0,1.125.456v2.7A6.019,6.019,0,0,1,1268.228,80.308Zm4.5,1.231V78.826a3.361,3.361,0,0,0,1.086-.472l1.91,1.91A6.021,6.021,0,0,1,1272.733,81.538Zm4.021-2.32-1.919-1.919a6.393,6.393,0,0,0,.423-1.067h2.7A6.018,6.018,0,0,1,1276.754,79.218Z"
                                             transform="translate(-1259.5 -63)"
                                        />
                                   </svg>
                                   Priorities
                              </button>
                         </li>

                         <li id="GBIndustriesB">
                              <Link
                                   id="Link_GBIndustries"
                                   to={"/GrowthBeacon/Industries"}
                                   className="invisible"
                              ></Link>
                              <button
                                   id="Btn_GBIndustries"
                                   className={
                                        this.props.section === "industries"
                                             ? "navbar_section selected industries"
                                             : "navbar_section"
                                   }
                                   // onClick={() => {
                                   //      document
                                   //           .getElementById(
                                   //                "Link_GBIndustries"
                                   //           )
                                   //           .click();
                                   // }}
                              >
                                   <svg
                                        id="Grupo_281"
                                        data-name="Grupo 281"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                   >
                                        <path
                                             id="Trazado_100"
                                             data-name="Trazado 100"
                                             d="M967.974,486a11,11,0,1,0,11,11A11,11,0,0,0,967.974,486Zm0,19.343A8.343,8.343,0,1,1,976.317,497,8.343,8.343,0,0,1,967.974,505.343Z"
                                             transform="translate(-956.974 -486)"
                                        />
                                        <path
                                             id="Trazado_101"
                                             data-name="Trazado 101"
                                             d="M977.217,486.773a.224.224,0,0,0-.217,0l-12.046,6.687-.04,0-7,12.588a.063.063,0,0,0,0,.063.065.065,0,0,0,.088.025l12.674-7.086v0l6.627-11.969A.223.223,0,0,0,977.217,486.773Zm-9.274,10.852a1.41,1.41,0,1,1,1.411-1.41A1.411,1.411,0,0,1,967.943,497.625Z"
                                             transform="translate(-956.619 -485.717)"
                                        />
                                   </svg>
                                   Industries
                              </button>
                         </li>

                         <li id="GBInfoCenterB" className="last-main">
                              <a href="" className="navbar_section stroke">
                                   <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21"
                                        height="21"
                                        viewBox="0 0 21 21"
                                   >
                                        <g
                                             id="Elipse_27"
                                             data-name="Elipse 27"
                                             fill="none"
                                             stroke-width="3"
                                        >
                                             <circle
                                                  cx="10.5"
                                                  cy="10.5"
                                                  r="10.5"
                                                  stroke="none"
                                             />
                                             <circle
                                                  cx="10.5"
                                                  cy="10.5"
                                                  r="9"
                                                  fill="none"
                                             />
                                        </g>
                                   </svg>
                                   Info Center
                              </a>
                         </li>

                         {/* <!-- <li className="last-main">
                         <a href="Help_Priorities.html" 
                              onclick= 'show("app.powerbi.com/reportEmbed?reportId=46e97962-3e83-4a88-93c3-51093e425779&autoAuth=true&filterPaneEnabled=false&navContentPaneEnabled=false&ctid=e0793d39-0939-496d-b129-198edd916feb&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLW5vcnRoLWNlbnRyYWwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D&pageName=ReportSection638c9f33c2d5831d432d");'
                              className="navbar_section">

                              <svg xmlns="http://www.w3.org/2000/svg" width="15.556" height="15.556" viewBox="0 0 15.556 15.556"
                                        style="margin-bottom: 5px;">
                                        <path id="Rectángulo_235" data-name="Rectángulo 235" d="M3,3V8H8V3H3M0,0H11V11H0Z" transform="translate(7.778) rotate(45)"/>
                              </svg>
                              Help
                         </a>
                    </li> -->*/}

                         {/* <li>
                              <img
                                   id="profileImg"
                                   className="profile-pic"
                              ></img>
                         </li> */}

                         <li id="GBUserB">
                              <div
                                   id="welcome"
                                   className={
                                        this.props.section === "industries"
                                             ? "ac-orange"
                                             : "ac-purple"
                                   }
                              >
                                   Welcome
                              </div>
                         </li>
                    </ul>
                    {/* </header> */}
               </div>
          );
     }

     // getFilters() {
     //      const embedConfiguration = {
     //           type: "report",
     //           tokenType: models.TokenType.Aad,
     //           accessToken,
     //           embedUrl,
     //           id: this.props.report,

     //           // Enable this setting to remove gray shoulders from embedded report
     //           settings: {
     //                panes: {
     //                     filters: {
     //                          visible: true,
     //                     },
     //                     pageNavigation: {
     //                          visible: false,
     //                     },
     //                },
     //           },
     //      };

     //      // Get a reference to the embedded report HTML element
     //      let reportContainer = $("#reportContainer")[0];
     //      let report = powerbi.embed(reportContainer, embedConfiguration);
     // }
}

export default Top_bar;
