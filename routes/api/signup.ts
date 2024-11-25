import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

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
                status: 400
            });
        }

        const kv = await Deno.openKv();

        const existingUser = await kv.get(["users", username]);
        if (existingUser.value) {
            return new Response("Username already Exists!", {status: 404})
        }

        await kv.set(["users", username], {username: username, password: password});

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

        return new Response("User created successfully");
    }
}