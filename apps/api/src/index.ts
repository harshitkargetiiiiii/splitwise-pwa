import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import authRouter from "./router/auth";
import spacesRouter from "./router/spaces";
import expensesRouter from "./router/expenses";
import settlementsRouter from "./router/settlements";
import balancesRouter from "./router/balances";
import fxRouter from "./router/fx";
import exportsRouter from "./router/exports";

export function makeApp() {
  const app = express();

  // Trust proxy to read headers correctly on Vercel/proxies
  app.set("trust proxy", 1);

  // CORS configuration - same-origin in production, explicit dev origin
  const isProduction = process.env.NODE_ENV === "production";
  const devOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
  app.use(cors({
    origin: isProduction ? true : devOrigin,
    credentials: true,
  }));

  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }));

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/spaces", spacesRouter);
  app.use("/api/spaces", expensesRouter);
  app.use("/api/spaces", settlementsRouter);
  app.use("/api/spaces", balancesRouter);
  app.use("/api/fx", fxRouter);
  app.use("/api/spaces", exportsRouter);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

// Run as standalone server if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;
  const app = makeApp();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
