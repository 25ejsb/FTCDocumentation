export const kv = await Deno.openKv(Deno.env.get("KV_DATABASE") as string);
import isAlphanumeric from "https://deno.land/x/deno_validator@v0.0.5/lib/isAlphanumeric.ts";
import { isLength } from "https://deno.land/x/deno_validator@v0.0.5/mod.ts";

export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    profilePicture?: string;
    description?: string;
    admin: boolean;
}

export interface Session {
    id: string;
    email: string;
    createdAt: number;
    expiresAt: number;
}

export interface Draft {
    id: string;
    name: string;
    ownerEmail: string;
    html: string;
    sectionId: string;
    sectionName?: string;
}

export interface Code {
    code: number;
    date: Date;
}

export interface Section {
    id: string;
    name: string;
    position: number;
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
    const id = crypto.randomUUID();
    const newUser = { ...user, id, profilePicture: "./images/rabbi.webp" };
    await kv.set(["usernames", newUser.username], {
        email: newUser.email,
        username: newUser.username,
    });
    await kv.set(["users", newUser.email], newUser);
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
        expiresAt: now + 12 * 30 * 24 * 60 * 60 * 1000, // 1 year
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

export async function createSection(section: Section) {
    const allEntries = await Array.fromAsync(kv.list<Section>({ prefix: ["sections"] }));
    const positions: Array<number> = allEntries.map((thissection) => thissection.value.position);
    await kv.set(["sections", section.id], { ...section });
}

export async function createDraft(draft: Draft) {
    await kv.set(["drafts", draft.id], { ...draft, sectionName: (await kv.get<Section>(["sections", draft.sectionId])).value?.name });
}
