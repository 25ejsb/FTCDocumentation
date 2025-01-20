import { Handlers } from "$fresh/server.ts";
import { createSection, kv, Section, User } from "../../utils/db.ts";
import { CtxState } from "../_middleware.ts";
import isLength from "https://deno.land/x/deno_validator@v0.0.5/lib/isLength.ts";

interface Data {
	"isLoggedIn": boolean;
	"error"?: string;
}

export const handler: Handlers<Data, CtxState> = {
	async POST(req, res) {
		const formData = await req.formData();

		const section = formData.get("section")?.toString();
        const position = formData.get("position")?.toString();

		if (res.state.session.isAuthenticated) {
			const user = (await kv.get<User>([
				"users",
				res.state.session!.email as string,
			])).value;
			if (user!.admin === true) {
				if (section && position && isLength(section, { min: 3, max: 30 }) && parseInt(position) >= 0) {
					await createSection({ name: section, position: parseInt(position) });
					return new Response("Success", {
						status: 301,
						headers: { "Location": "/adminpage" },
					});
				}
				return new Response(
					"Section should be between 3 and 30 characters, and position should be higher than 0.",
				);
			}
			return new Response("User isn't an admin.", { status: 400 });
		}
		return new Response("User is not authenticated", { status: 400 });
	},
};
