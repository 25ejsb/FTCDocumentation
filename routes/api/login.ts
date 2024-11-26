import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { User } from "./signup.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const kv = await Deno.openKv(
      "https://api.deno.com/databases/1e831a73-22d1-4480-b16a-02fceb6a3af2/connect",
    );

    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username || !password) {
      return new Response("Missing Username or Response", {
        status: 400,
      });
    }

    const userExists = await kv.get(["users", username]);

    if (!userExists.value) {
      return Response.redirect(url.host + "/login", 303);
    }

    if (
      userExists &&
      await bcrypt.compare(password, (userExists.value as User).password)
    ) {
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: "verysecretcode",
        maxAge: 60 * 24,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });
      headers.set("location", "/");
      return new Response(null, {
        status: 303,
        headers,
      });
    } else {
      return new Response(null, {
        status: 403,
      });
    }
  },
};
