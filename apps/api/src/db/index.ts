import { env } from "../config/env";
import type { DbAdapter } from "./types";
import { MemoryDbAdapter } from "./memoryAdapter";

let adapter: DbAdapter;

export function getDb(): DbAdapter {
  if (adapter) return adapter;

  if (env.dbDriver === "firestore") {
    // Lazily required so the project runs (and `npm run simulate` works)
    // even when firebase-admin has no credentials configured.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { FirestoreDbAdapter } = require("./firestoreAdapter");
    adapter = new FirestoreDbAdapter();
  } else {
    adapter = new MemoryDbAdapter();
  }
  return adapter;
}
