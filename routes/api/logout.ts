import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import { destroySession } from "../../utils/db.ts";

export const handler: Handlers = {
    async GET(req) {
        const sessionId = req.headers
            .get("cookie")
            ?.split("; ")
            .find((cookie) => cookie.startsWith("session_id="))
            ?.split("=")[1];

        if (sessionId) {
            await destroySession(sessionId);
        }
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/login",
                "Set-Cookie": "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            },
        });
    },
};
