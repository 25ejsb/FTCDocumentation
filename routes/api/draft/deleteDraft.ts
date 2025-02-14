import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { CtxState } from "../../_middleware.ts";
import { kv, User } from "../../../utils/db.ts";

interface Data {
    isLoggedIn: boolean;
    error?: string;
}

interface DraftParameters {
    id: string;
}

export const handler: Handlers<Data, CtxState> = {
    async POST(req, res) {
        const json = (await req.json()) as DraftParameters;

        if (!json.id) {
            return new Response("No json id specified", { status: STATUS_CODE.BadRequest });
        }

        if (res.state.session.isAuthenticated) {
            return new Response("User isn't authenticated", { status: STATUS_CODE.Unauthorized });
        }

        const user = (await kv.get<User>(["users", res.state.session.email!])).value!;
        if (user.admin == false) {
            return new Response("User isn't an admin", {status: STATUS_CODE.NotAcceptable});
        }

        await kv.delete(["drafts", json.id]);

        return new Response("Success", {
            status: 301,
            headers: {"Location": "/adminpage"}
        })
    },
};
