// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { UserAgentApplication, AuthError, AuthResponse } from "msal";
import { service, factories, models, IEmbedConfiguration, Report, VisualDescriptor } from "powerbi-client";
import CaptureModal from "./sub-component/Modal/modal";

// import { PowerBIEmbed, EventHandler } from 'powerbi-client-react';
import "./Embed.css";
import "./dropdown.css"
import "../Body.css";
import * as config from "../../../Config";
import { workspaceId } from '../../../Config';
import { PseudoBigInt } from "typescript";
import ViewsModal from "./sub-component/ViewsModal/viewsModal";

import { Export, ExportProp } from "./sub-component/Export/export";

// import "isomorphic-fetch"; // or import the fetch polyfill you installed
import { Client, ClientOptions, AuthenticationProvider} from "@microsoft/microsoft-graph-client"; // To get profile pics
import { MyAuthenticationProvider } from "../../authentication/AuthProvider";

// import { naigateTo } from "../../navigation/navigation";
import { Bookmark, UpdateApp } from './sub-component/Export/models';

import { buildThemePalette } from "./sub-component/ColorThemes/colorSelector";
import { stringify } from "qs";

const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

// const [isExportInProgress, setIsExportInProgress] = useState<boolean>(false);
// const [error, setError] = useState<string>('');
// const [state, setState] = useState(0);

let accessToken = "";
let embedUrl = "";
let reportContainer: HTMLElement;
let reportRef: React.Ref<HTMLDivElement>;
let loading: JSX.Element;
// let btnGetFilter: HTMLButtonElement;
let btnRef: React.Ref<HTMLButtonElement>;
let EuropebtnRef: React.Ref<HTMLButtonElement>;
let fullSbtnRef: React.Ref<HTMLButtonElement>;
let LayoutbtnRef: React.Ref<HTMLButtonElement>;
let report: Report;
// const navigate = useNavigate();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {
     report:string; workspace:string; page:string;  
     redirectTo?:string; setTargetPath(targetPath:string):any; sendHome():any;
     getTargetPath():string|null;
     setAppliedFilters(appliedFilters:models.ISlicerState[]|null):void;
     getAppliedFilters():models.ISlicerState[]|null;
     // setAppliedFilters={this.props.setAppliedFilters}
     // getAppliedFilters={this.props.getAppliedFilters}

     // isExportInProgress: boolean;
	// setError: { (error: string): void };
	// toggleExportProgressState: { (): void };
	// // selectedBookmark: {(): Promise<Bookmark|null>};
	// updateApp: UpdateApp;
};
interface AppState { accessToken: string; embedUrl: string; error: string[] };

class Embed extends React.Component<AppProps, AppState> {
     
     constructor(props: AppProps) {
          super(props);

          this.state = { accessToken: "", embedUrl: "", error: [] };

          reportRef = React.createRef();
          btnRef = React.createRef();
          EuropebtnRef = React.createRef();
          LayoutbtnRef = React.createRef();
          fullSbtnRef = React.createRef()

          console.log(React.Children.count(this.props.children))
          // Report container
          loading = (
               <React.Fragment>
                    {this.props.children}
                    <div className={!React.Children.count(this.props.children)
                         ?"full-screen"
                         :"main-body"
                         }
                    >
                         <div id="reportEnviroment">
                              <button
                                   id="btnGetFilter"
                                   ref={btnRef}
                                   className="btn btn-action"
                                   // onClick={() => this.getFilters()}
                                   // className="IncBtn"
                              >
                                   Get Filters
                              </button>
                              <button
                                   id="btnSetEurope"
                                   ref={EuropebtnRef}
                                   className="btn btn-action"
                                   // onClick={() => this.getFilters()}
                                   // className="IncBtn"
                              >
                                   Set to Europe
                              </button>
                              
                              <button id="btnFullScreen"
                                   className="btn btn-action"
                                   ref={fullSbtnRef}
                              >
                                   Full Screen
                              </button>

                              <button
                                   id="btnPrint"
                                   className="btn btn-action"
                                   // ref={EuropebtnRef}
                                   // onClick={() => this.getFilters()}
                                   // className="IncBtn"
                              >
                                   Export to PDF
                              </button>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="saved-views-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Saved Views
                                   </button>
                                   <ul className="dropdown-menu checkbox-menu allow-focus" role="menu" 
                                        id="bookmarks-list" aria-labelledby="display-btn"
                                   >
                                        <label className="close-dropdown">
                                             <button id="close-btn" className="close" aria-label="Close bookmarks dropdown">
                                                  X
                                                  {/* <img role="presentation" id="close-list-btn" src="img/cross.svg" alt="Close"> */}
                                             </button>
                                        </label>
                                   </ul>
                              </div>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="capture-views-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Capture Views
                                   </button>
                                   {/* <ul role="menu" className="dropdown-menu checkbox-menu allow-focus" id="capture-list" aria-labelledby="choose-visuals-btn">
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" id="btn-save2-my-views">
                                                  Save to "My views"
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" id="btn-copy-link">
                                                  Copy Link
                                             </button>
                                        </li>

                                   </ul> */}
                                   
                                   {/* <ViewsModal></ViewsModal> */}

                                   
                              </div>

                              <ViewsModal id="captureModal"></ViewsModal>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="choose-visuals-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Choose Visuals
                                   </button>
                                   <ul role="menu" className="dropdown-menu checkbox-menu allow-focus" id="visuals-list" aria-labelledby="choose-layouts-btn"></ul>
                              </div>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="choose-layouts-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Choose Layout
                                   </button>
                                   <ul role="menu" className="dropdown-menu" id="layouts-list" aria-labelledby="choose-layouts-btn">
                                        
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" id="btn-1-col">
                                                  1 Columns
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" id="btn-2-col">
                                                  2 Columns
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" id="btn-3-col">
                                                  3 Columns
                                             </button>
                                        </li>
                                   </ul>
                              </div>
                              <div className="dropdown">
                                   <button
                                        id="btnSetLayout"
                                        ref={LayoutbtnRef}
                                        className="btn btn-action"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                        onClick={() => {
                                             let reportContainer2 = document.getElementById("reportContainer")
                                             if (reportContainer2 != null ){
                                                  reportContainer2.style.height = "90%";
                                             }
                                             // powerbi.reset(reportContainer);
                                             this.render();
                                        }}
                                        // className="IncBtn"
                                   >
                                        Reset Layout
                                   </button>
                              </div>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="choose-color-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Color Palette
                                   </button>
                                   <ul role="menu" className="dropdown-menu" id="color-list" aria-labelledby="choose-layouts-btn">
                                        
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" 
                                                  id="btn-Default-color"
                                             >
                                                  Default
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" 
                                                  id="btn-Divergent-color"
                                             >
                                                  Divergent
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" 
                                                  id="btn-Executive-color"
                                             >
                                                  Executive
                                             </button>
                                        </li>
                                        <li>
                                             <button role="menuitemradio" className="btn-util btn-layout" 
                                                  id="btn-Tidal-color"
                                             >
                                                  Tidal
                                             </button>
                                        </li>
                                   </ul>
                              </div>

                              <div className="dropdown">
                                   <button className="btn btn-action" type="button" id="saveFilters-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        saveFilters
                                   </button>
                                   <button className="btn btn-action" type="button" id="applyFilters-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        applyFilters
                                   </button>

                                   <button className="btn btn-action" type="button" 
                                        id="RepCatalogHome-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                        // onClick={() => {this.navigateTo("/GrowthBeacon")}}
                                   >
                                        Home
                                   </button>
                                   <Link
                                        id="ResetLoginLink"
                                        to="/"
                                        className= "invisible"
                                   ></Link>
                              </div>

                              <div
                                   id="reportContainer"
                                   ref={reportRef} >
                                        
                                   Loading the report...
                              </div>
                              
                              {/* <CaptureModal></CaptureModal> */}
                         </div>
                    </div>
               </React.Fragment>

               
          );

          // if (this.state.error.length) {

          //      // Cleaning the report container contents and rendering the error message in multiple lines
          //      reportContainer.textContent = "";
          //      this.state.error.forEach(line => {
          //           reportContainer.appendChild(document.createTextNode(line));
          //           reportContainer.appendChild(document.createElement("br"));
          //      });
          // }
          // else if (this.state.accessToken !== "" && this.state.embedUrl !== "") {
          //      report = this.initializeEmbed();
          //      this.embedReport(report)
          //      // this.embedReport()
          // }
     }

    // React function
     render(): JSX.Element {
          this.props.setTargetPath(window.location.href);
          console.log(window.location.href)

          if (this.state.error.length) {

               // Cleaning the report container contents and rendering the error message in multiple lines
               reportContainer.textContent = "";
               this.state.error.forEach(line => {
                    reportContainer.appendChild(document.createTextNode(line));
                    reportContainer.appendChild(document.createElement("br"));
               });
          }
          else if (this.state.accessToken !== "" && this.state.embedUrl !== "") {
               
               // this.embedReport(report)
               report = this.initializeEmbed();
               // btnGetFilter.onclick= {() => this.getFilters(report)};
               
               // let domNode = ReactDOM.findDOMNode(btnGetFilter);
               // if(domNode) {
               //      // domNode.addEventListener('click', () => this.getFilters(report));
               //      domNode.addEventListener('click', () => this.getSlicers(report));
               // }
               if (btnRef !== null){
                    let domNode = ReactDOM.findDOMNode(btnRef["current"]);
                    if(domNode) {
                         domNode.addEventListener('click', () => this.getSlicers(report));
                    }
               }

               if (EuropebtnRef !== null){
                    let EdomNode = ReactDOM.findDOMNode(EuropebtnRef["current"]);
                    if(EdomNode) {
                         EdomNode.addEventListener('click', () => this.setMarketUnit(report, "Europe"));
                         // EdomNode.addEventListener('click', () => this.getLayout(report));
                    }
               }

               if (LayoutbtnRef !== null){
                    let LdomNode = ReactDOM.findDOMNode(LayoutbtnRef["current"]);
                    if(LdomNode) {
                         // LdomNode.addEventListener('click', () => this.setLayout(report));
                         // LdomNode.addEventListener('click', () => this.goBackToReport(report));
                    }
               }

               if (fullSbtnRef !== null){
                    let fsdomNode = ReactDOM.findDOMNode(fullSbtnRef["current"]);
                    if(fsdomNode) {
                         fsdomNode.addEventListener('click', () => this.fullScreen(report));
                    }
               }

               
               this.embedReport(report)

               this.setButtons(report)
          }
          
          return loading;
     }

     navigateTo(newPath: string) {
          // let navigate = useNavigate();
          // navigate(newPath);
          // document.getElementById("ResetLoginLink")?.click
          let linkObj = document.getElementById("ResetLoginLink");
          if (linkObj){
               linkObj.setAttribute("to", newPath);

               setTimeout(() =>{
                    if (linkObj) { linkObj.click(); }
               }, 1000);
               // linkObj.click();
          }
          // let linkObj = document.createElement("Link");
          // linkObj.set

          // window.location.href = '/';
     }

     navigateHomeAndBack() {
          // let navigate = useNavigate();
          // navigate(newPath);
          // document.getElementById("ResetLoginLink")?.click

          console.log(this.props.getTargetPath())
          this.props.setTargetPath(window.location.href)
          setTimeout(() =>{
               console.log(this.props.getTargetPath())
               // document.getElementById("LinkEmbedHome")?.click();
               let linkObj = document.getElementById("ResetLoginLink");
               if (linkObj){
                    linkObj.click();
               }
          }, 1000);
          

          // window.location.href = '/';
     }

     initializeEmbed(){
          let pageName = this.props.page;
          let state = window.location.toString().split("?state=")[1]
          if (state == null) {
               state = ""
          }
          if (window.location.toString().split("?page=")[1] == null){
               pageName = this.props.page;
          } else {
               pageName = window.location.toString().split("?page=")[1].split("?state=")[0]
          }
          const embedConfiguration: IEmbedConfiguration = {
               type: "report",
               tokenType: models.TokenType.Aad,
               accessToken,
               embedUrl,
               id: this.props.report,
               pageName: pageName,
               
               // Enable this setting to remove gray shoulders from embedded report
               settings: {
                    background: models.BackgroundType.Transparent,
                    visualRenderedEvents: true,
                    panes: {
                         filters: {
                              visible: true
                         },
                         pageNavigation: {
                              visible: false
                         },
                         bookmarks: {
                              visible: true
                         }
                    }
               },
               bookmark: {
                    state: state
               }              
          };

          // Get a reference to the embedded report HTML element
          // let embedContainer = $('#embedContainer')[0];
          // const report = powerbi.embed(reportContainer, embedConfiguration);
          
          // let report: Report;
          let report1 = powerbi.embed(reportContainer, embedConfiguration) as Report;
          return report1
     }

     async embedReport(report1: Report){

          // let loadedResolve, reportLoaded = new Promise((res, rej) => { loadedResolve = res; });
          // let renderedResolve, reportRendered = new Promise((res, rej) => { renderedResolve = res; });

          
          // const report = powerbi.Repo

          // Clear any other loaded handler events
          report1.off("loaded");
          
          // Triggers when a content schema is successfully loaded
          report1.on("loaded", () => {
               console.log("Report load successful");
               this.setLayoutDropdowns(report1)
               this.setCaptureViews(report1)
               this.setAppliedFilters(report1)

          });

          // Clear any other rendered handler events
          report1.off("rendered");

          // Triggers when a content is successfully embedded in UI
          report1.on("rendered", function () {
               console.log("Report render successful");
          });

          // Clear any other error handler event
          report1.off("error");

          // Below patch of code is for handling errors that occur during embedding
          report1.on("error", function (event) {
               const errorMsg = event.detail;

               // Use errorMsg variable to log error in any destination of choice
               console.error(errorMsg);
          });
          
          // await reportLoaded;

          // Insert here the code you want to run after the report1 is loaded

          // Insert here the code you want to run after the report is rendered

          
          // await reportRendered;
                    
           // report.off removes all event handlers for a specific event
           report1.off("pageChanged");

           // report1.on will add an event listener.
           report1.on("pageChanged", function (event: CustomEvent) {
                
                let page = event.detail.newPage as models.IPage;
                
                console.log("Event - pageChanged:\nPage changed to \"" + page.name + "\" - \"" + page.displayName + "\"");
           });

          //  report1.on("buttonClicked", async () => {
          //      // change URL silently
          //      let newURL = await this.createLink(report1)

          //      let url = (window.location != window.parent.location) ?
          //           document.referrer :
          //           document.location.href;
          //      url = url.split("?")[0]
          //      newURL.replace(url, "")
          //      window.history.pushState("", "", newURL);
          //  })

          //  report1.on("visualClicked", async () => {
          report1.on("visualRendered", async () => {
               // change URL silently 
               let newURL = await this.createLink(report1)

               let url = (window.location != window.parent.location) ?
                    document.referrer :
                    document.location.href;
               url = url.split("?")[0]
               newURL.replace(url, "")
               window.history.pushState("", "", newURL);
           })
           
           // Select Run and change to a different page.
           // You should see an entry in the Log window.
 
           console.log("Select different page to see events in Log window.");


          //  report1.on("buttonClicked", function (event:CustomEvent){
          //      // Get the filters applied to the report.
          //      try {
          //           const filters = report.getFilters();
          //           console.log(filters);
          //      }
          //      catch (errors) {
          //           console.log(errors);
          //      }
          //  });

           
     }
     
     // React function
     componentDidMount(): void {
          this.props.setTargetPath(window.location.href);
          console.log("TARGET PATH:   " + window.location.href);

          
          if (reportRef !== null) {
               reportContainer = reportRef["current"];
          }
          // if (btnRef !== null){
          //      btnGetFilter = btnRef["current"];
          // }

          // User input - null check
          if (config.workspaceId === "" || config.reportId === "") {
               this.setState({ error: ["Please assign values to workspace Id and report Id in Config.ts file"] })
          } else {

               // Authenticate the user and generate the access token
               this.authenticate();
          }

          // this.getFilters()
          
     }

     async setButtons(report1: Report) {
          let btnPrint = document.getElementById("btnPrint")

          // buildThemePalette(report1)

          // const [isExportInProgress, setIsExportInProgress] = useState<boolean>(false);
          // const [error, setError] = useState<string>('');
          // const [state, setState] = useState(0);

          // function toggleExportProgressState() : void {
          //      setIsExportInProgress((prevState) => !prevState);
          // }
          async function getSelectedBookmark(): Promise<Bookmark|null> {
               let bookmarks = await report1.bookmarksManager.getBookmarks()
               let capturedBookmark = await report1.bookmarksManager.capture({ personalizeVisuals: true });
               if (capturedBookmark) {
                    return capturedBookmark;
               }

               return null;
               // capturedBookmark.state
               // return bookmarks.find((bookmark) => {
               //      return bookmark;
               // });
          }
          
          if (btnPrint != null) {
               btnPrint.onclick = () => {
                    try {
                         report1.print();
                         
                         // // report1.
                         // // let exportProp = {
                         // //      isExportInProgress: true,
                         // //      setError: "",
                         // //      toggleExportProgressState: void ,
                         // //      selectedBookmark: Bookmark,
                         // //      updateApp: UpdateApp,
                         // // }
                         // <Export
                         //      // isExportInProgress={isExportInProgress}
                         //      // setError={this.props.setError}
                         //      // toggleExportProgressState={ toggleExportProgressState}
                         //      // selectedBookmark={ () => getSelectedBookmark()}
                         //      // updateApp={setState}
                         //      isExportInProgress={this.props.isExportInProgress}
                         //      setError={this.props.setError}
                         //      toggleExportProgressState={this.props.toggleExportProgressState}
                         //      selectedBookmark={ () => getSelectedBookmark()}
                         //      updateApp={this.props.updateApp}
                         // />
                    }
                    catch (errors) {
                         console.log(errors);
                    }
               }
          }

          function handleSave2ViewsClick() {
               let sctCopy = document.getElementById("copy-link-btn");
               let divCopy = document.getElementById("capture-view-div");
               let sctSave = document.getElementById("save-view-btn");
               let divSave = document.getElementById("save-view-div");
     
               if ((sctCopy != null) && (sctSave != null)) {
                    sctCopy.className = "btn-modal btn-links";
                    sctSave.className = "btn-modal btn-links btn-active";
     
                    if ((divCopy != null) && (divSave != null)) {
                         divCopy.style.display = "none";
                         divSave.style.display = "block";
                    }
               }
          }
          // Dropdowns Management
          // let captureDropdown = document.getElementById("capture-list") 
          let captureDropdown = document.getElementById("captureModal")

          let visualsDropdown = document.getElementById("visuals-list")
          let layoutsDropdown = document.getElementById("layouts-list")
          let bookmarksDropdown = document.getElementById("bookmarks-list")

          let colorsDropdown = document.getElementById("color-list")

          let closeSavedViews = document.getElementById("close-btn")
          if (closeSavedViews != null) {
               closeSavedViews.onclick = () => {
                    if (bookmarksDropdown != null){
                         bookmarksDropdown.style.display = "none";
                    }
               }
          }

          let savedViews = document.getElementById("saved-views-btn")
          if (savedViews != null) {
               savedViews.onclick = () => {
                    if (bookmarksDropdown != null){
                         if (bookmarksDropdown.style.display == "block"){
                              bookmarksDropdown.style.display = "none";
                         } else {
                              
                              bookmarksDropdown.style.display = "block";
                              if (visualsDropdown != null){
                                   visualsDropdown.style.display = "none";
                              }
                              if (layoutsDropdown != null){
                                   layoutsDropdown.style.display = "none";
                              }
                              if (captureDropdown != null){
                                   captureDropdown.style.display = "none";
                              }
                              if (colorsDropdown != null){
                                   colorsDropdown.style.display = "none";
                              }
                         }
                    }
               }
          }
          let captureView = document.getElementById("capture-views-btn")
          if (captureView != null) {
               captureView.onclick = () => {
                    if (captureDropdown != null){
                         if (captureDropdown.style.display == "block"){
                              captureDropdown.style.display = "none";
                         } else {
                              handleSave2ViewsClick()
                              captureDropdown.style.display = "block";
                              if (visualsDropdown != null){
                                   visualsDropdown.style.display = "none";
                              }
                              if (layoutsDropdown != null){
                                   layoutsDropdown.style.display = "none";
                              }
                              if (bookmarksDropdown != null){
                                   bookmarksDropdown.style.display = "none";
                              }
                              if (colorsDropdown != null){
                                   colorsDropdown.style.display = "none";
                              }
                         }
                    }
               }
          }
          let chooseVisuals = document.getElementById("choose-visuals-btn")
          if (chooseVisuals != null) {
               chooseVisuals.onclick = () => {
                    if (visualsDropdown != null){
                         if (visualsDropdown.style.display == "block"){
                              visualsDropdown.style.display = "none";
                         } else {
                              visualsDropdown.style.display = "block";
                              if (layoutsDropdown != null){
                                   layoutsDropdown.style.display = "none";
                              }
                              if (captureDropdown != null){
                                   captureDropdown.style.display = "none";
                              }
                              if (bookmarksDropdown != null){
                                   bookmarksDropdown.style.display = "none";
                              }
                              if (colorsDropdown != null){
                                   colorsDropdown.style.display = "none";
                              }
                         }
                    }
               }
          }

          let chooseLayout = document.getElementById("choose-layouts-btn")
          if (chooseLayout != null) {
               chooseLayout.onclick = () => {
                    if (layoutsDropdown != null){
                         if (layoutsDropdown.style.display == "block"){
                              layoutsDropdown.style.display = "none";
                         } else {
                              
                              layoutsDropdown.style.display = "block";
                              if (visualsDropdown != null){
                                   visualsDropdown.style.display = "none";
                              }
                              if (captureDropdown != null){
                                   captureDropdown.style.display = "none";
                              }
                              if (bookmarksDropdown != null){
                                   bookmarksDropdown.style.display = "none";
                              }
                              if (colorsDropdown != null){
                                   colorsDropdown.style.display = "none";
                              }
                         }
                    }
               }
          }

          let chooseColors = document.getElementById("choose-color-btn")
          if (chooseColors != null) {
               chooseColors.onclick = () => {
                    if (colorsDropdown != null){
                         if (colorsDropdown.style.display == "block"){
                              colorsDropdown.style.display = "none";
                         } else {
                              colorsDropdown.style.display = "block";
                              if (layoutsDropdown != null){
                                   layoutsDropdown.style.display = "none";
                              }
                              if (captureDropdown != null){
                                   captureDropdown.style.display = "none";
                              }
                              if (bookmarksDropdown != null){
                                   bookmarksDropdown.style.display = "none";
                              }
                              if (visualsDropdown != null){
                                   visualsDropdown.style.display = "none";
                              }
                         }
                    }
               }
          }

          let btnApplyFilters = document.getElementById("applyFilters-btn")
          if (btnApplyFilters) {
               btnApplyFilters.onclick = () => {
                    this.setAppliedFilters(report1)
               }
          }

          let btnSaveFilters = document.getElementById("saveFilters-btn")
          if (btnSaveFilters) {
               btnSaveFilters.onclick = () => {
                    this.writeAppliedFilters(report1)
               }
          }

          let btnHome = document.getElementById("RepCatalogHome-btn");
          if (btnHome != null) {
               // btnHome.
               // btnHome
               btnHome.onclick = () => {
                    // console.log(this.props.getTargetPath())
                    // this.props.setTargetPath(window.location.href)
                    // setTimeout(() =>{
                    //      console.log(this.props.getTargetPath())
                    //      // document.getElementById("LinkEmbedHome")?.click();
                    //      this.navigateTo("/")
                    // }, 1000);
                    this.navigateHomeAndBack()
               }
          }


          let btnIndustries = document.getElementById("Btn_GBIndustries");
          if (btnIndustries != null) {
               // btnIndustries.
               // btnIndustries
               btnIndustries.onclick = () => {
                    this.writeAppliedFilters(report1)
                    setTimeout(() =>{
                         document.getElementById("Link_GBIndustries")?.click();
                    }, 1000);
               }
          }

          let btnPriorities = document.getElementById("Btn_GBPriorities");
          if (btnPriorities != null) {
               // btnPriorities.
               // btnPriorities
               btnPriorities.onclick = () => {
                    this.writeAppliedFilters(report1)
                    setTimeout(() =>{
                         document.getElementById("Link_GBPriorities")?.click();
                    }, 1000);
                    
               }
          }

     }

     async createLink(report1:Report):Promise<string> {

          // To get the URL of the parent page
          let url = (window.location != window.parent.location) ?
               document.referrer :
               document.location.href;
          url = url.split("?")[0]
          // Capture the report's current state with personalized visuals
          const capturedBookmark = await report1.bookmarksManager.capture({ personalizeVisuals: true });
     
          // Build bookmark element
          let bookmark = {
               // name: "bookmark_" + bookmarkCounter,
               state: capturedBookmark.state
          }

          const pages = await report1.getPages();
          let page = pages.filter(function (page) {
               return page.isActive;
           })[0];

          let pageName = page.name;
     
          // Build the share bookmark URL
          let shareURL = url + "?page=" + pageName + "?state=" + bookmark.state;

          console.log(shareURL)

          return shareURL;
     }

     async setCaptureViews(report1: Report){
                    
          let captureDropdown = document.getElementById("capture-list")

          let bookmarksList = document.getElementById("bookmarks-list")

          let bookmarkCounter = 1;

          let bookmarks = await report1.bookmarksManager.getBookmarks();

          // Reset next bookmark ID
          let nextBookmarkId = 1;

          // Set bookmarks array to the report's fetched bookmarks
          // bookmarkShowcaseState.bookmarks = bookmarks;

          // Clear visualDropdown div
          if (bookmarksList != null) {
               // bookmarksList.style.display = "none"
               bookmarksList.innerHTML = "";

               // <label className="close-dropdown">
               //      <button id="close-btn" className="close" aria-label="Close bookmarks dropdown">
               //           X
               //      </button>
               // </label>

               let labelElement = document.createElement("label");
               labelElement.setAttribute("className", "close-dropdown");
               // labelElement.setAttribute("role", "menuitem");

               let btnElement = document.createElement("button")
               btnElement.setAttribute("id", "close-btn")
               btnElement.setAttribute("className", "close");
               

               btnElement.onclick = () => {
                    let bookmarksList2 = document.getElementById("bookmarks-list")
                    if (bookmarksList2) {bookmarksList2.style.display = "none" }
               };
               let TitleElement = document.createTextNode("X");
               btnElement.appendChild(TitleElement);
               
               labelElement.appendChild(btnElement)
          
               let spanElement = document.createElement("span");
               spanElement.setAttribute("class", "showcase-checkmark");
               labelElement.appendChild(spanElement);

               bookmarksList.append(labelElement);
          }

          async function onBookmarkClicked(element: HTMLButtonElement) {

               // Set the clicked bookmark as active
               // setBookmarkActive($(element));
               // $("input:checkbox").prop("checked", false);
          
               let entries = document.getElementsByClassName("saved-view-entry")
               for(let i=0; i<entries.length; i++){
                    let btnElement = entries[i];
                    // (btnElement: HTMLButtonElement) => { 
                    btnElement.setAttribute("class", "saved-view-entry");     
                    // }
               }
               
               element.setAttribute("class", "saved-view-entry active")

               let btnElement = document.getElementById(element.id);
               if (btnElement != null) {
                    btnElement.setAttribute("class", "saved-view-entry active")
               }

               // Get bookmark Id from HTML
               const bookmarkId = element.id;
               // bookmarks = await report1.bookmarksManager.getBookmarks();
               // Find the bookmark in the bookmarks array
               // let currentBookmark = getBookmarkByID(bookmarkId);
               let currentBookmark =  bookmarks.filter( function (bookmark) { 
                    return bookmark.name === bookmarkId 
               })[0];

               console.log(currentBookmark)
               
               // Apply the bookmark state
               // if ((currentBookmark != null) && (currentBookmark.state)){
               //      report1.bookmarksManager.applyState(currentBookmark.state);
               //      // console.log(currentBookmark)
               // }
               let state = element.getAttribute("state"); 
               if ((state != null)){
                    report1.bookmarksManager.applyState(state);
                    console.log(state)
                    // console.log(currentBookmark)
               }
               
          }

          // Build the bookmarks list HTML code
          bookmarks.forEach(function (bookmark) {
               
               if (bookmark.state) {
                    let labelElement = document.createElement("label");
                    labelElement.setAttribute("class", "showcase-checkbox-container");
                    labelElement.setAttribute("role", "menuitem");
                    labelElement.setAttribute("id", bookmark.name + "_Label")

                    let btnElement = document.createElement("button")
                    btnElement.setAttribute("id", bookmark.name)
                    btnElement.setAttribute("class", "saved-view-entry");
                    if (bookmark.state){
                         btnElement.setAttribute("state", bookmark.state)
                    }
                    btnElement.onclick = () => {onBookmarkClicked(btnElement);};
                    let TitleElement = document.createTextNode(bookmark.displayName);
                    btnElement.appendChild(TitleElement);
                    
                    labelElement.appendChild(btnElement)

                    let btnDelete = document.createElement("button")
                    btnDelete.setAttribute("id", bookmark.name + "_Delete")
                    btnDelete.setAttribute("class", "delete-entry-btn");
                    // if (bookmark.state){
                    //      btnDelete.setAttribute("state", bookmark.state)
                    // }
                    btnDelete.onclick = () => {
                         let fullElement = document.getElementById(btnDelete.id.replace("Delete", "Label"));
                         fullElement?.remove()
                    };
                    btnDelete.appendChild(document.createTextNode("X"))
                    labelElement.appendChild(btnDelete)
               
                    let spanElement = document.createElement("span");
                    spanElement.setAttribute("class", "showcase-checkmark");
                    labelElement.appendChild(spanElement);

                    if (bookmarksList != null){
                         bookmarksList.append(labelElement);
                    }
               }
               // console.log(bookmark)
          });

          function handleCopyClick() {
               let sctCopy = document.getElementById("copy-link-btn");
               let divCopy = document.getElementById("capture-view-div");
               let sctSave = document.getElementById("save-view-btn");
               let divSave = document.getElementById("save-view-div");
               let copyMsg = document.getElementById("copy-link-success-msg");
     
               if ((sctCopy != null) && (sctSave != null)) {
                    sctCopy.className = "btn-modal btn-links btn-active";
                    sctSave.className = "btn-modal btn-links";
     
                    if ((divCopy != null) && (divSave != null) && (copyMsg != null)) {
                         divCopy.style.display = "block";
                         divSave.style.display = "none";
                         copyMsg.style.display = "none";
                    }
               }
          }

          let createLink = async () => {

               // // To get the URL of the parent page
               // let url = (window.location != window.parent.location) ?
               //      document.referrer :
               //      document.location.href;
          
               // // Capture the report's current state with personalized visuals
               // const capturedBookmark = await report1.bookmarksManager.capture({ personalizeVisuals: true });
          
               // // Build bookmark element
               // let bookmark = {
               //      name: "bookmark_" + bookmarkCounter,
               //      state: capturedBookmark.state
               // }

               // const pages = await report1.getPages();
               // let page = pages.filter(function (page) {
               //      return page.isActive;
               //  })[0];

               // let pageName = page.name;
          
               // Build the share bookmark URL
               let shareUrl = await this.createLink(report1);  // url + "?page=" + pageName + "?state=" + bookmark.state;

               console.log(shareUrl)

               var dummyContent = "this is to be copied to clipboard";
               // var dummy = document.createElement("input")
               // var dummy:HTMLInputElement
               
               var linkInput = document.getElementById("copy-link-text") as HTMLInputElement;
               if ((linkInput != null)){
                    // let linkInput:HTMLInputElement = linkInput
                    linkInput.value = shareUrl
                    linkInput.select()
               }     
          }

          function copyLink() {
               var linkInput = document.getElementById("copy-link-text") as HTMLInputElement;
               if ((linkInput != null)){
                    linkInput.select()
               }
               // appendTo('body').select()
               document.execCommand('copy')
               let copiedMsg = document.getElementById("copy-link-success-msg")
               if ((btnCopyLink != null) && (copiedMsg != null)){ 
                    // btnCopyLink.style.color = "rgba(47, 207, 33)";
                    // btnCopyLink.textContent = "Copied";
                    copiedMsg.style.color = "rgba(47, 207, 33)";
                    copiedMsg.style.display = "block"

               };

               setTimeout(() =>{
                    if ((btnCopyLink != null) && (copiedMsg != null)) { 
                         // btnCopyLink.style.color = "rgba(0, 0, 0)";
                         // btnCopyLink.textContent = "Copy Link";
                         copiedMsg.style.display = "none"
                    };
               }, 5000);
          }
          
          let btnCopySct = document.getElementById("copy-link-btn")
          if (btnCopySct != null) { 
               btnCopySct.onclick = () => {
                    createLink();
                    handleCopyClick()
               }; 
          };

          let btnCopyLink = document.getElementById("btn-copy-link")
          if (btnCopyLink != null) { 
               btnCopyLink.onclick = () => {
                    createLink();
                    copyLink();
               }; 
          };

          async function onBookmarkCaptureClicked() {

               let capturedViewname = (document.getElementById("viewname") as HTMLInputElement);
               if (capturedViewname) {
                    let viewname = capturedViewname.value
                    // viewName.addClass(INVALID_FIELD);
                    if ((viewname == "") || (viewname == "Example: December 2019 Sales Profit")) {
                         viewname = "bookmark_" + bookmarkCounter;
                    }
               //   viewName.removeClass(INVALID_FIELD);
          
                    // Capture the report's current state with personalized visuals
                    const capturedBookmark = await report1.bookmarksManager.capture({ personalizeVisuals: true });
          
                    // Build bookmark element
                    let bookmark = {
                         name: "bookmark_" + bookmarkCounter,
                         displayName: viewname,
                         state: capturedBookmark.state
                    }
                    bookmarkCounter++;
          
                    // Add the new bookmark to the HTML list
                    let labelElement = document.createElement("label");
                    labelElement.setAttribute("class", "showcase-checkbox-container");
                    labelElement.setAttribute("role", "menuitem");
                    labelElement.setAttribute("id", bookmark.name + "_Label")

                    let btnElement = document.createElement("button")
                    btnElement.setAttribute("id", bookmark.name)
                    btnElement.setAttribute("class", "saved-view-entry");
                    if (bookmark.state){
                         btnElement.setAttribute("state", bookmark.state)
                    }
                    btnElement.onclick = () => {onBookmarkClicked(btnElement);};
                    let TitleElement = document.createTextNode(bookmark.displayName);
                    btnElement.appendChild(TitleElement);
                    
                    labelElement.appendChild(btnElement)

                    let btnDelete = document.createElement("button")
                    btnDelete.setAttribute("id", bookmark.name + "_Delete")
                    btnDelete.setAttribute("class", "delete-entry-btn");
                    // if (bookmark.state){
                    //      btnDelete.setAttribute("state", bookmark.state)
                    // }
                    btnDelete.onclick = () => {
                         let fullElement = document.getElementById(btnDelete.id.replace("Delete", "Label"));
                         fullElement?.remove()
                    };
                    btnDelete.appendChild(document.createTextNode("X"))
                    labelElement.appendChild(btnDelete)
               
                    let spanElement = document.createElement("span");
                    spanElement.setAttribute("class", "showcase-checkmark");
                    labelElement.appendChild(spanElement);

                    if (bookmarksList != null){
                         bookmarksList.append(labelElement);
                    }
                    console.log(bookmark)

                    bookmarks = await report1.bookmarksManager.getBookmarks();
                    if (captureDropdown != null) {
                         captureDropdown.style.display = "none";
                    }
                    if (bookmarksList != null) {
                         bookmarksList.style.display = "block";
                    }

                    let modal = document.getElementById("captureModal");
                    if (modal) { modal.style.display = "none" }
                    
                    onBookmarkClicked(btnElement)
               }
                    
          }

          let btnSaveView = document.getElementById("btn-save2-my-views")
          if (btnSaveView != null) { btnSaveView.onclick = () => {onBookmarkCaptureClicked();}; };
          
     }
     
     async setLayoutDropdowns(report1: Report) {
          
          const pages = await report1.getPages();

          
          let visualsDropdown = document.getElementById("visuals-list")

          let layoutsDropdown = document.getElementById("layouts-list")

          // Retrieve the active page.
          let page = pages.filter(function (page) {
              return page.isActive;
          })[0];

          // console.log("CURRENT PAGE")
          // console.log(pages.filter(function (page) {
          //          return page.isActive;
          //      })[0]);
          // console.log("PAGES");
          // console.log(pages);

          // let page = pages[0]
          const visuals = await page.getVisuals();
          
               // Retrieve the target visual.
          let charts = visuals.filter(function (visual) {
          //     return visual.type == "scatterChart";
          return ((visual.type != "textbox") && (visual.type != "slicer") && (visual.type != "actionButton")
               && (visual.type != "basicShape") && (visual.type != "shape") && (visual.type != "card") 
               && (visual.type.substring(0,12) != "ChicletSlicer".substring(0,12)) 
               && (visual.type.substring(0,9) != "FlowVisual".substring(0,9)) 
               && (visual.title !== undefined) );
          });

          let reportVisuals = charts.map(function (visual) {
               return {
               name: visual.name,
               // title: page.displayName + " - " + visual.title,
               title: visual.title,
               checked: true,
               page: page.name
               };
          });

          // for (let i=1; i<pages.length; i++) {
          //      page = pages[i]
          
          //      const visuals = await page.getVisuals();
          
          //      // Retrieve the target visual.
          //      let charts = visuals.filter(function (visual) {
          //           return ((visual.type != "textbox") && (visual.type != "slicer") && (visual.type != "actionButton")
          //                && (visual.type != "basicShape") && (visual.type != "shape") && (visual.type != "card") 
          //                && (visual.type.substring(0,12) != "ChicletSlicer".substring(0,12)) 
          //                && (visual.type.substring(0,9) != "FlowVisual".substring(0,9)) 
          //                && (visual.title !== undefined) 
          //           );
          //      });

          //      let reportVisuals_temp = charts.map(function (visual) {
          //           return {
          //           name: visual.name,
          //           title: page.displayName + " - " + visual.title,
          //           checked: true,
          //           page: page.name
          //           };
          //      });
               
          //      reportVisuals = reportVisuals.concat(reportVisuals_temp)
               

          // }
          
          console.log("REPORT VISUALS")
          console.log(reportVisuals)
          
          //    await createVisualsArray(reportVisuals);
          // Remove all visuals without titles (i.e cards)
          let layoutVisuals = reportVisuals.filter(function (visual) {
               return visual.title !== undefined;
          });
     
          // Clear visualDropdown div
          if (visualsDropdown != null) {
               visualsDropdown.style.display = "none"
               visualsDropdown.innerHTML = "";
          }

          let reportLayouts = [1, 2, 3].map(function (N) {
               return {
                   name: N + " Columns",
                   Ncols: N,
                   checked: false
               };
          });

          reportLayouts[2].checked = true

          let onCheckboxClicked = (checkbox: HTMLInputElement) => {
               let visual = reportVisuals.filter(function (visual) { return  (visual.name === checkbox.value); })[0]
               // let visual2 = jQuery.grep(layoutVisuals, function (visual) { return visual.name === checkbox.value; })[0];
               if (visual.checked === true){
                    visual.checked = false;
               } else {
                    visual.checked = true;
               }
               let Ncols = 1;
               for (let i=0; i<reportLayouts.length; i++){
                    if (reportLayouts[i].checked === true) {Ncols = reportLayouts[i].Ncols;}
               }
               this.renderVisuals(report1, reportVisuals, Ncols);
          };

          // Build checkbox html list and insert the html code to visualDropdown div
          layoutVisuals.forEach(function (visual) {
               if (visualsDropdown != null) {
                    let labelElement = document.createElement("label");
                    labelElement.setAttribute("class", "checkbox-container checked");
                    labelElement.setAttribute("for", "visual_" + visual.name);
                    labelElement.setAttribute("role", "menuitem");

                    let inputElement = document.createElement("input");
                    inputElement.setAttribute("type", "checkbox");
                    inputElement.setAttribute("id", "visual_" + visual.name);
                    inputElement.setAttribute("value", visual.name);
                    // inputElement.setAttribute("onclick", "() => {onCheckboxClicked(report1, , this);}");
                    inputElement.onclick = () => {onCheckboxClicked(inputElement);};
                    inputElement.setAttribute("checked", "true");
                    labelElement.append(inputElement);
                    
                    let spanElement = document.createElement("span");
                    spanElement.setAttribute("class", "checkbox-checkmark");
                    labelElement.append(spanElement);

                    let secondSpanElement = document.createElement("span");
                    secondSpanElement.setAttribute("class", "checkbox-title text-truncate");
                    let checkboxTitleElement = document.createTextNode(visual.title);
                    secondSpanElement.append(checkboxTitleElement);
                    labelElement.append(secondSpanElement);

                    visualsDropdown.append(labelElement);
               }
          });


          let onLayoutClicked = (Ncols: number) => {
               reportLayouts.forEach(function (layout) {
                    if (layout.Ncols != Ncols) {
                         layout.checked = false;
                    } else {
                         layout.checked = true;
                    }
               });
               if (layoutsDropdown != null) {
                    layoutsDropdown.style.display = "none"
                    // layoutsDropdown.innerHTML = "";
               }
               this.renderVisuals(report1, reportVisuals, Ncols);
          };

          // Build checkbox html list and insert the html code to visualDropdown div
          reportLayouts.forEach(function (layout) {
               if (layoutsDropdown != null) {
                    
                    let btnLayout = document.getElementById("btn-" + layout.Ncols + "-col")
                    if (btnLayout != null){
                         btnLayout.onclick = () => {onLayoutClicked(layout.Ncols);};
                    }
               }
          });

     
          // Store the id of the first visual in state
          // firstVisualId = $("input:checkbox")[0].id;
     
          // Render all visuals
          // await renderVisuals();

          // Implement phase embedding to first load the report, arrange the visuals and then render
          report1.render();

          // Phase-embedding
          // Hide the loader
          //    document.getElementById(
          //    $("#overlay").hide();
          //    $("#main-div").children().show();
          console.log("Report render successfully");
     }

     async renderVisuals2(report1: Report, reportVisuals: {name:string, title:string, checked:boolean, page:string}[], Ncols: number) {
          
          try {
               // console.log("Slicers state");
               // Page layout: two visible visuals in fixed position.

               // const pageHeight = 1000;
               const pageWidth = 2000;
               const Lwidth = (pageWidth*0.95)/Ncols;
               const sideTab = (pageWidth*0.05)/Ncols;
               // const N_Rows = Math.ceil(charts.length/Ncols)
               const N_Rows = Math.ceil(reportVisuals.length/Ncols)
               
               // const Lheight = (pageHeight*0.9)/N_Rows
               // const topTab = (pageHeight*0.1)/N_Rows
               
               const Lheight = (Lwidth*0.5)
               const topTab = (sideTab*0.5)
               const pageHeight = topTab*0 + (topTab + Lheight)*N_Rows;

               let reportContainer = document.getElementById("reportContainer")
               if (reportContainer != null ){
                    reportContainer.style.height = ""+ pageHeight*(90/1000) + "%";
               }
               // Define default visual layout: visible in 400x300.
               let defaultLayout = {
                    width: 400,
                    height: 250,
                    displayState: {
                    mode: models.VisualContainerDisplayMode.Hidden
                    }
               };
               // Define page size as custom size: 1000x580.
               let pageSize = {
                    type: models.PageSizeType.Custom,
                    width: pageWidth,
                    height: pageHeight
               };
               
               let pageLayout = {
                    defaultLayout: defaultLayout,
                    visualsLayout: {
                         
                    }
               };
               
               let j = 0;
               // for (var i=0; i<charts.length; i++) {
               for (var i=0; i<reportVisuals.length; i++) {
                    //if ((visuals[i].type != "textbox") && (visuals[i].type != "slicer") && (visuals[i].type != "actionButton")
                    //      && (visuals[i].type != "basicShape") && (visuals[i].type != "shape") && (visuals[i].type != "card")) {
                    if (reportVisuals[i].checked===true) {
                         pageLayout.visualsLayout[reportVisuals[i].name] = {
                              x: (j%Ncols)*Lwidth + (j%Ncols + 1)*sideTab,
                              y: Math.floor(j/Ncols)*Lheight + Math.ceil((j+1)/Ncols)*topTab,
                              height: Lheight,
                              width: Lwidth,
                              displayState: {
                                   mode: models.VisualContainerDisplayMode.Visible
                              }
                         }
                         j++;
                    }

               }
               console.log(pageLayout)

               var reportSection = this.props.page;
               // var reportSection = ;
               let settings = {
                    layoutType: models.LayoutType.Custom,
                    customLayout: {
                         pageSize: pageSize,
                         displayOption: models.DisplayOption.FitToPage,
                         // displayState: {

                         //      // Change the selected visuals display mode to visible
                         //      mode: models.VisualContainerDisplayMode.Visible
                         // },
                         pagesLayout: {
                              // "ReportSection": pageLayout
                              [reportSection]: pageLayout
                         }
                    },
                    panes: {
                         filters: {
                              visible: true
                         },
                         pageNavigation: {
                              visible: false
                         }
                    }
               }
               
               // Update the settings by passing in the new settings you have configured.
               
               await report1.updateSettings(settings);
               console.log("Custom layout applied, to remove custom layout, reload the report using 'Reload' API.");
          }
          catch (error) {
               console.log(error);
          }
          
     }
     
     async renderVisuals(report1: Report, reportVisuals: {name:string, title:string, checked:boolean, page:string}[], Ncols: number) {
          
          try {
               // console.log("Slicers state");
               // Page layout: two visible visuals in fixed position.

               // const pageHeight = 1000;
               const pageWidth = 2000;
               const Lwidth = (pageWidth*0.8)/Ncols;
               const sideTab = (pageWidth*0.2)/Ncols;
               // const N_Rows = Math.ceil(charts.length/Ncols)
               const N_Rows = Math.ceil(reportVisuals.length/Ncols)
               
               // const Lheight = (pageHeight*0.9)/N_Rows
               // const topTab = (pageHeight*0.1)/N_Rows
               
               const Lheight = (Lwidth*0.5)
               const topTab = (sideTab*0.5)
               const pageHeight = topTab*0 + (topTab + Lheight)*N_Rows;
               // const pageHeight = pageWidth/2;

               let reportContainer = document.getElementById("reportContainer")
               if (reportContainer != null ){
                    reportContainer.style.height = ""+ (topTab*0 + (topTab + Lheight)*N_Rows)*(90/1000) + "%";
               }
               // Define default visual layout: visible in 400x300.
               let defaultLayout = {
                    width: 400,
                    height: 250,
                    displayState: {
                    mode: models.VisualContainerDisplayMode.Hidden
                    }
               };
               // Define page size as custom size: 1000x580.
               let pageSize = {
                    type: models.PageSizeType.Custom,
                    width: pageWidth,
                    height: pageHeight
               };
               
               // let pageLayout = {
               //      defaultLayout: defaultLayout,
               //      visualsLayout: {
                         
               //      }
               // };

               let settings = {
                    layoutType: models.LayoutType.Custom,
                    customLayout: {
                         pageSize: pageSize,
                         displayOption: models.DisplayOption.FitToPage,
                         // displayState: {

                         //      // Change the selected visuals display mode to visible
                         //      mode: models.VisualContainerDisplayMode.Visible
                         // },
                         pagesLayout: {
                              // "ReportSection": pageLayout
                              // [reportVisuals[i].page]: {
                              //      defaultLayout: defaultLayout,
                              //      visualsLayout: {
                              //           [reportVisuals[i].name]: {
                              //                x: (j%Ncols)*Lwidth + (j%Ncols + 1)*sideTab,
                              //                y: Math.floor(j/Ncols)*Lheight + Math.ceil((j+1)/Ncols)*topTab,
                              //                height: Lheight,
                              //                width: Lwidth,
                              //                displayState: {
                              //                     mode: models.VisualContainerDisplayMode.Visible
                              //                }
                              //           }
                         
                              //      }
                              // }
                         }
                    },
                    panes: {
                         filters: {
                              visible: true
                         },
                         pageNavigation: {
                              visible: false
                         }
                    }
               }
               
               
               let j = 0;
               // for (var i=0; i<charts.length; i++) {
               for (var i=0; i<reportVisuals.length; i++) {
                    //if ((visuals[i].type != "textbox") && (visuals[i].type != "slicer") && (visuals[i].type != "actionButton")
                    //      && (visuals[i].type != "basicShape") && (visuals[i].type != "shape") && (visuals[i].type != "card")) {
                    if (reportVisuals[i].checked===true) {
                         if (settings.customLayout.pagesLayout.hasOwnProperty(reportVisuals[i].page) === false){
                              settings.customLayout.pagesLayout[reportVisuals[i].page] = {
                                   defaultLayout: defaultLayout,
                                   visualsLayout: {
                                        [reportVisuals[i].name]: {
                                             x: (j%Ncols)*Lwidth + (j%Ncols + 1)*sideTab,
                                             y: Math.floor(j/Ncols)*Lheight + (Math.ceil((j+1)/Ncols)-1)*topTab,
                                             height: Lheight,
                                             width: Lwidth,
                                             displayState: {
                                                  mode: models.VisualContainerDisplayMode.Visible
                                             }
                                        }
                         
                                   }
                              }
                         } else {
                              
                              settings.customLayout.pagesLayout[reportVisuals[i].page].visualsLayout[reportVisuals[i].name] = {
                                   x: (j%Ncols)*Lwidth + (j%Ncols + 1)*sideTab,
                                   y: Math.floor(j/Ncols)*Lheight + (Math.ceil((j+1)/Ncols)-1)*topTab,
                                   height: Lheight,
                                   width: Lwidth,
                                   displayState: {
                                        mode: models.VisualContainerDisplayMode.Visible
                                   }
                              }
                         }
                         
                         j++;
                    }

               }
               console.log(settings)

               var reportSection = this.props.page;
               // var reportSection = ;
               
               // Update the settings by passing in the new settings you have configured.
               
               await report1.updateSettings(settings);
               console.log("Custom layout applied, to remove custom layout, reload the report using 'Reload' API.");
          }
          catch (error) {
               console.log(error);
          }
          
     }

     async getLayout(report1: Report){
          // Retrieve the page collection and check if the first page has a MobilePortrait layout.
          try {
               const pages = await report1.getPages();
               const hasLayout = await pages[0].hasLayout(models.LayoutType.MobilePortrait);
          
               let hasLayoutText = hasLayout ? "has" : "doesn't have";
               console.log("Page \"" + pages[0].name + "\" " + hasLayoutText + " mobile portrait layout.");
          }
          catch (errors) {
               console.log(errors);
          }
     }

     async setLayout(report1: Report) {
          // Define default visual layout: visible in 400x300.
          let defaultLayout = {
               width: 400,
               height: 250,
               displayState: {
               mode: models.VisualContainerDisplayMode.Hidden
               }
          };
          const pageHeight = 1000;
          const pageWidth = 2000;
          // Define page size as custom size: 1000x580.
          let pageSize = {
               type: models.PageSizeType.Custom,
               width: pageWidth,
               height: pageHeight
          };
          try {
               const pages = await report1.getPages();
           
               // // Retrieve the active page.
               let pageWithSlicer = pages.filter(function (page) {
                   return page.isActive;
               })[0];
           
               const visuals = await pageWithSlicer.getVisuals();
           
               // Retrieve the target visual.
               let charts = visuals.filter(function (visual) {
               //     return visual.type == "scatterChart";
                   return ((visual.type != "textbox") && (visual.type != "slicer") && (visual.type != "actionButton")
                    && (visual.type != "basicShape") && (visual.type != "shape") && (visual.type != "card") 
                    && (visual.type.substring(0,12) != "ChicletSlicer".substring(0,12)) 
                    && (visual.type.substring(0,9) != "FlowVisual".substring(0,9)) );
               });
               
               // console.log("Slicers state");
               // Page layout: two visible visuals in fixed position.
               
               let pageLayout = {
                    defaultLayout: defaultLayout,
                    visualsLayout: {
                         // [visuals[3].name]: {
                         // // '4138df0f38230daa6720': {
                         //      x: 50,
                         //      y: 100,
                         //      height: 100,
                         //      width: 200,
                         //      displayState: {
                         //           mode: models.VisualContainerDisplayMode.Visible
                         //      }
                         // },
                         // [visuals[4].name]: {
                         // // '741416d34971317932ec': {
                         //      x: 540,
                         //      y: 100,
                         //      // height: 500,
                         //      // width: 500,
                         //      displayState: {
                         //          mode: models.VisualContainerDisplayMode.Visible
                         //      }
                         // },
                    }
               };
               
               const Lwidth = (pageWidth*0.8)/3;
               const sideTab = (pageWidth*0.2)/3;
               const N_Rows = Math.ceil(charts.length/3)
               const Lheight = (pageHeight*0.9)/N_Rows
               const topTab = (pageHeight*0.1)/N_Rows
               let j = 0;
               for (var i=0; i<charts.length; i++) {
                    // if ((visuals[i].type != "textbox") && (visuals[i].type != "slicer") && (visuals[i].type != "actionButton")
                    //      && (visuals[i].type != "basicShape") && (visuals[i].type != "shape") && (visuals[i].type != "card")) {
                         
                         pageLayout.visualsLayout[charts[i].name] = {
                              x: (j%3)*Lwidth + (j%3 + 1)*sideTab,
                              y: Math.floor(j/3)*Lheight + Math.ceil((j+1)/3)*topTab,
                              height: Lheight,
                              width: Lwidth,
                              displayState: {
                                   mode: models.VisualContainerDisplayMode.Visible
                              }
                         }
                         j++;
                    // }

               }
               console.log(pageLayout)

               var reportSection = this.props.page;
               let settings = {
                    layoutType: models.LayoutType.Custom,
                    customLayout: {
                         pageSize: pageSize,
                         displayOption: models.DisplayOption.FitToPage,
                         // displayState: {

                         //      // Change the selected visuals display mode to visible
                         //      mode: models.VisualContainerDisplayMode.Visible
                         // },
                         pagesLayout: {
                              // "ReportSection": pageLayout
                              [reportSection]: pageLayout
                         }
                    },
                    panes: {
                         filters: {
                              visible: true
                         },
                         pageNavigation: {
                              visible: false
                         }
                    }
               }
               
               // Update the settings by passing in the new settings you have configured.
               
               await report1.updateSettings(settings);
               console.log("Custom layout applied, to remove custom layout, reload the report using 'Reload' API.");
          }
          catch (error) {
               console.log(error);
          }
          
     }

     async goBackToReport(report1: Report) {
          // Define default visual layout: visible in 400x300.
          
          try {

               var reportSection = this.props.page;
               let settings = {
                    layoutType: models.LayoutType.MobileLandscape,
                    
                    panes: {
                         filters: {
                              visible: true
                         },
                         pageNavigation: {
                              visible: false
                         }
                    }
               }
               
               // Update the settings by passing in the new settings you have configured.
               
               await report1.updateSettings(settings);
               console.log("Custom layout applied, to remove custom layout, reload the report using 'Reload' API.");
          }
          catch (error) {
               console.log(error);
          }
          
     }

     getFilters(report1: Report){
          // Get the filters applied to the report1.
          try {
               const filters = report1.getFilters();
               console.log(filters);
          }
          catch (errors) {
               console.log(errors);
          }
 
     }

     async getSlicers(report1: Report){
          try {
               const pages = await report1.getPages();
           
               // Retrieve the active page.
               let pageWithSlicer = pages.filter(function (page) {
                   return page.isActive;
               })[0];
           
               const visuals = await pageWithSlicer.getVisuals();
           
               // Retrieve the target visual.
               let slicers = visuals.filter(function (visual) {
                   return visual.type === "slicer";
               });
               
               // // Get the slicer state
               // const state = await slicers.getSlicerState();
               // console.log(state);

               // for (const slicer in slicers){
               //      // Get the slicer state
               //      const state = await slicer.getSlicerState();
               //      console.log(state);
               // }
               console.log("Slicers state");
               for (var i = 0; i < slicers.length; i++){
                    // Get the slicer state
                    const name = await slicers[i].name ;
                    const slType = await slicers[i].type ;
                    // console.log(name);
                    const state = await slicers[i].getSlicerState();
                    console.log([name, slType, state]);
               }

               // for (var i = 0; i < visuals.length; i++){
               //      // Get the slicer state
               //      const name = await visuals[i].title ;
               //      const slid = await visuals[i].name ;
               //      const slType = await visuals[i].type ;
               //      // console.log(name);
               //      console.log([name, slType, slid]);
               // }
           }
           catch (errors) {
               console.log("failed getSlicer");
               console.log(errors);
           }
           
     }

     async setMarketUnit(report1: Report, MarketUnit: string){
          
          // Retrieve the page collection and get the visuals for the active page.
          try {
               const pages = await report.getPages();
               
               // Retrieve the active page.
               let page = pages.filter(function (page) {
                    return page.isActive;
               })[0];
               
               const visuals = await page.getVisuals();
               
               // Retrieve the target visual.
               let slicers = visuals.filter(function (visual) {
                    return (visual.type === "slicer"  
                         // && visual.name === "VisualContainer7"
                    );
               });

               let pMarketTarget = {table: 'Conn_MU', column: 'Market'} as models.SlicerTarget;
               
               let iMarketTarget = {table: 'Conn_market unit', column: 'Market'} as models.SlicerTarget;

               // let slcMarket = slicers[0] 
               let slcMarket = null as unknown as VisualDescriptor

               for (let i=0; i<slicers.length; i++) {
                    let slicer = slicers[i]
                    let state = await slicer.getSlicerState()
                    if (state.targets) {
                         let target = state.targets[0]
                         if (target["column"]){
                              // console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                              //      iMarketTarget["column"])
                              // return (((target.table === pMarketTarget.table )
                              //      && (target["column"] === pMarketTarget["column"]) ) 
                              //      || ((target.table === iMarketTarget.table )
                              //      && (target["column"] === iMarketTarget["column"]) ))
                              
                              if ((target["column"] == pMarketTarget["column"]) 
                                   || (target["column"] == iMarketTarget["column"]) )
                              {
                                   console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                                        iMarketTarget["column"])
                                   
                                   slcMarket = slicer
                              }
                         }
                    }
               };
               // );

               if (slcMarket == (null as unknown as VisualDescriptor)){
                    console.log("MarketUnit Slicer not found")
               } else {
                    let state = await slcMarket.getSlicerState()
                    let target = pMarketTarget
                    if (state.targets){ target = state.targets[0] }

                    const slicerFilter = {
                         $schema: "http://powerbi.com/product/schema#basic",
                         target: target,
                         operator: "In",
                         values: [MarketUnit],
                         filterType: models.FilterType.Basic
                    } as models.ISlicerFilter;

                    state.filters[0] = slicerFilter
                    console.log(state)
                    // Set the slicer state which contains the slicer filters.
                    await slcMarket.setSlicerState(state);
                    // await slicer.setFilters(slicerFilter)
                    console.log("slicer was set.");

                    // slcMarket.
               }

          } catch (errors) {
               console.log(errors);
          }   
     }

     async writeAppliedFilters(report1: Report){
          
          // Only MarketUnit for now
          try {
               const pages = await report.getPages();
               
               // Retrieve the active page.
               let page = pages.filter(function (page) {
                    return page.isActive;
               })[0];
               
               const visuals = await page.getVisuals();
               
               // Retrieve the target visual.
               let slicers = visuals.filter(function (visual) {
                    return (visual.type === "slicer"  
                         // && visual.name === "VisualContainer7"
                    );
               });

               const pMarketTarget = {table: 'Conn_MU', column: 'Market'} as models.SlicerTarget;
               
               const iMarketTarget = {table: 'Conn_market unit', column: 'Market'} as models.SlicerTarget;

               const iServices = {table: 'Conn_service groups', column: 'Service Dimension'} as models.SlicerTarget;
               
               const pServices = {table: 'Connector_SG', column: 'SG'} as models.SlicerTarget;
               
               const p2Services = {table: 'Connector_SG', column: 'SERVICE DIMENSION'} as models.SlicerTarget;

               // let slcMarket = slicers[0] 
               let slcMarket = null as unknown as VisualDescriptor;
               let slcServices = null as unknown as VisualDescriptor;

               for (let i=0; i<slicers.length; i++) {
                    let slicer = slicers[i]
                    let state = await slicer.getSlicerState()
                    if (state.targets) {
                         let target = state.targets[0]
                         if (target["column"]){
                              // console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                              //      iMarketTarget["column"])
                              // return (((target.table === pMarketTarget.table )
                              //      && (target["column"] === pMarketTarget["column"]) ) 
                              //      || ((target.table === iMarketTarget.table )
                              //      && (target["column"] === iMarketTarget["column"]) ))
                              
                              if ((target["column"] == pMarketTarget["column"]) 
                                   || (target["column"] == iMarketTarget["column"]) )
                              {
                                   console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                                        iMarketTarget["column"])
                                   
                                   slcMarket = slicer
                              }
                              if ((target["column"] == pServices["column"]) 
                                   || (target["column"] == iServices["column"]) )
                              {
                                   console.log(target["column"] + " === " + pServices["column"] + " or " + 
                                        iServices["column"])
                                   
                                   slcServices = slicer
                              }
                         }
                    }
               };
               // );

               if (slcMarket == (null as unknown as VisualDescriptor)){
                    console.log("MarketUnit Slicer not found")
                    if (slcMarket != (null as unknown as VisualDescriptor)){
                         let oldAppliedFilters = this.props.getAppliedFilters();
                         console.log("Old one:")
                         console.log(oldAppliedFilters)
                         let stateService = await slcServices.getSlicerState()
                         this.props.setAppliedFilters([stateService])
                         console.log("Applied:")
                         console.log(stateService)
                    }
               } else {
                    let oldAppliedFilters = this.props.getAppliedFilters();
                    console.log("Old one:")
                    console.log(oldAppliedFilters)

                    let stateMarket = await slcMarket.getSlicerState()

                    if (slcServices != (null as unknown as VisualDescriptor)){
                         let stateService = await slcServices.getSlicerState()
                         this.props.setAppliedFilters([stateMarket, stateService])
                         console.log("Applied:")
                         console.log([stateMarket, stateService])
                    } else {
                         this.props.setAppliedFilters([stateMarket])
                         console.log("Applied:")
                         console.log(stateMarket)
                    }

                    console.log("Read:")
                    let appliedFilters = this.props.getAppliedFilters();
                    console.log(appliedFilters)
                    
                    // slcMarket.
               }

          } catch (errors) {
               console.log(errors);
          }   
     }

     async setAppliedFilters(report1: Report){
          
          // if possiible, it will apply filters saved in appliedFilters to the current report
          let oldAppliedFilters = this.props.getAppliedFilters()
          if (oldAppliedFilters === null) { 
               console.log("ERROR:    appliedFilters === null")
               return; 
          }

          console.log("appliedFilters: ")
          console.log(oldAppliedFilters)

          const pMarketTarget = {table: 'Conn_MU', column: 'Market'} as models.SlicerTarget;
               
          const iMarketTarget = {table: 'Conn_market unit', column: 'Market'} as models.SlicerTarget;

          const iServices = {table: 'Conn_service groups', column: 'Service Dimension'} as models.SlicerTarget;
          
          const pServices = {table: 'Connector_SG', column: 'SG'} as models.SlicerTarget;

          const p2Services = {table: 'Connector_SG', column: 'SERVICE DIMENSION'} as models.SlicerTarget;


          try {
               
               let stateMarket = null as unknown as models.ISlicerState;
               let stateService = null as unknown as models.ISlicerState;
               
               for (let i=0; i<oldAppliedFilters.length; i++) {
                    let state = oldAppliedFilters[i]
                    if (state.targets) {
                         let target = state.targets[0]
                         if (target["column"]){
                              // console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                              //      iMarketTarget["column"])
                              // return (((target.table === pMarketTarget.table )
                              //      && (target["column"] === pMarketTarget["column"]) ) 
                              //      || ((target.table === iMarketTarget.table )
                              //      && (target["column"] === iMarketTarget["column"]) ))
                              
                              if ((target["column"] == pMarketTarget["column"]) 
                                   || (target["column"] == iMarketTarget["column"]) )
                              {
                                   console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                                        iMarketTarget["column"])
                                   
                                        stateMarket = state
                              }

                              if ((target["column"] == pServices["column"]) 
                                   // || (target["column"] == iServices["column"]) 
                              ){
                                   console.log(target["column"] + " === " + pServices["column"] + " or " + 
                                        iServices["column"])
                                   
                                        stateService = state
                              }

                              if ((target["column"] == iServices["column"]) )
                              {
                                   console.log(target["column"] + " === " + pServices["column"] + " or " + 
                                        iServices["column"])
                                   
                                        stateService = state
                              }
                         }
                    }
               };
               if ((stateMarket===(null as unknown as models.ISlicerState)) && (stateService===(null as unknown as models.ISlicerState))) {
                    console.log("ERROR:    state===(null as unknown as models.ISlicerState)")
                    return;
               }

               const pages = await report.getPages();
               
               // Retrieve the active page.
               let page = pages.filter(function (page) {
                    return page.isActive;
               })[0];
               
               const visuals = await page.getVisuals();
               
               // Retrieve the target visual.
               let slicers = visuals.filter(function (visual) {
                    return (visual.type === "slicer"  
                         // && visual.name === "VisualContainer7"
                    );
               });

               // let slcMarket = slicers[0] 
               let slcMarket = null as unknown as VisualDescriptor
               let slcService = null as unknown as VisualDescriptor

               for (let i=0; i<slicers.length; i++) {
                    let slicer = slicers[i]
                    let state = await slicer.getSlicerState()
                    if (state.targets) {
                         let target = state.targets[0]
                         if (target["column"]){
                              // console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                              //      iMarketTarget["column"])
                              // return (((target.table === pMarketTarget.table )
                              //      && (target["column"] === pMarketTarget["column"]) ) 
                              //      || ((target.table === iMarketTarget.table )
                              //      && (target["column"] === iMarketTarget["column"]) ))
                              
                              if ((target["column"] == pMarketTarget["column"]) 
                                   || (target["column"] == iMarketTarget["column"]) )
                              {
                                   console.log(target["table"] + " vs " + state.targets[0]["table"])
                                   console.log(target["column"] + " === " + pMarketTarget["column"] + " or " + 
                                        iMarketTarget["column"])
                                   
                                   slcMarket = slicer
                              }
                              if ((target["column"] == pServices["column"]) 
                                   // || (target["column"] == iServices["column"]) 
                              ){
                                   console.log(target["table"] + " vs " + state.targets[0]["table"])
                                   console.log(target["column"] + " === " + pServices["column"] + " or " + 
                                        iServices["column"])
                                   
                                   slcService = slicer
                              }
                              if ((target["column"] == iServices["column"]) 
                              ){
                                   console.log(target["table"] + " vs " + state.targets[0]["table"])
                                   console.log(target["column"] + " === " + pServices["column"] + " or " + 
                                        iServices["column"])
                                   
                                   slcService = slicer
                              }
                         }
                    }
               };
               // );

               if ((slcMarket == (null as unknown as VisualDescriptor)) && (slcService == (null as unknown as VisualDescriptor))){
                    console.log("state Slicers not found")
               } else {

                    let slcStateMarket = await slcMarket.getSlicerState()
                    if (slcStateMarket.targets==null) {
                         console.log("ERROR:    slcState.targets==null")
                         // return;
                    } else { 
                         if (slcStateMarket.targets[0]["table"]==null){
                              console.log("ERROR:    slcState.targets[table]==null")
                              // return; 
                         }
                    }

                    let slcStateService = await slcService.getSlicerState()
                    if (slcStateService.targets==null) {
                         console.log("ERROR:    slcStateService.targets==null")
                         // return;
                    } else { 
                         if (slcStateService.targets[0]["table"]==null){
                              console.log("ERROR:    slcStateService.targets[table]==null")
                              // return; 
                         }
                    }
                    // console.log("typeof(stateMarket.filters[0].target) = " + typeof(stateMarket.filters[0].target))
                    // if (typeof(stateMarket.filters[0].target)==)
                    let i=0;
                    if (slcStateMarket.targets!=null) {
                         if ((slcMarket !== (null as unknown as VisualDescriptor)) && (slcStateMarket.targets[0]["table"]!=null)){
                              if (stateMarket.filters[0]) {
                                   if (stateMarket.filters[0].target[0]==null) {
                                        console.log("stateMarket.filters[0].target[0]==null")
                                        stateMarket.filters[0].target["table"] = slcStateMarket.targets[0]["table"];
                                   } else {
                                        while (stateMarket.filters[0].target[i]!=null){
                                        // for (let i=0; i<stateMarket.filters[0].target.length; i++){
                                             console.log("stateMarket.filters[0].target[" + i + "]!=null")
                                             stateMarket.filters[0].target[i]["table"] = slcStateMarket.targets[0]["table"];
                                             i++;
                                        }
                                        console.log("length(stateMarket.filters[0].target) = " + i)
                                   }
                              }
                              console.log(stateMarket)
                              // Set the slicer state which contains the slicer filters.
                              await slcMarket.setSlicerState(stateMarket);
                              // await slicer.setFilters(slicerFilter)
                              console.log("Market slicer was set.");
                         }
                    }
                    i=0
                    if (slcStateService.targets!=null) {
                         if ((slcService !== (null as unknown as VisualDescriptor)) && (slcStateService.targets[0]["table"]!=null)){
                              if (stateService.filters[0].target[0]==null) {
                                   console.log("stateService.filters[0].target[0]==null")
                                   // stateService.filters[0].target["column"] = slcStateService.targets[0]["column"];
                                   stateService.filters[0].target["table"] = slcStateService.targets[0]["table"];
                              } else {
                                   while (stateService.filters[0].target[i]!=null){
                                   // for (let i=0; i<stateService.filters[0].target.length; i++){
                                        console.log("stateService.filters[0].target[" + i + "]!=null")
                                        stateService.filters[0].target[i]["table"] = slcStateService.targets[0]["table"];
                                        // stateService.filters[0].target[i]["column"] = slcStateService.targets[0]["column"];
                                        i++;
                                   }
                                   console.log("length(stateService.filters[0].target) = " + i)
                              }
                              console.log(stateService)
                              // Set the slicer state which contains the slicer filters.
                              await slcService.setSlicerState(stateService);
                              // await slicer.setFilters(slicerFilter)
                              console.log("Service slicer was set.");
                         }
                    }
                    
               }

          } catch (errors) {
               console.log(errors);
          }   
     }

     fullScreen(report1: Report){
          // Displays the report in full screen mode.
          // report.exitFullscreen();
          try{
               report1.fullscreen();
          }
          catch (errors) {
               console.log(errors);
          }
     }

     setFilters(){
          
     }
    // React function
     componentWillUnmount(): void {

          // try {
          //      const filters = report.getFilters();
          //      console.log(filters);
          // }
          // catch (errors) {
          //      console.log(errors);
          // }
          powerbi.reset(reportContainer);
     }

    // Authenticating to get the access token
     authenticate(): void {

          // this.props.setTargetPath(window.location.href);

          const thisObj = this;

          const msalConfig = {
               auth: {
                    clientId: config.clientId,
                    authority: "https://login.microsoftonline.com/" + config.tenantId,
               }
          };

          const loginRequest = {
               scopes: config.scopes
          };

          const msalInstance: UserAgentApplication = new UserAgentApplication(msalConfig);

          // let clientOptions: ClientOptions = {
          //      authProvider: ,
          // };
          // const client = Client.initWithMiddleware(clientOptions);

          const options: ClientOptions = {
               authProvider: new MyAuthenticationProvider(),
          };
          
          const client = Client.initWithMiddleware(options);
          // const client = Client.init();

          async function updateProfilePicture (): Promise<void> {
               console.log("Succesful updateProfilePicture 0/4")
               // try {
               //      // let response = await client.api("/me/photo/$value").get();
               //      console.log("Succesful updateProfilePicture 1/4")
               //      let response = await client.api("/me").get();
               //      console.log("Succesful updateProfilePicture 2/4")
               //           // Assuming that profileImg is the image tag in which you want to render your profile image
               //      const profilePic = document.getElementById("profileImg");

               //      if (profilePic!== null){
               //           console.log("Succesful updateProfilePicture 3/4")
               //           profilePic.setAttribute("url", URL.createObjectURL(await response));
               //           console.log("Succesful updateProfilePicture 4/4")
               //      }
               // } catch (error) {
               //      console.error(error);
               //      console.log("Failed updateProfilePicture");
               // }
          }
          
          function successCallback(response: AuthResponse): void {
               if (response.tokenType === "id_token") {
                    thisObj.authenticate();

               } else if (response.tokenType === "access_token") {

                    accessToken = response.accessToken;
                    thisObj.setUsername(response.account.name);
                    updateProfilePicture();
               
                    // Refresh User Permissions
                    thisObj.tryRefreshUserPermissions();
                    thisObj.getembedUrl();
                    

                    // thisObj.setReportPage();

               } else {

                    thisObj.setState({ error: [("Token type is: " + response.tokenType)] });
               }
          }

          function failCallBack(error: AuthError): void {
               thisObj.setState({ error: ["Redirect error: " + error] });
          }

          // function sendHome(): void{
          //      let navigate = useNavigate();
          //      navigate('/')
          // }

          msalInstance.handleRedirectCallback(successCallback, failCallBack);

          // check if there is a cached user
          if (msalInstance.getAccount()) {

               // get access token silently from cached id-token
               msalInstance.acquireTokenSilent(loginRequest)
                    .then((response: AuthResponse) => {

                         // get access token from response: response.accessToken
                         accessToken = response.accessToken;
                         this.setUsername(response.account.name);
                         updateProfilePicture()
                         // this.setUserPic(response.account.);
                         this.getembedUrl();
                    })
                    .catch((err: AuthError) => {

                         // refresh access token silently from cached id-token
                         // makes the call to handleredirectcallback
                         if (err.name === "InteractionRequiredAuthError") {
                              msalInstance.acquireTokenRedirect(loginRequest);
                         }
                         else {
                              if (window.location.pathname === "/"){
                                   thisObj.setState({ error: [err.toString()] })
                              } else{

                                   this.props.setTargetPath(window.location.href);
                                   // window.location.href = '/';
                                   // window.history.pushState("", "", "/");
                                   // this.props.sendHome();
                                   // this.navigateTo("/");
                                   this.navigateHomeAndBack()
                                   
                              }
                         }
                    });
          } else {

               // user is not logged in or cached, you will need to log them in to acquire a token
               if (window.location.pathname === "/"){
                    msalInstance.loginRedirect(loginRequest);
               } else{
                    
                    this.props.setTargetPath(window.location.href);

                    // window.location.href = '/';
                    
                    // window.history.pushState("", "", "/");
                    // this.props.sendHome();
                    // this.navigateTo("/");
                    this.navigateHomeAndBack()

                    
               }

          }
     }

    // Power BI REST API call to refresh User Permissions in Power BI
    // Refreshes user permissions and makes sure the user permissions are fully updated
    // https://docs.microsoft.com/rest/api/power-bi/users/refreshuserpermissions
     tryRefreshUserPermissions(): void {
          fetch("https://api.powerbi.com/v1.0/myorg/RefreshUserPermissions", {
               headers: {
                    "Authorization": "Bearer " + accessToken
               },
               method: "POST"
          })
          .then(function (response) {
               if (response.ok) {
                    console.log("User permissions refreshed successfully.");
               } else {
                    // Too many requests in one hour will cause the API to fail
                    if (response.status === 429) {
                         console.error("Permissions refresh will be available in up to an hour.");
                    } else {
                         console.error(response);
                    }
               }
          })
          .catch(function (error) {
               console.error("Failure in making API call." + error);
          });
     }

    // Power BI REST API call to get the embed URL of the report
     getembedUrl(): void {
          const thisObj: this = this;

          fetch("https://api.powerbi.com/v1.0/myorg/groups/" + this.props.workspace + "/reports/" + this.props.report, {
               headers: {
                    "Authorization": "Bearer " + accessToken
               },
               method: "GET"
          })
               .then(function (response) {
                    const errorMessage: string[] = [];
                    errorMessage.push("Error occurred while fetching the embed URL of the report")
                    errorMessage.push("Request Id: " + response.headers.get("requestId"));

                    response.json()
                         .then(function (body) {
                         // Successful response
                         if (response.ok) {
                              embedUrl = body["embedUrl"];
                              thisObj.setState({ accessToken: accessToken, embedUrl: embedUrl });
                         }
                         // If error message is available
                         else {
                              errorMessage.push("Error " + response.status + ": " + body.error.code);

                              thisObj.setState({ error: errorMessage });
                         }

                         })
                         .catch(function () {
                         errorMessage.push("Error " + response.status + ":  An error has occurred");

                         thisObj.setState({ error: errorMessage });
                         });
               })
               .catch(function (error) {

                    // Error in making the API call
                    thisObj.setState({ error: error });
               })
     }

    // Show username in the UI
     setUsername(username: string): void {
          const welcome = document.getElementById("welcome");
          if (welcome !== null)
               welcome.innerText = "" + username;
     }


     // setReportPage(): void {
     //      // setPage will change the selected view to the page you indicate.
     //      // This is the actual page name not the display name.
     //      const pageName = this.props.page
     //      const embedConfiguration: IEmbedConfiguration = {
     //           type: "report",
     //           tokenType: models.TokenType.Aad,
     //           accessToken,
     //           embedUrl,
     //           id: this.props.report,
               
     //           // Enable this setting to remove gray shoulders from embedded report
     //           settings: {
     //                // background: models.BackgroundType.Transparent,
     //                panes: {
     //                     pageNavigation: {
     //                          visible: false
     //                     },
     //                },
     //           }
               
     //      };

     //      const report = powerbi.embed(reportContainer, embedConfiguration);
     //      try {
     //           report.setPage(pageName);
     //           console.log(`Page was set to: ${pageName}`);
     //      }
     //      catch (errors) {
     //           console.log(errors);
     //      }
     // }
     
}

export default Embed;