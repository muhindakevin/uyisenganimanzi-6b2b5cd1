import { createFileRoute } from "@tanstack/react-router";
import { getMediaValue, isMediaKind } from "@/backend";

export const Route = createFileRoute("/api/media/$kind/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const kind = params.kind;
        const id = Number(params.id);
        if (!isMediaKind(kind) || !Number.isFinite(id)) return new Response("Bad request", { status: 400 });

        const value = await getMediaValue(kind, id);
        if (!value) return new Response("Not found", { status: 404 });

        const match = /^data:([^;]+);base64,(.+)$/.exec(value);
        if (!match) return Response.redirect(value, 302);

        const mime = match[1];
        const binary = atob(match[2]);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

        return new Response(bytes, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
