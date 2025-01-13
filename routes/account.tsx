import { Handlers, PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { CtxState } from "./_middleware.ts";
import { kv, User } from "../utils/db.ts";
import { findUserByEmail } from "../utils/db.ts";
import Navbar from "../islands/Navbar.tsx";
import Footer from "../islands/Footer.tsx";
import { validateFile } from "../utils/image.ts";
import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";

interface Data {
  "isLoggedIn": boolean;
  "error"?: string;
  "user": User;
}

export const handler: Handlers<Data, CtxState> = {
  async GET(req, res) {
    const sessionId = req.headers.get("cookie")?.split("; ").find((cookie) =>
      cookie.startsWith("session_id=")
    )?.split("=")[1];
    if (!res.state.session.email) {
      return new Response(null, {
        status: 303,
        headers: { "Location": "/login" },
      });
    }
    const user = await findUserByEmail(res.state.session.email as string);
    if (user) {
      return res.render({ "isLoggedIn": sessionId != null, "user": user });
    } else {
      return new Response(null, {
        status: 303,
        headers: { "Location": "/login" },
      });
    }
  },
  async POST(req, ctx) {
    try {
      const formData = await req.formData();
      const file = formData.get("profilePicture") as File;

      if (file && await validateFile(file)) {
        const findUser = findUserByEmail(ctx.state.session.email as string);
        findUser.then(async (user) => {
          await kv.set(["users", user?.email as string], {
            ...user,
            profilePicture: `./images/uploads/${user?.username}.jpg`,
          });
          await Deno.writeFile(
            `./static/images/uploads/${user?.username}.jpg`,
            new Uint8Array(await file.arrayBuffer()),
          );
        });
      }

      return new Response(null, {
        status: 302,
        headers: { "Location": "/account" },
      });
    } catch (e) {
      console.log(e);
      return new Response("Upload Failed", { status: 500 });
    }
  },
};

export default function Account({ data }: PageProps<Data>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Account - FTC Gann Documentation</title>
      </head>
      <body class="font-forum">
        <section class="p-[6rem] mt-[6rem] flex justify-center items-center flex-col">
          <h1 class="text-red-900 uppercase tracking-wide text-[3.5rem] text-shadow-mdblack text-center">
            Account Settings
          </h1>
          <h2 class="tracking-wide text-[2.5rem] mb-8">
            @{data.user.username}
          </h2>
          <div class="flex justify-around w-full space-x-16 max-md:space-x-0 max-md:space-y-4 max-md:flex-wrap">
            <form
              method="post"
              encType="multipart/form-data"
              class="flex flex-col space-y-4 w-[15rem]"
              required
            >
              <h1 class="text-3xl text-center font-semibold">Profile Picture</h1>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                title=""
                class="hidden"
              />
              <button
                id="profileBtn"
                class="w-full pb-[100%] rounded-full shadow-md shadow-black bg-transparent"
                style={`background-image: url(${data.user.profilePicture}); background-size: 100%; background-position: center;`}
                alt="Profile Picture"
              >
              </button>
              <button
                class="p-4 bg-red-900 rounded-[2rem] text-lg max-lg:text-sm text-center text-white hover:shadow-mdblack hover:translate-y-[-0.25rem] active:translate-y-[0.25rem] transition-all"
                type="submit"
              >
                Set Picture
              </button>
              <a
                href="/api/deleteProfilePicture"
                class="p-4 bg-red-900 text-center rounded-[2rem] text-lg max-lg:text-sm text-white hover:shadow-mdblack hover:translate-y-[-0.25rem] active:translate-y-[0.25rem] transition-all"
                type="submit"
              >
                Delete Picture
              </a>
            </form>
            <div class="flex flex-col w-[40rem]">
              <form
                method="post"
                id="descriptionForm"
                action="/api/changeDescription"
                class="flex flex-col space-y-4 items-center mb-4"
              >
                <h1 class="text-[2rem] text-center font-semibold">
                  Description
                </h1>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  maxLength={100}
                  class="w-full shrink bg-slate-100 focus:outline-none p-4 text-[1.5rem] resize-none h-[10rem]"
                  placeholder="Description"
                >
                  {data.user.description}
                </textarea>
                <button
                  id="submitDescription"
                  class="bg-red-900 w-[50%] max-sm:w-[75%] max-sm:text-sm rounded-[2rem] text-white p-4 hover:shadow-mdblack hover:translate-y-[-0.25rem] active:translate-y-1 transition-all"
                >
                  Change Description
                </button>
              </form>
              <form
                action="/api/changeUsername"
                method="post"
                id="usernameForm"
                class="flex flex-col space-y-4 items-center"
              >
                <h1 class="text-[2rem] text-center font-semibold">
                  Username
                </h1>
                <input
                  type="text"
                  name="username"
                  class="w-full bg-slate-100 focus:outline-none p-4 text-[1.5rem]"
                  id="username"
                  placeholder={`${data.user.username}`}
                />
                <button
                  id="submitDescription"
                  class="bg-red-900 w-[50%] max-sm:w-[75%] max-sm:text-sm rounded-[2rem] text-white p-4 hover:shadow-mdblack hover:translate-y-[-0.25rem] active:translate-y-1 transition-all"
                >
                  Change Username
                </button>
              </form>
            </div>
          </div>
        </section>
        <script src="/js/profile.js"></script>
        <Navbar noBackgroundOnStart={false} />
        <Footer />
      </body>
    </html>
  );
}
