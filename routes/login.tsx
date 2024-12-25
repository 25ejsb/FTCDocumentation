import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";
import Footer from "../islands/Footer.tsx";
import Navbar from "../islands/Navbar.tsx";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { createSession, findUserByEmail, User } from "../utils/db.ts";
import { comparePassword } from "../utils/auth.ts";
import { context } from "https://deno.land/x/esbuild@v0.20.2/mod.js";

interface Data {
  "isLoggedIn": boolean;
  "error"?: string;
}

export const handler: Handlers = {
  GET(req, res) {
    const sessionId = req.headers.get("cookie")?.split("; ").find((cookie) =>
      cookie.startsWith("session_id=")
    )?.split("=")[1];
    if (sessionId) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
        },
      });
    }
    const url = new URL(req.url);
    const data = url.searchParams.get("data");
    if (data) {
      const response = JSON.parse(decodeURIComponent(data)) as Data;
      response.isLoggedIn = sessionId != null;
      return res.render(response);
    } else {
      return res.render({ "isLoggedIn": sessionId });
    }
  },
  async POST(req, res) {
    const formData = await req.formData();

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const url = new URL(req.url);

    if (!email || !password) {
      return new Response("Missing Email or Response", {
        status: 301,
        headers: {
          "Location": `/login?data=${encodeURIComponent(JSON.stringify({error: "Missing Email or Response"}))}`
        }
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return new Response("User doesn't exist", {
        status: 301,
        headers: {"Location": `/login?data=${encodeURIComponent(JSON.stringify({error: "User doesn't exist"}))}`}
      });
    }

    if (
      user &&
      await comparePassword(password, user.password)
    ) {
      const sessionId = await createSession(user.id);

      const response = new Response(null, {
        status: 303,
        headers: { "Location": "/" },
      });

      setCookie(response.headers, {
        name: "session_id",
        value: sessionId,
        maxAge: 60 * 24,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });
      return response;
    }

    return new Response(null, {status: 401});
  },
};

export default function Login({ data }: PageProps<Data>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Log In</title>
      </head>
      <body class="font-forum">
        <section class="flex flex-wrap space-x-3 space-y-4 pt-28 pb-4 justify-around items-center inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
          <form
            method="POST"
            class="w-[60%] max-md:w-[80%] p-4 bg-white flex flex-col justify-center items-center rounded-[2rem]"
          >
            <h1 class="my-4 uppercase text-red-900 text-shadow-mdblack tracking-wide text-[4rem] text-center">
              Log in
            </h1>
            <input
              placeholder="Email"
              class="border-none focus:outline-none shadow-md my-4 p-4 text-[2rem] max-sm:text-[1.25rem] rounded-2xl w-[70%] max-sm:w-[80%] bg-slate-200"
              type="email"
              name="email"
            />
            <input
              placeholder="Password"
              class="border-none focus:outline-none shadow-md my-8 p-4 text-[2rem] max-sm:text-[1.25rem] rounded-2xl w-[70%] max-sm:w-[80%] bg-slate-200"
              type="password"
              name="password"
            />
            {data.error
            ? (
              <p class="text-red-900">Error: {data.error}</p>
            ): (
              <p></p>
            )}
            <p class="my-4 text-[1.25rem] max-sm:text-[1rem]">
              Don't have an account yet?{" "}
              <a class="text-red-900" href="/signup">Signup!</a>
            </p>
            <button
              class="bg-red-900 px-8 py-4 text-[2rem] rounded-[2.5rem] text-white hover:translate-y-2 transition-all hover:shadow-md hover:shadow-red-950"
              type="submit"
            >
              Submit
            </button>
            <div class="relative py-4 w-full">
              <div class="absolute inset-0 flex items-center w-full">
                <div class="w-full h-[2px] border-b border-gray-300"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="bg-white px-4 text-[1.2rem] text-gray-500">
                  OR
                </span>
              </div>
            </div>
            <a
              href="/auth/login"
              class={"bg-red-900 p-4 text-white rounded-3xl text-2xl transition-all mb-4 text-center hover:translate-y-1 flex space-x-3"}
            >
              <p class="max-sm:text-[1rem]">Login With Microsoft</p>{" "}
              <img src="images/microsoft.png" width={30} height={30} />
            </a>
          </form>
          <script src="/ts/scroll.ts"></script>
        </section>
        <Footer />
        <Navbar />
      </body>
    </html>
  );
}
