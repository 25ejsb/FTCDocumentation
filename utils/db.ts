export const kv = await Deno.openKv(Deno.env.get("KV_DATABASE") as string);

export interface User {
  id: string;
  email: string;
  username?: string;
  password: string;
}

export interface Session {
  id: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

export interface Code {
  code: number;
  date: Date;
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const id = crypto.randomUUID();
  const newUser = { ...user, id };
  await kv.set(["users", newUser.email], newUser);
  await kv.set(["usernames", newUser.username as string], {
    username: newUser.username,
  });
  return newUser;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  // better way to initialize user
  const result = await kv.get<User>(["users", email]);
  return result.value;
}

export async function createSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const now = Date.now();

  const session: Session = {
    id: sessionId,
    email,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
  };

  await kv.set(["sessions", sessionId], session);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const result = await kv.get<Session>(["sessions", sessionId]);
  const session = result.value;

  // check if expire is passed so it can delete the session
  if (!session || session.expiresAt < Date.now()) {
    if (session) await kv.delete(["sessions", sessionId]);
    return null;
  }

  return session;
}

export async function destroySession(sessionId: string): Promise<void> {
  await kv.delete(["sessions", sessionId]);
}

export async function createCode(email: string): Promise<number> {
  const code = Math.round(Math.random() * (999999 - 100000) + 100000);
  if (await kv.get(["codes", email])) {
    await kv.delete(["codes", email]);
  }

  await kv.set(["codes", email], { code: code, date: Date.now() });
  return code;
}
