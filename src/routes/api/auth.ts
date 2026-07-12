import { createFileRoute } from "@tanstack/react-router";
import { createAdminToken, getAdminByEmail, hashPassword, jsonError } from "@/backend";

function readEnv(name: string): string | undefined {
  const runtimeEnv = (globalThis as typeof globalThis & { __APP_ENV__?: Record<string, string> }).__APP_ENV__;
  const fromProcess = typeof process !== "undefined" ? process.env[name] : undefined;
  return fromProcess ?? runtimeEnv?.[name];
}

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

        const passwordHash = await hashPassword(password);
        const envEmail = readEnv("ADMIN_EMAIL");
        const envPassword = readEnv("ADMIN_PASSWORD");
        const envPasswordHash = readEnv("ADMIN_PASSWORD_HASH");
        const validEnvLogin =
          !!envEmail &&
          email.toLowerCase() === envEmail.toLowerCase() &&
          ((!!envPassword && password === envPassword) ||
            (!!envPasswordHash && passwordHash === envPasswordHash));

        let admin: { email: string; password_hash: string } | undefined;

        if (!validEnvLogin) {
          try {
            admin = await getAdminByEmail(email);
          } catch (error) {
            console.error("Admin lookup failed", error);
          }
        }

        const validDatabaseLogin = !validEnvLogin && admin && admin.password_hash === passwordHash;

        if (!validEnvLogin && !validDatabaseLogin) {
          return jsonError("Email or password is incorrect.", 401);
        }

        const adminEmail = admin?.email ?? envEmail ?? email;
        return Response.json({
          success: true,
          token: await createAdminToken(adminEmail),
          email: adminEmail,
        });
      },
    },
  },
});
