import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { bold } from "$std/fmt/colors.ts";
import { kv, Section } from "../../utils/db.ts";
import { CtxState } from "../_middleware.ts";

interface SectionParameters {
	currentName: string;
	sectionName: string;
	position: number;
}

interface Data {
    "isLoggedIn": boolean;
    "error"?: string;
}

export const handler: Handlers<Data, CtxState> = {
	async POST(req, res) {
		const json = await req.json() as SectionParameters;
		
        if (!json.sectionName || !json.position) {
            return new Response("Missing Position or Section Name", {status: STATUS_CODE.BadRequest})
        }

        if (!res.state.session.isAuthenticated) {
            return new Response("User isn't authenticated", {status: STATUS_CODE.Unauthorized})
        }

        const section = (await kv.get<Section>(["sections", json.currentName])).value as Section;
		const isTheSame: boolean = section.position === json.position;
		section.position = json.position;

		const allEntries = await Array.fromAsync(
			kv.list<Section>({ prefix: ["sections"] }),
		);
		const positions: Array<number> = allEntries.map((thissection) =>
			thissection.value.position
		);
		const movingSections: Array<Section> = [];
		if (section.position > 0) {
			await kv.set(["sections", section.name], {...section})
			if (!isTheSame) {
				allEntries.forEach(e => {
					if (positions.includes(e.value.position-1) && e.value.position > section.position && e.value.name !== section.name || section.position === e.value.position && e.value.name !== section.name) {
						movingSections.push(e.value);
					}
				})
			}
		}
		movingSections.forEach(async e => {
			await kv.set(["sections", e.name], {...e, position: e.position+1})
		})
		return new Response("Success", { status: 303 });
	},
};
