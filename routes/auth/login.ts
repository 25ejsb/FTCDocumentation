import { Handlers } from "$fresh/server.ts";
import { PublicClientApplication, Configuration } from "../../deps.ts";

// Azure AD App Registration Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: Deno.env.get("CLIENT_ID") || "",
    authority: `https://login.microsoftonline.com/${Deno.env.get("TENANT_ID")}`,
    clientSecret: Deno.env.get("CLIENT_SECRET") || "",
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
        console.log(message);
      },
      piiLoggingEnabled: false,
    }
  }
};

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // Initialize MSAL Public Client Application
      const pca = new PublicClientApplication(msalConfig);

      // Generate authorization URL
      const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: Deno.env.get("REDIRECT_URI") || "",
      };

      const authCodeUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);

      // Redirect to Microsoft login
      return new Response(null, {
        status: 302,
        headers: { 
          "Location": authCodeUrl 
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return new Response("Authentication failed", { status: 500 });
    }
  }
};