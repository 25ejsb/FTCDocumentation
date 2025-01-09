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
          <h2 class="tracking-wide text-[2.5rem]">@{data.user.username}</h2>
          <form
            method="post"
            encType="multipart/form-data"
            class="flex flex-col space-y-4"
            required
          >
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
              class="w-[10rem] h-[10rem] rounded-full shadow-md shadow-black bg-transparent"
              style={`background-image: url(${data.user.profilePicture}); background-size: 100%; background-position: center;`}
              alt="Profile Picture"
            >
            </button>
            <button type="submit">Set Profile Picture</button>
          </form>
        </section>
        <script src="/js/profile.js"></script>
        <Navbar noBackgroundOnStart={false} />
        <Footer />
      </body>
    </html>
  );
}
