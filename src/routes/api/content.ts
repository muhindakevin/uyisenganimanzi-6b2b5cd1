import { createFileRoute } from "@tanstack/react-router";
import { getSiteContent, requireAdminOr401, updateSiteContent } from "@/lib/backend";

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async () => Response.json(await getSiteContent()),
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        return Response.json({ success: true, content: await updateSiteContent(await request.json()) });
      },
    },
  },
});
