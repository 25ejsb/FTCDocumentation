import { Handlers, STATUS_CODE } from "$fresh/server.ts";
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
		let allEntries = await Array.fromAsync(
			kv.list<Section>({ prefix: ["sections"] }),
		);
		let positions: Array<number> = allEntries.map((thissection) =>
			thissection.value.position
		);
		if (section.position > 0) {
			await kv.set(["sections", section.name], {
                name: json.sectionName,
                position: json.position
            });
			if (positions.includes(section.position)) {
				allEntries.forEach(async (entry) => {
					positions = allEntries.map((thisection) =>
						thisection.value.position
					);
					if (
						entry.value.position >= section.position &&
						positions.includes(entry.value.position - 1)
					) {
						await kv.delete(["sections", entry.value.name]);
						await kv.set(["sections", entry.value.name], {
							...entry.value,
							position: entry.value.position + 1,
						});
					}
				});
				allEntries.forEach(async (entry) => {
					if (
						entry.value.position == section.position &&
						entry.value.name != section.name
					) {
						await kv.delete(["sections", entry.value.name]);
						await kv.set(["sections", entry.value.name], {
							...entry.value,
							position: entry.value.position + 1,
						});
					}
				});
			}
		}
		return new Response("Success", { status: 303 });
	},
};
