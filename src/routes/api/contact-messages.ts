import { createFileRoute } from "@tanstack/react-router";
import { deleteContactMessage, jsonError, listContactMessages, requireAdminOr401 } from "@/backend";

export const Route = createFileRoute("/api/contact-messages")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        return Response.json(await listContactMessages());
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Message id is required.");
        await deleteContactMessage(id);
        return Response.json({ success: true });
      },
    },
  },
});
