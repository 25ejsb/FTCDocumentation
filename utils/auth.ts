import { compare, hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export async function hashPassword(password: string): Promise<string> {
	return await hash(password);
}

export async function comparePassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await compare(password, hashedPassword);
}
