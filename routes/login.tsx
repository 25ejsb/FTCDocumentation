import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";
import Footer from "../islands/Footer.tsx";
import Navbar from "../islands/Navbar.tsx";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { createSession, findUserByEmail, User } from "../utils/db.ts";
import { comparePassword } from "../utils/auth.ts";

interface Data {
  isLoggedIn: boolean;
}

export const handler: Handlers = {
  GET(req, res) {
    const cookies = getCookies(req.headers);
    const isLoggedIn = cookies.auth === "verysecretcode";
    if (isLoggedIn) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
        },
      });
    }
    return res.render({ isLoggedIn: isLoggedIn });
  },
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();

    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return new Response("Missing Username or Response", {
        status: 400,
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return Response.redirect(url.host + "/login", 303);
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
    } else {
      return new Response(null, {
        status: 403,
      });
    }
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
        <section class="flex h-[100vh] flex-wrap space-x-3 space-y-4 pt-28 pb-4 justify-around items-center inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
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
              type="text"
              name="email"
            />
            <input
              placeholder="Password"
              class="border-none focus:outline-none shadow-md my-8 p-4 text-[2rem] max-sm:text-[1.25rem] rounded-2xl w-[70%] max-sm:w-[80%] bg-slate-200"
              type="password"
              name="password"
            />
            <button
              class="bg-red-900 px-8 py-4 text-[2rem] rounded-[2.5rem] text-white hover:translate-y-2 transition-all hover:shadow-md hover:shadow-red-950"
              type="submit"
            >
              Submit
            </button>
          </form>
          <script src="/ts/scroll.ts"></script>
        </section>
        <Footer />
        <Navbar />
      </body>
    </html>
  );
}
