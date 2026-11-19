import { test } from "node:test";
import assert from "node:assert/strict";
import { teamPhotoUrl } from "./team-photo";

test("editing a team member changes its photo URL without replacing its ID", () => {
  const original = teamPhotoUrl(18, "2026-11-19T13:00:00.000Z");
  const edited = teamPhotoUrl(18, "2026-11-19T13:04:00.000Z");
  assert.notEqual(edited, original);
  assert.equal(new URL(edited, "https://example.org").pathname, "/api/team/photo/18");
});

test("unchanged team revisions keep the same cached photo URL", () => {
  assert.equal(teamPhotoUrl(18, "2026-11-19T13:04:00.000Z"),
    teamPhotoUrl(18, "2026-11-19T13:04:00.000Z"),
  );
});