import { Handlers } from "$fresh/server.ts";
import { kv, User } from "../../utils/db.ts";
import { getSession } from "../../utils/db.ts";

export const handler: Handlers = {
  async POST(req, res) {
    const formData = await req.formData();
    const description = formData.get("description")?.toString();

    const sessionId = req.headers.get("cookie")?.split("; ").find((cookie) =>
      cookie.startsWith("session_id=")
    )?.split("=")[1];

    if (sessionId) {
      await getSession(sessionId).then(async (session) => {
        const user = (await kv.get<User>(["users", session!.email])).value;
        await kv.set(["users", session!.email], {
          ...user,
          description: description,
        });
      });
      return new Response(null, {
        status: 302,
        headers: { "Location": "/account" },
      });
    }
    return new Response(
      "Something went wrong while trying to set up description",
      { status: 401 },
    );
  },
};
