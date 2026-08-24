import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`PBAG API listening on :${env.port} (db=${env.dbDriver}, mpesa=${env.mpesaMode})`);
});
