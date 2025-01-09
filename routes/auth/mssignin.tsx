import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import isLength from "https://deno.land/x/deno_validator@v0.0.5/lib/isLength.ts";
import { Configuration, PublicClientApplication } from "../../deps.ts";
import Footer from "../../islands/Footer.tsx";
import Navbar from "../../islands/Navbar.tsx";
import { comparePassword } from "../../utils/auth.ts";
import { hashPassword } from "../../utils/auth.ts";
import {
  createSession,
  createUser,
  findUserByEmail,
  kv,
} from "../../utils/db.ts";
import { passwordGenerator } from "https://deno.land/x/password_generator/mod.ts";
import isAlphanumeric from "https://deno.land/x/deno_validator@v0.0.5/lib/isAlphanumeric.ts";
interface Data {
  email: string;
  password: string;
  error?: string;
}

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
        scopes: [
          "User.Read",
          "profile",
          "email",
          "User.Read.All",
          "Calendars.Read",
          "Files.Read.All",
        ],
        redirectUri: Deno.env.get("REDIRECT_URI") || "",
      };

      // Acquire token
      const response = await pca.acquireTokenByCode(tokenRequest);

      const email = response.account?.username;

      if (email) {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          const sessionId = await createSession(existingUser.email);

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
        }
        const generatedPassword = passwordGenerator("*", 50);
        const hashedPassword = await hashPassword(generatedPassword);
        const data = url.searchParams.get("data");
        if (data) {
          const response = JSON.parse(decodeURIComponent(data)) as Data;
          return ctx.render(response);
        } else {
          return ctx.render({ email: email, password: hashedPassword });
        }
      } else {
        return new Response("Invalid email!", { status: 404 });
      }
    } catch (error) {
      console.error("Callback error:", error);
      return new Response("Authentication callback failed", { status: 500 });
    }
  },
  async POST(req, ctx) {
    const formData = await req.formData();

    const email = formData.get("email")?.toString();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !username || !password) {
      return new Response("Missing Username!", { status: 400 });
    }

    if (!isLength(username, { min: 4, max: 20 }) || !isAlphanumeric(username)) {
      return new Response(
        "The username must be between lengths 4-20, and the username should be alphanumeric",
        { status: 400 },
      );
    }

    if ((await kv.get(["usernames", username])).value) {
      return new Response("Username already is used by another account", {
        status: 400,
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response("Email already Exists!", { status: 404 });
    }

    await kv.delete(["codes", email]);

    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      email,
      username: username,
      password: hashedPassword,
    });

    const sessionId = await createSession(user.email);

    const res = new Response("Success!", {
      status: 301,
      headers: { "Location": "/" },
    });

    setCookie(res.headers, {
      name: "session_id",
      value: sessionId,
      path: "/",
      maxAge: 24 * 60 * 60,
    });
    return res;
  },
};

export default function mssignin({ data }: PageProps<Data>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Make a Username - FTC Gann Documentation</title>
      </head>
      <body class="font-forum">
        <section class="flex flex-wrap space-x-3 space-y-4 pt-28 pb-4 justify-around items-center inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
          <form
            method="POST"
            class="w-[60%] relative max-md:w-[80%] p-4 bg-white flex flex-col justify-center items-center rounded-[2rem]"
          >
            <h1 class="my-4 uppercase text-red-900 text-shadow-mdblack tracking-wide text-[4rem] text-center">
              Enter Username
            </h1>
            <input
              placeholder="Username"
              class="border-none focus:outline-none shadow-md my-8 p-4 text-[2rem] max-sm:text-[1.25rem] rounded-2xl w-[70%] max-sm:w-[80%] bg-slate-200"
              type="text"
              name="username"
              minlength={4}
              maxlength={20}
              required
            />
            <input type="hidden" name="email" value={data.email} />
            <input type="hidden" name="password" value={data.password} />
            {data.error
              ? <p class="text-red-900">Error: {data.error}</p>
              : <p></p>}
            <button
              type="submit"
              class="bg-red-900 px-8 py-4 text-[2rem] rounded-[2.5rem] text-white hover:translate-y-2 transition-all hover:shadow-md hover:shadow-red-950"
            >
              Submit
            </button>
          </form>
        </section>
        <Footer />
        <Navbar noBackgroundOnStart={true} />
      </body>
    </html>
  );
}
