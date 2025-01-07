import { Handlers, PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { CtxState } from "./_middleware.ts";
import { kv, User } from "../utils/db.ts";
import { findUserByEmail } from "../utils/db.ts";

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
        return new Response(null, { status: 303, headers: { "Location": "/login" } });
    }
    const user = await findUserByEmail(res.state.session.email as string);
    if (user) {
        return res.render({ "isLoggedIn": sessionId != null, "user": user});
    } else {
        return new Response(null, { status: 303, headers: { "Location": "/login" } });  
    }
  },
};

export default function Account({data}: PageProps<Data>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Account - FTC Gann Documentation</title>
      </head>
      <body>
        <h1>{data.user.username}</h1>
      </body>
    </html>
  );
}
