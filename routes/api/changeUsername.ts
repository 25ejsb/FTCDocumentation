import { Handlers } from "$fresh/server.ts";
import { isAlphanumeric, isLength } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";
import { findUserByEmail, getSession, kv, User } from "../../utils/db.ts";

export const handler: Handlers = {
    async POST(req, ctx) {
        const sessionId = req.headers
            .get("cookie")
            ?.split("; ")
            .find((cookie) => cookie.startsWith("session_id="))
            ?.split("=")[1];

        const formData = await req.formData();

        const username = formData.get("username")?.toString() as string;

        if (!isLength(username, { min: 4, max: 20 }) || !isAlphanumeric(username)) {
            return new Response("The username must be between lengths 4-20, and the username should be alphanumeric", { status: 400 });
        }

        if ((await kv.get(["usernames", username])).value) {
            return new Response("Username already is used by another account", {
                status: 400,
            });
        }

        if (sessionId) {
            await getSession(sessionId).then(async (accountuser) => {
                const user = (await kv.get<User>(["users", accountuser!.email])).value;
                await kv.delete(["usernames", user!.username]);
                await kv.set(["users", user!.email], {
                    ...user,
                    username: username,
                });
                await kv.set(["usernames", username], {
                    email: user!.email,
                    username: username,
                });
            });
            return new Response(null, {
                status: 302,
                headers: { Location: "/account" },
            });
        } else {
            return new Response("Invalid Session ID", { status: 401 });
        }
    },
};
