import { createFileRoute } from "@tanstack/react-router";
import { createAdminToken, getAdminByEmail, hashPassword, jsonError } from "@/backend";

const DEFAULT_ADMIN_EMAIL = "uyisenga@gmail.com";
const DEFAULT_ADMIN_PASSWORD_HASH = "d44f65130d376e81159d6fb9aa764c198ac7449cd55d86878f0e97078d55a90d";

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
        const envEmail = readEnv("ADMIN_EMAIL") ?? DEFAULT_ADMIN_EMAIL;
        const envPassword = readEnv("ADMIN_PASSWORD");
        const envPasswordHash = readEnv("ADMIN_PASSWORD_HASH") ?? DEFAULT_ADMIN_PASSWORD_HASH;
        const validEnvLogin =
          email.toLowerCase() === envEmail.toLowerCase() &&
          ((!!envPassword && password === envPassword) || passwordHash === envPasswordHash);

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
