import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import isLength from "https://deno.land/x/deno_validator@v0.0.5/lib/isLength.ts";
import { comparePassword, hashPassword } from "../../utils/auth.ts";
import {
	createSession,
	createUser,
	findUserByEmail,
	kv,
} from "../../utils/db.ts";
import isAlphanumeric from "https://deno.land/x/deno_validator@v0.0.5/lib/isAlphanumeric.ts";

interface CodeData {
	code: string;
	date: number;
}

export const handler: Handlers = {
	async POST(req, res) {
		const formData = await req.formData();

		const email = formData.get("email")?.toString();
		const username = formData.get("username")?.toString();
		const password = formData.get("password")?.toString();
		const passedCode = formData.get("code")?.toString();

		if (!email || !username || !password) {
			return new Response("Missing Username, Email or Password", {
				status: 404,
			});
		}

		const code = await kv.get<CodeData>(["codes", email]);

		if (!code) {
			return new Response("Code is Missing", { status: 404 });
		}

		const codeDate = code.value?.date as number;
		const currentDate = new Date();

		const time = 10 * 60 * 1000;
		const difference = Math.abs(
			currentDate.getTime() - new Date(codeDate).getTime(),
		);

		if (difference > time) {
			await kv.delete(["codes", email]);
			return Response.json(null, {
				status: 303,
				headers: {
					"Location": `/auth/Authorize?data=${
						encodeURIComponent(
							JSON.stringify({
								email: email,
								username: username,
								password: password,
								error:
									"The code has expired, since it has been over 10 minutes",
							}),
						)
					}`,
				},
			});
		}

		if (
			parseInt(code.value?.code as string) ==
				parseInt(passedCode as string)
		) {
			if (
				!isLength(username, { min: 4, max: 20 }) ||
				!isAlphanumeric(username)
			) {
				return new Response(
					"The username must be between lengths 4-20, and the username should be alphanumeric",
					{ status: 400 },
				);
			}

			if ((await kv.get(["usernames", username])).value) {
				return new Response(
					"Username already is used by another account",
					{
						status: 400,
					},
				);
			}

			const existingUser = await findUserByEmail(email);
			if (existingUser) {
				return new Response("Email already Exists!", { status: 404 });
			}

			await kv.delete(["codes", email]);

			const hashedPassword = await hashPassword(password);
			const user = await createUser({
				email,
				username: username,
				password: hashedPassword,
			});

			const sessionId = await createSession(user.email);

			const res = new Response("Success!", {
				status: 301,
				headers: { "Location": "/" },
			});

			setCookie(res.headers, {
				name: "session_id",
				value: sessionId,
				path: "/",
				maxAge: 24 * 60 * 60,
			});
			return res;
		} else {
			return Response.json(null, {
				status: 303,
				headers: {
					"Location": `/auth/Authorize?data=${
						encodeURIComponent(
							JSON.stringify({
								email: email,
								username: username,
								password: password,
								error: "The code you sent is invalid.",
							}),
						)
					}`,
				},
			});
		}
	},
};
