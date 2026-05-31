import { createFileRoute } from "@tanstack/react-router";
import { createAdminToken, getAdminByEmail, hashPassword, jsonError } from "@/lib/backend";

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
        const envEmail = process.env.ADMIN_EMAIL || runtimeEnv?.ADMIN_EMAIL;
        const envPassword = process.env.ADMIN_PASSWORD || runtimeEnv?.ADMIN_PASSWORD;
        const validEnvLogin =
          envEmail && envPassword && email.toLowerCase() === envEmail.toLowerCase() && password === envPassword;

        const admin = validEnvLogin
          ? { email, password_hash: "" }
          : await getAdminByEmail(email);
        const validDatabaseLogin =
          !validEnvLogin && admin && admin.password_hash === (await hashPassword(password));

        if (!validEnvLogin && !validDatabaseLogin) {
          return jsonError("Email or password is incorrect.", 401);
        }

        const adminEmail = admin?.email ?? email;
        return Response.json({
          success: true,
          token: await createAdminToken(adminEmail),
          email: adminEmail,
        });
      },
    },
  },
});
