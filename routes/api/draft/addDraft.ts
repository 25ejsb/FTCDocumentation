import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import isLength from "https://deno.land/x/deno_validator@v0.0.5/lib/isLength.ts";
import { kv, Section, User } from "../../../utils/db.ts";
import { CtxState } from "../../_middleware.ts";
import { createDraft } from "../../../utils/db.ts";
import { stringToIdentifier } from "$fresh/src/server/init_safe_deps.ts";

interface Data {
    isLoggedIn: boolean;
    error?: string;
}

export const handler: Handlers<Data, CtxState> = {
    async POST(req, res) {
        const formData = await req.formData();

        const draft = formData.get("draft")?.toString();
        const section = formData.get("section")?.toString();

        let sectionId: string | null = null;

        const allEntries = await Array.fromAsync(kv.list<Section>({ prefix: ["sections"] }));

        allEntries.map((entry) => {
            if (entry.value.name === section) {
                sectionId = entry.value.id;
            }
        });

        if (res.state.session.isAuthenticated) {
            const user = (await kv.get<User>(["users", res.state.session.email as string])).value;
            if (user?.admin === true) {
                if (draft && section && isLength(draft, { min: 3, max: 20 })) {
                    await createDraft({
                        id: crypto.randomUUID(),
                        name: draft,
                        sectionId: sectionId!,
                        ownerEmail: user.email,
                        html: "",
                    });
                    return new Response("Success!", { status: 301, headers: { Location: "/adminpage" } });
                }
                return new Response("Draft's name should have a min length of 3, and a max of 20, either this or invalid draft or section", { status: STATUS_CODE.BadRequest });
            }
            return new Response("User is not an admin", { status: STATUS_CODE.NotAcceptable });
        }
        return new Response("User is not authenticated", { status: STATUS_CODE.NotFound });
    },
};
