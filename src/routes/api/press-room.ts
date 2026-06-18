import { createFileRoute } from "@tanstack/react-router";
import { deletePressRoomItem, jsonError, listPressRoom, requireAdminOr401, savePressRoomItem } from "@/backend";

export const Route = createFileRoute("/api/press-room")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const limit = url.searchParams.get("limit");
        return Response.json(
          await listPressRoom(url.searchParams.get("category"), limit ? Number(limit) : null),
        );
      },
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await savePressRoomItem(await request.json());
        return Response.json({ success: true, item });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await savePressRoomItem(await request.json());
        if (!item) return jsonError("Press room item not found.", 404);
        return Response.json({ success: true, item });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Press room item id is required.");
        await deletePressRoomItem(id);
        return Response.json({ success: true });
      },
    },
  },
});
