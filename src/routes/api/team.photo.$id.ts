import { createFileRoute } from "@tanstack/react-router";
import { getTeamMemberPhoto } from "@/backend";

export const Route = createFileRoute("/api/team/photo/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = Number(params.id);
        if (!Number.isFinite(id)) return new Response("Bad id", { status: 400 });
        const photo = await getTeamMemberPhoto(id);
        if (!photo) return new Response("Not found", { status: 404 });

        // Photo is stored as a data URL (data:image/...;base64,XXXX). Decode
        // and stream as a real image so browsers cache it and the response
        // stays small per-request.
        const match = /^data:([^;]+);base64,(.+)$/.exec(photo);
        if (!match) {
          // Fallback: assume it's already a URL — redirect.
          return Response.redirect(photo, 302);
        }
        const mime = match[1];
        const bin = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
        return new Response(bin, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
