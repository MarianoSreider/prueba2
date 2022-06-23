
import React from "react";
import ReactDOM from "react-dom";
import { UserAgentApplication, AuthError, AuthResponse } from "msal";
import { service, factories, models, IEmbedConfiguration, Report } from "powerbi-client";
import { useNavigate } from "react-router-dom"

// import { PowerBIEmbed, EventHandler } from 'powerbi-client-react';
import * as config from "../../Config";
// import { workspaceId } from '../../Config';
import { PseudoBigInt } from "typescript";

// import "isomorphic-fetch"; // or import the fetch polyfill you installed
import { Client, ClientOptions, AuthenticationProvider} from "@microsoft/microsoft-graph-client"; // To get profile pics
import { MyAuthenticationProvider } from "./AuthProvider";

// const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

let accessToken = "";
let embedUrl = "";
let reportContainer: HTMLElement;
let reportRef: React.Ref<HTMLDivElement>;
let loading: JSX.Element;
// let btnGetFilter: HTMLButtonElement;
let btnRef: React.Ref<HTMLButtonElement>;
let EuropebtnRef: React.Ref<HTMLButtonElement>;
let fullSbtnRef: React.Ref<HTMLButtonElement>;
let report: Report;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps { report:string; workspace:string; page:string; redirectTo?:string; 
     setTargetPath(targetPath:string|null):void; 
     getTargetPath():string|null;
};
interface AppState { accessToken: string; embedUrl: string; error: string[] };

class UserAuthentication extends React.Component<AppProps, AppState> {

     constructor(props: AppProps) {
          super(props);

          this.state = { accessToken: "", embedUrl: "", error: [] };

          // this.tryRefreshUserPermissions = this.tryRefreshUserPermissions.bind(this);
     }

    // React function
     render(): JSX.Element {
          // this.authenticate();
          if(window.location.pathname!="/"){
               this.props.setTargetPath(window.location.href);
          }
          return <></>;
     }

     // React function
     componentDidMount(): void {

          // if (reportRef !== null) {
          //      reportContainer = reportRef["current"];
          // }
          // // if (btnRef !== null){
          // //      btnGetFilter = btnRef["current"];
          // // }

          // // User input - null check
          // if (config.workspaceId === "" || config.reportId === "") {
          //      this.setState({ error: ["Please assign values to workspace Id and report Id in Config.ts file"] })
          // } else {

          //      // Authenticate the user and generate the access token
          //      this.authenticate();
          // }
          this.authenticate();

          // this.getFilters()
          
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
          // powerbi.reset(reportContainer);
     }

    // Authenticating to get the access token
     authenticate(): void {
          
          // if(window.location.pathname!="/"){
          //      this.props.setTargetPath(window.location.href);
          // }

          // let navigate = useNavigate();

          const thisObj = this;
          const orgRedirectTo = thisObj.props.getTargetPath()

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
                    console.log("Succesfull Login")
                    thisObj.setUsername(response.account.name);
                    updateProfilePicture();
                    let redirectTo = thisObj.props.getTargetPath()

                    if ((orgRedirectTo) && (orgRedirectTo!="Null")){
                         thisObj.props.setTargetPath(null)
                         window.location.href = orgRedirectTo;
                    }
                    
                    // Refresh User Permissions
                    thisObj.tryRefreshUserPermissions();
                    
               } else {

                    thisObj.setState({ error: [("Token type is: " + response.tokenType)] });
               }
          }

          function failCallBack(error: AuthError): void {
               thisObj.setState({ error: ["Redirect error: " + error] });
          }

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
                         let redirectTo = this.props.getTargetPath()
                         if ((redirectTo) && (redirectTo!="Null")){
                              this.props.setTargetPath(null)
                              window.location.href = redirectTo;
                         }
                         // this.setUserPic(response.account.);
                         // this.getembedUrl();
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
                              } else {
                                   // navigate('/')
                                   // if(window.location.pathname!="/"){
                                        this.props.setTargetPath(window.location.href);
                                   // }
                                   setTimeout(() =>{
                                        // document.getElementById("LinkEmbedHome")?.click();
                                        // this.navigateHome()
                                        window.location.href = '/';
                                   }, 1000);
                                   
                              }
                         }
                    });
          } else {

               // user is not logged in or cached, you will need to log them in to acquire a token
               if (window.location.pathname === "/"){
                    msalInstance.loginRedirect(loginRequest);
               } else{
                    if(window.location.pathname!="/"){
                         this.props.setTargetPath(window.location.href);
                    }
                    setTimeout(() =>{
                         // document.getElementById("LinkEmbedHome")?.click();
                         // this.navigateHome()
                         window.location.href = '/';
                    }, 1000);
               }

          }
     }

    // Power BI REST API call to refresh User Permissions in Power BI
    // Refreshes user permissions and makes sure the user permissions are fully updated
    // https://docs.microsoft.com/rest/api/power-bi/users/refreshuserpermissions
     tryRefreshUserPermissions(): void {
          const thisObj = this;

          fetch("https://api.powerbi.com/v1.0/myorg/RefreshUserPermissions", {
               headers: {
                    "Authorization": "Bearer " + accessToken
               },
               method: "POST"
          })
          .then(function (response) {
               if (response.ok) {
                    console.log("User permissions refreshed successfully.");

                    let redirectTo = thisObj.props.getTargetPath()
                    if ((redirectTo) && (redirectTo!="Null")){
                         thisObj.props.setTargetPath(null)
                         window.location.href = redirectTo;
                    }
                    
                    // if ((thisObj.props.redirectTo) && (thisObj.props.redirectTo!="Null")){
                    //      // thisObj.props.setTargetPath("Null")
                    //      window.location.href = thisObj.props.redirectTo;
                    // }
                    
               } else {
                    // Too many requests in one hour will cause the API to fail
                    if (response.status === 429) {
                         console.error("Permissions refresh will be available in up to an hour.");
                    } else {
                         console.error(response);
                    }
               }
          }
          )
          .catch(function (error) {
               console.error("Failure in making API call." + error);
          });
     }

    // Show username in the UI
     setUsername(username: string): void {
          const welcome = document.getElementById("welcome");
          if (welcome !== null)
               welcome.innerText = "" + username;
     }

}

export default UserAuthentication;