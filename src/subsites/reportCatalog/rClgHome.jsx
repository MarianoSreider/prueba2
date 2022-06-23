import React from "react";
// import reactDom from "react-dom";
import "./App.css";
import Top_bar from "../../components/top-bar/top-bar";
import SideBar from "../../components/reportCatalog/SideBar";
import MainBody from "../../components/reportCatalog/home-comp/Body";
import UserAuthentication from "../../components/authentication/userAuthentication";

class RClgHome extends React.Component {
     render() {
          let targetPath = this.props.getTargetPath();
          console.log("TARGET PATH:   " + targetPath);
          console.log(targetPath);
          // console.log(null);
          return (
               <React.Fragment>
                    <div class="splitleft">
                         <SideBar
                              redirectTo={this.props.redirectTo}
                              setTargetPath={this.props.setTargetPath}
                              getTargetPath={this.props.getTargetPath}
                         />
                    </div>
                    {/* <UserAuthentication /> */}
                    <div class="splitright">
                         <div>
                              <MainBody reports={this.props.reports} />
                         </div>
                    </div>
               </React.Fragment>
          );
     }
}

export default RClgHome;
