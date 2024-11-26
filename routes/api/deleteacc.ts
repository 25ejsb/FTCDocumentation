import { Handlers } from "$fresh/server.ts";
import { User } from "./signup.ts";

export const handler: Handlers = {
  async DELETE(req, res) {
    const url = new URL(req.url);
    const kv = await Deno.openKv(
      "https://api.deno.com/databases/1e831a73-22d1-4480-b16a-02fceb6a3af2/connect",
    );

    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response("User or password is missing", { status: 400 });
    }

    const params = ["users", username];
    const key = await kv.get(params);

    if (
      key.value && (key.value as User).username === username &&
      (key.value as User).password === password
    ) {
      await kv.atomic().check(key).delete(params).commit();
      return new Response("Successfully deleted user.");
    } else {
      return new Response("Unable to delete user.");
    }
  },
};
