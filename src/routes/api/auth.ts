import { createFileRoute } from "@tanstack/react-router";
import { createAdminToken, getAdminByEmail, hashPassword, jsonError } from "@/backend";

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD_HASH = "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2";

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { email?: string; password?: string };
        const email = body.email?.trim();
        const password = body.password ?? "";

        if (!email || !password) {
          return jsonError("Email and password are required.");
        }

        const runtimeEnv = (globalThis as typeof globalThis & { __APP_ENV__?: Record<string, string> }).__APP_ENV__;
        const passwordHash = await hashPassword(password);
        const envEmail = typeof process !== "undefined" ? process.env.ADMIN_EMAIL : undefined || runtimeEnv?.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
        const envPassword = typeof process !== "undefined" ? process.env.ADMIN_PASSWORD : undefined || runtimeEnv?.ADMIN_PASSWORD;
        const envPasswordHash = typeof process !== "undefined" ? process.env.ADMIN_PASSWORD_HASH : undefined || runtimeEnv?.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_PASSWORD_HASH;
        const validEnvLogin =
          !!envEmail &&
          email.toLowerCase() === envEmail.toLowerCase() &&
          ((!!envPassword && password === envPassword) || (!!envPasswordHash && passwordHash === envPasswordHash));

        let admin: { email: string; password_hash: string } | undefined;

        if (!validEnvLogin) {
          try {
            admin = await getAdminByEmail(email);
          } catch (error) {
            if (!(error instanceof Error) || !error.message.includes("DATABASE_URL is missing")) {
              console.error("Admin lookup failed", error);
            }
          }
        }

        const validDatabaseLogin = !validEnvLogin && admin && admin.password_hash === passwordHash;

        if (!validEnvLogin && !validDatabaseLogin) {
          return jsonError("Email or password is incorrect.", 401);
        }

        const adminEmail = admin?.email ?? envEmail;
        return Response.json({
          success: true,
          token: await createAdminToken(adminEmail),
          email: adminEmail,
        });
      },
    },
  },
});
