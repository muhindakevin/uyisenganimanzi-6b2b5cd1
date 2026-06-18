import { createFileRoute } from "@tanstack/react-router";
import { deleteGalleryImage, jsonError, listGallery, requireAdminOr401, saveGalleryImage } from "@/backend";

export const Route = createFileRoute("/api/gallery")({
  server: {
    handlers: {
      GET: async () => Response.json(await listGallery()),
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const image = await saveGalleryImage(await request.json());
        return Response.json({ success: true, image });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const image = await saveGalleryImage(await request.json());
        if (!image) return jsonError("Gallery image not found.", 404);
        return Response.json({ success: true, image });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Gallery image id is required.");
        await deleteGalleryImage(id);
        return Response.json({ success: true });
      },
    },
  },
});
