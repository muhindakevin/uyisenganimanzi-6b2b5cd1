import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/about/")({
  component: OurStory,
});

type Content = {
  storyTitle: string;
  storyText: string;
  storyImage: string;
};

const EMPTY_CONTENT: Content = {
  storyTitle: "",
  storyText: "",
  storyImage: "",
};

function OurStory() {
  const [content, setContent] = useState<Content>(EMPTY_CONTENT);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const about = data?.about || {};
        setContent({
          storyTitle: typeof about?.storyTitle === "string" ? about.storyTitle : "",
          storyText: typeof about?.storyText === "string" ? about.storyText : "",
          storyImage: typeof about?.storyImage === "string" ? about.storyImage : "",
        });
      })
      .catch(() => {});
  }, []);

  const paragraphs = content.storyText.split(/\r?\n\r?\n/).filter(Boolean);

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {content.storyTitle}
      </h2>

      {content.storyImage ? (
        <figure className="mt-8 overflow-hidden rounded-3xl border border-border bg-muted shadow-[var(--shadow-card)]">
          <img
            src={content.storyImage}
            alt={content.storyTitle}
            loading="lazy"
            className="h-auto w-full object-cover aspect-[16/9]"
          />
        </figure>
      ) : null}

      <div className="mt-8 space-y-5 text-base leading-8 text-foreground/85 sm:text-lg">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
