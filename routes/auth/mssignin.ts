import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { Configuration, PublicClientApplication } from "../../deps.ts";
import { comparePassword } from "../../utils/auth.ts";
import { hashPassword } from "../../utils/auth.ts";
import { createSession, createUser, findUserByEmail } from "../../utils/db.ts";
import { passwordGenerator } from "https://deno.land/x/password_generator/mod.ts";

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
          authority: `https://login.microsoftonline.com/${
            Deno.env.get("TENANT_ID")
          }`,
          clientSecret: Deno.env.get("CLIENT_SECRET") || "", // Critical: include client secret
        },
      });

      // Token request parameters
      const tokenRequest = {
        code,
        scopes: ["openid", "profile", "email", "user.read"],
        redirectUri: Deno.env.get("REDIRECT_URI") || "",
      };

      // Acquire token
      const response = await pca.acquireTokenByCode(tokenRequest);

      const email = response.account?.username;

      if (email) {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          const sessionId = await createSession(existingUser.id);

          const res = new Response("Response worked!", {
            status: 303,
            headers: { "Location": "/" },
          });

          setCookie(res.headers, {
            name: "session_id",
            value: sessionId,
            maxAge: 60 * 24,
            sameSite: "Lax",
            domain: url.hostname,
            path: "/",
            secure: true,
          });
          return res;
        } else {
          const res2 = new Response("Response worked!", {
            status: 303,
            headers: {
              "Location": "/"
            }
          })
  
          const generatedPassword = passwordGenerator("*", 50);
          const hashedPassword = await hashPassword(generatedPassword);
          const user = await createUser({
            email,
            password: hashedPassword,
          });
  
          const sessionId = await createSession(user.id);
  
          setCookie(res2.headers, {
            name: "session_id",
            value: sessionId,
            path: "/",
            maxAge: 24 * 60 * 60,
          });
  
          return res2;
        }
      } else {
        return new Response("Invalid email!", { status: 404 });
      }
    } catch (error) {
      console.error("Callback error:", error);
      return new Response("Authentication callback failed", { status: 500 });
    }
  },
};
