import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { eventsRouter } from "./routes/events";
import { ordersRouter } from "./routes/orders";
import { mpesaRouter } from "./routes/mpesa";
import { sellersRouter } from "./routes/sellers";
import { ticketsRouter } from "./routes/tickets";
import { posRouter } from "./routes/pos";
import { adminRouter } from "./routes/admin";
import { chatbotRouter } from "./routes/chatbot";
import { contactRouter } from "./routes/contact";
import { supportRouter } from "./routes/support";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  if (env.nodeEnv !== "test") app.use(morgan("dev"));

  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, dbDriver: env.dbDriver, mpesaMode: env.mpesaMode, time: new Date().toISOString() })
  );

  app.use("/api/events", eventsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/mpesa", mpesaRouter);
  app.use("/api/sellers", sellersRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/api/pos", posRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/chatbot", chatbotRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/support", supportRouter);

  app.use((_req, res) => res.status(404).json({ error: "Not found" }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
