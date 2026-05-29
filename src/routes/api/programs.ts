import { createFileRoute } from "@tanstack/react-router";
import { deleteProgram, jsonError, listPrograms, requireAdminOr401, saveProgram } from "@/lib/backend";

export const Route = createFileRoute("/api/programs")({
  server: {
    handlers: {
      GET: async () => Response.json(await listPrograms()),
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const program = await saveProgram(await request.json());
        return Response.json({ success: true, program });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const program = await saveProgram(await request.json());
        if (!program) return jsonError("Program not found.", 404);
        return Response.json({ success: true, program });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Program id is required.");
        await deleteProgram(id);
        return Response.json({ success: true });
      },
    },
  },
});
