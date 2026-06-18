import { createFileRoute } from "@tanstack/react-router";
import { jsonError, saveContactMessage } from "@/backend";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          name?: string;
          email?: string;
          phone?: string;
          subject?: string;
          message?: string;
        };

        if (!body.name || !body.email || !body.message) {
          return jsonError("Name, email, and message are required.");
        }

        return Response.json({ success: true, message: await saveContactMessage(body) });
      },
    },
  },
});
