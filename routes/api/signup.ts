import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

export interface User {
  username: string;
  password: string;
}

export const handler: Handlers = {
  async POST(req) {
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      return new Response("Missing Username or Response", {
        status: 400,
      });
    }

    const kv = await Deno.openKv(
      "https://api.deno.com/databases/1e831a73-22d1-4480-b16a-02fceb6a3af2/connect",
    );

    const existingUser = await kv.get(["users", username]);
    if (existingUser.value) {
      return new Response("Username already Exists!", { status: 404 });
    }

    const genSalt = await bcrypt.genSalt(8);
    bcrypt.hash(password, genSalt).then((hashedPassword) => {
      kv.set(["users", username], {
        username: username,
        password: hashedPassword,
      });
    });

    const url = new URL(req.url);

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

    headers.set("location", "/login");

    return new Response("User created successfully", { status: 200, headers });
  },
};
