import { Handlers } from "$fresh/server.ts";
import { PublicClientApplication, Configuration } from "../../deps.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("No authorization code found", { status: 400 });
    }

    try {
      const pca = new PublicClientApplication({
        auth: {
            clientId: Deno.env.get("CLIENT_ID") || "",
            authority: `https://login.microsoftonline.com/${Deno.env.get("TENANT_ID")}`,
            clientSecret: Deno.env.get("CLIENT_SECRET") || "", // Critical: include client secret
          }
      });

      // Token request parameters
      const tokenRequest = {
        code,
        scopes: ["openid", "profile", "email", "user.read"],
        redirectUri: Deno.env.get("REDIRECT_URI") || ""
      };

      // Acquire token
      const response = await pca.acquireTokenByCode(tokenRequest);

      // Here you would typically:
      // 1. Validate the token
      // 2. Create a user session
      // 3. Redirect to a protected route

      return new Response(JSON.stringify(response), {
        headers: { 
          "Content-Type": "application/json",
          "Location": "/dashboard" 
        },
        status: 302
      });
    } catch (error) {
      console.error("Callback error:", error);
      return new Response("Authentication callback failed", { status: 500 });
    }
  }
};