import path from "node:path";
import express from "express";
import client from "prom-client";

const app = express();

// process.cwd()基準。yarn dev/start、Dockerfileのnode dist/index.jsのいずれも
// アプリのルートディレクトリから実行される前提。
app.use(express.static(path.join(process.cwd(), "public")));

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "apple_http_requests_total",
  help: "Total number of HTTP requests handled by apple",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: String(res.statusCode),
    });
  });
  next();
});

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.get("/api/hello", (_req, res) => {
  res.json({ message: "hello from apple", timestamp: new Date().toISOString() });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`apple listening on :${port}`);
});
