import { createFileRoute } from "@tanstack/react-router";
import { jsonError, requireAdminOr401, uploadTestimonialVideo } from "@/backend";

export const Route = createFileRoute("/api/testimonials/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        try {
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof File)) return jsonError("No video received.");
          return Response.json({ success: true, url: await uploadTestimonialVideo(file) });
        } catch (e) {
          return jsonError(e instanceof Error ? e.message : "Upload failed.", 400);
        }
      },
    },
  },
});
