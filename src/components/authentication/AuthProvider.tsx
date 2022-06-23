import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import * as qs from "qs";
import axios from "axios";
import * as Config from "../../Config";
import config from "config";

export class MyAuthenticationProvider implements AuthenticationProvider {

     public async getAccessToken(): Promise<string> {

          const url: string = "https://login.microsoftonline.com/" + Config.tenantId + "/oauth2/v2.0/token";

          const body: object = {
               client_id: Config.clientId,
               client_secret: "02D7Q~cmg_cAKIaaEi~mEMns2YwZa.588-fOP",
               scope: "https://graph.microsoft.com/.default",
               grant_type: "client_credentials"
          }

          try {

               let response = await axios.post(url, qs.stringify(body))

               if (response.status == 200) {

                    return response.data.access_token;

               } else {

                    throw new Error("Non 200OK response on obtaining token...")

               }

          } catch (error) {

               throw new Error("Error on obtaining token...")

          }
    }
}