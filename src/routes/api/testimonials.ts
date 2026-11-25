import { createFileRoute } from "@tanstack/react-router";
import { deleteTestimonial, jsonError, listTestimonials, requireAdminOr401, saveTestimonial } from "@/backend";

export const Route = createFileRoute("/api/testimonials")({
  server: {
    handlers: {
      GET: async () => Response.json(await listTestimonials(), { headers: { "Cache-Control": "no-store" } }),
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        try { return Response.json({ success: true, item: await saveTestimonial(await request.json()) }); }
        catch (e) { return jsonError(e instanceof Error ? e.message : "Unable to save.", 400); }
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        try { return Response.json({ success: true, item: await saveTestimonial(await request.json()) }); }
        catch (e) { return jsonError(e instanceof Error ? e.message : "Unable to save.", 400); }
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Testimonial id is required.");
        await deleteTestimonial(id);
        return Response.json({ success: true });
      },
    },
  },
});
