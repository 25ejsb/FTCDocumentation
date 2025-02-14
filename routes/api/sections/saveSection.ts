import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { bold } from "$std/fmt/colors.ts";
import { kv, Section, User } from "../../../utils/db.ts";
import { CtxState } from "../../_middleware.ts";

interface SectionParameters {
    id: string;
    name: string;
    position: number;
}

interface Data {
    isLoggedIn: boolean;
    error?: string;
}

export const handler: Handlers<Data, CtxState> = {
    async POST(req, res) {
        const json = (await req.json()) as SectionParameters;

        if (!json.name || !json.position) {
            return new Response("Missing Position or Section Name", {
                status: STATUS_CODE.BadRequest,
            });
        }

        if (!res.state.session.isAuthenticated) {
            return new Response("User isn't authenticated", {
                status: STATUS_CODE.Unauthorized,
            });
        }

        if ((await kv.get<User>(["users", res.state.session.email!])).value?.admin !== true) {
            return new Response("User isn't an admin", {
                status: STATUS_CODE.Unauthorized,
            });
        }

        const section = (await kv.get<Section>(["sections", json.id])).value!;

        if (section.position > 0) {
            await kv.set(["sections", section.id], {
                ...section,
                name: json.name,
                position: json.position,
            });
        }

        let allEntries = await Array.fromAsync(kv.list<Section>({ prefix: ["sections"] }));
        let positions: Array<number> = allEntries.map((thissection) => thissection.value.position);
        return new Response("Success", { status: 303 });
    },
};
