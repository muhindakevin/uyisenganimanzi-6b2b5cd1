import { createFileRoute } from "@tanstack/react-router";
import { deleteBeneficiary, jsonError, listBeneficiaries, requireAdminOr401, saveBeneficiary } from "@/backend";

export const Route = createFileRoute("/api/beneficiaries")({
  server: {
    handlers: {
      GET: async () => Response.json(await listBeneficiaries()),
      POST: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await saveBeneficiary(await request.json());
        return Response.json({ success: true, item });
      },
      PUT: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const item = await saveBeneficiary(await request.json());
        if (!item) return jsonError("Beneficiary not found.", 404);
        return Response.json({ success: true, item });
      },
      DELETE: async ({ request }) => {
        const unauthorized = await requireAdminOr401(request);
        if (unauthorized) return unauthorized;
        const { id } = (await request.json()) as { id?: number };
        if (!id) return jsonError("Beneficiary id is required.");
        await deleteBeneficiary(id);
        return Response.json({ success: true });
      },
    },
  },
});
