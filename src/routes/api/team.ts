import { createFileRoute } from "@tanstack/react-router";
import { deleteTeamMember, jsonError, listTeam, requireAdmin, requireAdminOr401, saveTeamMember } from "@/backend";

export const Route = createFileRoute("/api/team")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const members = await listTeam();
          if (await requireAdmin(request)) return Response.json(members);
          // Public callers get only non-sensitive fields (no email/phone).
          return Response.json(members.map(({ email: _e, phone: _p, ...rest }) => rest));
        } catch (err) {
          console.error("GET /api/team failed:", err);
          return jsonError("Failed to load team.", 500);
        }
      },
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const member = await saveTeamMember(await request.json());
        return Response.json({ success: true, member });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const member = await saveTeamMember(await request.json());
        if (!member) return jsonError("Team member not found.", 404);
        return Response.json({ success: true, member });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Team member id is required.");
        await deleteTeamMember(id);
        return Response.json({ success: true });
      },
    },
  },
});
