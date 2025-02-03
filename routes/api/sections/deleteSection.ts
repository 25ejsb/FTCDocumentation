import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { kv, User } from "../../../utils/db.ts";
import { CtxState } from "../../_middleware.ts";

interface Data {
	"isLoggedIn": boolean;
	"error"?: string;
}

interface SectionParameters {
	id: string;
}

export const handler: Handlers<Data, CtxState> = {
	async POST(req, res) {
		const json = await req.json() as SectionParameters;

		if (!json.id) {
			return new Response("No json id specified", {
				status: STATUS_CODE.BadRequest,
			});
		}

		if (!res.state.session.isAuthenticated) {
			return new Response("User isn't authenticated", {
				status: STATUS_CODE.Unauthorized,
			});
		}

		if (
			(await kv.get<User>(["users", res.state.session.email!])).value
				?.admin !== true
		) {
			return new Response("User isn't an admin", {
				status: STATUS_CODE.Unauthorized,
			});
		}

        await kv.delete(["sections", json.id]);

        return new Response(null, {status: STATUS_CODE.OK, headers: {"Location": "/adminpage"}})
	},
};
