import { createFileRoute } from "@tanstack/react-router";
import { deleteSubProgram, jsonError, listSubPrograms, requireAdminOr401, saveSubProgram } from "@/backend";

export const Route = createFileRoute("/api/sub-programs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const pid = url.searchParams.get("program_id");
        return Response.json(await listSubPrograms(pid ? Number(pid) : null));
      },
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await saveSubProgram(await request.json());
        return Response.json({ success: true, item });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await saveSubProgram(await request.json());
        if (!item) return jsonError("Sub-program not found.", 404);
        return Response.json({ success: true, item });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Sub-program id is required.");
        await deleteSubProgram(id);
        return Response.json({ success: true });
      },
    },
  },
});
