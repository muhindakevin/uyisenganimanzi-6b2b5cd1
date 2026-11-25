import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { TestimonialVideos } from "@/frontend/components/TestimonialVideos";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | Uyisenga Ni Imanzi" },
      { name: "description", content: "Watch video testimonials from children, youth and families supported by Uyisenga Ni Imanzi." },
      { property: "og:title", content: "Testimonials | Uyisenga Ni Imanzi" },
      { property: "og:description", content: "Video testimonials from the people Uyisenga Ni Imanzi walks with." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <TestimonialVideos />
    </SiteLayout>
  ),
});
