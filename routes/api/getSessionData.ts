import { Handlers } from "$fresh/server.ts";
import { findUserByEmail } from "../../utils/db.ts";
import { CtxState } from "../_middleware.ts";

interface Data {
	"isLoggedIn": boolean;
	"error"?: string;
}

export const handler: Handlers<Data, CtxState> = {
	async GET(req, ctx) {
		try {
			if (!ctx.state.session?.isAuthenticated) {
				return new Response(
					JSON.stringify({
						isAuthenticated: false,
					}),
					{
						headers: { "Content-Type": "application/json" },
					},
				);
			}

			const user = await findUserByEmail(ctx.state.session.email!);

			return new Response(
				JSON.stringify({
					isAuthenticated: true,
					user: user || null,
				}),
				{
					headers: { "Content-Type": "application/json" },
				},
			);
		} catch (error) {
			return new Response(
				JSON.stringify({
					isAuthenticated: false,
					error: "Failed to fetch session",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	},
};
