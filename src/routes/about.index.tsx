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
    <>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">{content.storyTitle}</h2>
        <div className="mt-6 space-y-5 text-base text-muted-foreground sm:text-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
      {content.storyImage ? (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <img
            src={content.storyImage}
            alt={content.storyTitle}
            loading="lazy"
            className="w-full rounded-3xl object-cover aspect-[16/9] shadow-[var(--shadow-card)]"
          />
        </section>
      ) : null}
    </>
  );
}
