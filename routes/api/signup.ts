import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { comparePassword, hashPassword } from "../../utils/auth.ts";
import {
  createSession,
  createUser,
  findUserByEmail,
  kv,
} from "../../utils/db.ts";

interface CodeData {
  code: string;
  date: number;
}

export const handler: Handlers = {
  async POST(req, res) {
    const formData = await req.formData();

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const passedCode = formData.get("code")?.toString();

    if (!email || !password) {
      return new Response("Missing Email or Password", { status: 404 });
    }

    const code = await kv.get<CodeData>(["codes", email]);

    if (!code) {
      return new Response("Code is Missing", { status: 404 });
    }

    const codeDate = code.value?.date as number;
    const currentDate = new Date();

    const time = 10 * 60 * 1000;
    const difference = Math.abs(currentDate.getTime() - new Date(codeDate).getTime());

    if (difference > time) {
      await kv.delete(["codes", email]);
      return Response.json(null, {
        status: 303,
        headers: {
          "Location": `/auth/Authorize?data=${
            encodeURIComponent(
              JSON.stringify({ email: email, password: password, error: "The code has expired, since it has been over 10 minutes" }),
            )
          }`,
        },
      });
    }

    if (
      parseInt(code.value?.code as string) == parseInt(passedCode as string)
    ) {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return new Response("Email already Exists!", { status: 404 });
      }

      await kv.delete(["codes", email]);

      const hashedPassword = await hashPassword(password);
      const user = await createUser({
        email,
        password: hashedPassword,
      });

      const sessionId = await createSession(user.id);

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
              JSON.stringify({ email: email, password: password, error: "The code you sent is invalid." }),
            )
          }`,
        },
      });
    }
  },
};
