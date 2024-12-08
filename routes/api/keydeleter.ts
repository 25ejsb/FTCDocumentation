import { Handlers } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { User } from "../../utils/db.ts";

export const handler: Handlers = {
  async DELETE(req, res) {
    const url = new URL(req.url);
    const kv = await Deno.openKv(
      "https://api.deno.com/databases/1e831a73-22d1-4480-b16a-02fceb6a3af2/connect",
    );

    const {params} = await req.json();

    const array = params.split(",");

    if (!array) {
      return new Response("Params Missing", { status: 400 });
    }

    console.log(array);
    await kv.atomic().delete(array).commit();
    return new Response("Successful, deleted.");
  },
};
