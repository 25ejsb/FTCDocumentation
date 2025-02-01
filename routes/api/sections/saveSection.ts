import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { bold } from "$std/fmt/colors.ts";
import { kv, Section } from "../../../utils/db.ts";
import { CtxState } from "../../_middleware.ts";

interface SectionParameters {
	id: string;
	name: string;
	position: number;
}

interface Data {
	"isLoggedIn": boolean;
	"error"?: string;
}

export const handler: Handlers<Data, CtxState> = {
	async POST(req, res) {
		const json = await req.json() as SectionParameters;
<<<<<<< HEAD
=======
		
        if (!json.name || !json.position) {
            return new Response("Missing Position or Section Name", {status: STATUS_CODE.BadRequest})
        }
>>>>>>> ddfa57a (lol)

		if (!json.name || !json.position) {
			return new Response("Missing Position or Section Name", {
				status: STATUS_CODE.BadRequest,
			});
		}

<<<<<<< HEAD
		if (!res.state.session.isAuthenticated) {
			return new Response("User isn't authenticated", {
				status: STATUS_CODE.Unauthorized,
			});
		}

		const section = (await kv.get<Section>(["sections", json.id]))
			.value as Section;

		if (section.position > 0) {
			await kv.set(["sections", section.id], { ...section, name: json.name, position: json.position });
		}

		let allEntries = await Array.fromAsync(
			kv.list<Section>({ prefix: ["sections"] }),
		);
		let positions: Array<number> = allEntries.map((thissection) =>
			thissection.value.position
		);
=======
        const section = (await kv.get<Section>(["sections", json.id])).value as Section;

		await kv.set(["sections", json.id], {id: section.id, name: json.name, position: json.position})
>>>>>>> ddfa57a (lol)
		return new Response("Success", { status: 303 });
	},
};
