import { Handlers } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";
import Footer from "../islands/Footer.tsx";
import Navbar from "../islands/Navbar.tsx";
import { hashPassword } from "../utils/auth.ts";
import { createSession, createUser, findUserByEmail } from "../utils/db.ts";

interface Data {
  isLoggedIn: boolean;
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
    return res.render({ isLoggedIn: sessionId });
  },
  async POST(req) {
    const formData = await req.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response("Missing Email or Response", {
        status: 400,
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response("Email already Exists!", { status: 404 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      email,
      password: hashedPassword,
    });

    const sessionId = await createSession(user.id);

    const res = new Response(null, {
      status: 200,
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

export default function Signup() {
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
          <form action="/auth/Authorize" method="POST" class="w-[60%] relative max-md:w-[80%] p-4 bg-white flex flex-col justify-center items-center rounded-[2rem]">
            <h1 class="my-4 uppercase text-red-900 text-shadow-mdblack tracking-wide text-[4rem] text-center">
              Sign Up
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
            <p class="my-4 text-[1.25rem] max-sm:text-[1rem]">
              Already have an account?{" "}
              <a class="text-red-900" href="/login">Login!</a>
            </p>
            <button class="bg-red-900 px-8 py-4 text-[2rem] rounded-[2.5rem] text-white hover:translate-y-2 transition-all hover:shadow-md hover:shadow-red-950">
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
              <p class="max-sm:text-[1rem]">Signup With Microsoft</p>{" "}
              <img src="images/microsoft.png" width={30} height={30} />
            </a>
          </form>
          <script src="/js/twostepauth.js"></script>
        </section>
        <Footer />
        <Navbar />
      </body>
    </html>
  );
}
