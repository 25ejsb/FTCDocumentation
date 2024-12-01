import { Handlers } from "$fresh/server.ts";
import { AuthorizationCodeRequest } from "https://deno.land/x/azure_msal_deno@v1.1.0/mod.ts";
import { psa } from "../../components/oAuth.ts";

export const handler = {
  async GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (code) {
      const tokenResponse = await psa.acquireTokenByCode({
        code,
        scopes: ["openid", "profile", "email"]
      })
      return new Response("Access Token: " + tokenResponse?.accessToken)
    }

    return new Response("Not Found", {status: 404})
  },
};
