import { setCookie } from "$std/http/cookie.ts";
import { Handlers } from "$fresh/server.ts";
import Footer from "../../islands/Footer.tsx";
import Navbar from "../../islands/Navbar.tsx";
import { comparePassword } from "../../utils/auth.ts";
import { createSession, findUserByEmail } from "../../utils/db.ts";

interface LoginData {
    email: string;
    password: string;
}

export const handler: Handlers = {
  async POST(req, res) {

    const formData = await req.formData();

    const email = formData.get("email");
    const password = formData.get("password");
    
    if (!email || !password) {
        return new Response("Missing Username or Password", {status: 404});
    }
    
    return res.render({ email: email, password: password });
  },
  async GET(req, res) {
    return new Response("GET method doesn't work for this page :(", {status: 400})
  }
//   async POST(req, res) {
//     const url = new URL(req.url);
//     const form = await req.formData();

//     const email = form.get("email")?.toString();
//     const password = form.get("password")?.toString();

//     if (!email || !password) {
//       return new Response("Missing Username or Response", {
//         status: 400,
//       });
//     }

//     const user = await findUserByEmail(email);

//     if (!user) {
//       return Response.redirect(url.host + "/login", 303);
//     }

//     if (
//       user &&
//       await comparePassword(password, user.password)
//     ) {
//       const sessionId = await createSession(user.id);

//       const response = new Response(null, {
//         status: 303,
//         headers: { "Location": "/" },
//       });

//       setCookie(response.headers, {
//         name: "session_id",
//         value: sessionId,
//         maxAge: 60 * 24,
//         sameSite: "Lax",
//         domain: url.hostname,
//         path: "/",
//         secure: true,
//       });
//       return response;
//     } else {
//       return new Response(null, {
//         status: 403,
//       });
//     }
//   },
};

export default function Authorize() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Two Step Authentication - RABBI</title>
      </head>
      <body>
        <section class="flex h-[100vh] justify-center items-center flex-wrap space-x-3 space-y-4 pt-28 pb-4 inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
          <div class="w-[25rem] p-4 h-[33rem] bg-white justify-center items-center flex-col flex">
            <h1 class="uppercase tracking-wide text-[2.5rem] text-center text-shadow-mdblack text-red-900 my-2">
              Two Step Authentication
            </h1>
            <p class="text-center my-4">
              We've just sent a code to your email, please enter the code here.
            </p>
            <input
              class="border-none focus:outline-none shadow-md my-8 p-4 text-[2rem] w-[70%] max-sm:w-[80%] bg-slate-200 tracking-widest"
              type="text"
              name="code"
              maxlength={6}
            />
            <button
              type="submit"
              class="bg-red-900 signup-submit p-4 text-[2rem] uppercase tracking-wide text-white shadow-black/50 shadow-md w-[50%] rounded-[2rem] transition-all hover:translate-y-2"
            >
              Submit
            </button>
          </div>
        </section>
        <Navbar />
        <Footer />
      </body>
    </html>
  );
}
