import { Handlers } from "$fresh/server.ts";
import { psa } from "../../components/oAuth.ts";

export const handler: Handlers = {
  GET(req) {
    psa.getAuthCodeUrl({
        scopes: ["openid", "profile", "email"],
        redirectUri: "http://localhost:8000/auth/mssignin"
    }).then(res => {
        return new Response(null, {
            headers: {
                Location: res
            }
        })
    });
  },
};
