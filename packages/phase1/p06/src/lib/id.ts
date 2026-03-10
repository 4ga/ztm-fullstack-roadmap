import crypto from "node:crypto";

export type IdGenerator = () => string;
export const randomId: IdGenerator = () => crypto.randomUUID();
