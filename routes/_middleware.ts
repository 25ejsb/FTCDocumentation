import { FreshContext } from "$fresh/server.ts";
import { getSession } from "../utils/db.ts";

export interface State {
  session: {
    userId?: string;
    isAuthenticated: boolean;
  };
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const sessionId = req.headers.get("cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith("session_id="))
    ?.split("=")[1];

  if (sessionId) {
    const session = await getSession(sessionId);
    ctx.state.session = session
      ? { userId: session.userId, isAuthenticated: true }
      : { isAuthenticated: false };
  } else {
    ctx.state.session = { isAuthenticated: false };
  }

  return await ctx.next();
}
