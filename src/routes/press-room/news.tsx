import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/press-room/news")({
  component: NewsLayout,
});

function NewsLayout() {
  return <Outlet />;
}
