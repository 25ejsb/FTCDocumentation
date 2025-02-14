import { Handlers } from "$fresh/server.ts";
import { existsSync } from "node:fs";
import { getSession, kv, User } from "../../utils/db.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
        const sessionId = req.headers
            .get("cookie")
            ?.split("; ")
            .find((cookie) => cookie.startsWith("session_id="))
            ?.split("=")[1];

        if (sessionId) {
            await getSession(sessionId).then(async (session) => {
                const user = (await kv.get<User>(["users", session?.email!])).value;
                await kv.set(["users", user!.email], {
                    ...user,
                    profilePicture: "./images/rabbi.webp",
                });
                if (existsSync(`./images/uploads/${user!.username}.jpg`)) {
                    await Deno.remove(`./images/uploads/${user!.username}.jpg`);
                }
            });
            return new Response(null, {
                status: 302,
                headers: { Location: "/account" },
            });
        }

        return new Response("Invalid User!", { status: 404 });
    },
};
