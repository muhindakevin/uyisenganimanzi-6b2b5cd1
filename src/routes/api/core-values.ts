import { createFileRoute } from "@tanstack/react-router";
import { deleteCoreValue, jsonError, listCoreValues, requireAdminOr401, saveCoreValue } from "@/backend";

export const Route = createFileRoute("/api/core-values")({
  server: {
    handlers: {
      GET: async () => Response.json(await listCoreValues()),
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        try {
          const item = await saveCoreValue(await request.json());
          return Response.json({ success: true, item });
        } catch (e) {
          return jsonError(e instanceof Error ? e.message : "Unable to save.", 400);
        }
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await saveCoreValue(await request.json());
        if (!item) return jsonError("Core value not found.", 404);
        return Response.json({ success: true, item });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Core value id is required.");
        await deleteCoreValue(id);
        return Response.json({ success: true });
      },
    },
  },
});
