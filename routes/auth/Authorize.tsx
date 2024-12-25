import { setCookie } from "$std/http/cookie.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Footer from "../../islands/Footer.tsx";
import Navbar from "../../islands/Navbar.tsx";
import { comparePassword } from "../../utils/auth.ts";
import { createCode, createSession, findUserByEmail, getSession, kv } from "../../utils/db.ts";
import sgMail from "npm:@sendgrid/mail";
sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY") as string);

interface LoginData {
  "email": string;
  "password": string;
  "error"?: string
}

export const handler: Handlers = {
  async POST(req, res) {
    const formData = await req.formData();

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response("Missing Username or Password", {
         status: 301,
         headers: {
          "Location": `/signup?data=${
            encodeURIComponent(
              JSON.stringify({error: "Missing Email or Password"}),
            )
          }`
         }
      });
    }

    if (await findUserByEmail(email)) {
      return new Response("Email already exists!", {
        status: 301,
        headers: {
          "Location": `/signup?data=${encodeURIComponent(JSON.stringify({error: "Email already Exists!"}))}`
        }
      })
    }

    const code = await createCode(email);

    // sgMail.send({
    //   to: email,
    //   from: "eitan.brochstein@gmail.com",
    //   subject: "FTC Gann Documentation Authorization Code",
    //   html: `<h1>Your Authorization Code is ${code.toString()}</h1>`,
    // })
    // .then(response => {
    //   console.log(response[0].statusCode);
    //   console.log(response[0].headers)
    // })
    // .catch(err => {
    //   console.log(err);
    // })

    return res.render({ "email": email, "password": password });
  },
  GET(req, res) {
    const url = new URL(req.url);
    const data = url.searchParams.get("data");
    if (data) {
      const response = JSON.parse(decodeURIComponent(data));
      if (response) {
        const result = JSON.stringify(response, null, 2);
        return res.render(JSON.parse(result));
      } else {
        return new Response("GET doesn't work for this request :(", {
          status: 404,
        });
      }
    }
    return new Response("Missing data");
  },
};

export default function Authorize({ data }: PageProps<LoginData>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Two Step Authentication - RABBI</title>
      </head>
      <body class="font-forum">
        <section class="flex h-[100vh] justify-center items-center flex-wrap space-x-3 space-y-4 pt-28 pb-4 inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
          <form
            action="/api/signup"
            method="POST"
            class="w-[25rem] p-4 h-[33rem] bg-white justify-center items-center flex-col flex max-sm:w-[20rem]"
          >
            <h1 class="uppercase tracking-wide text-[2.5rem] text-center text-shadow-mdblack text-red-900 my-2 max-sm:text-[2rem]">
              Two Step Authentication
            </h1>
            <input type="hidden" name="email" value={data.email} />
            <input type="hidden" name="password" value={data.password} />
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
              class="bg-red-900 signup-submit p-4 text-[2rem] uppercase tracking-wide text-white shadow-black/50 shadow-md w-[50%] rounded-[2rem] transition-all hover:translate-y-2 mb-8"
            >
              Submit
            </button>
            {data.error
              ? (
                <p class="text-red-900">{data.error}</p>
              ): (
                <p></p>
              )
            }
          </form>
        </section>
        <Navbar />
        <Footer />
      </body>
    </html>
  );
}
