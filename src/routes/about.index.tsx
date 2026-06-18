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

const DEFAULT_CONTENT: Content = {
  storyTitle: "Our story since 2002",
  storyText:
    "Uyisenga Ni Imanzi (UNM) was founded in 2002, with a mission to provide orphans from the genocide and HIV/AIDS with social services, education and income-generating opportunities. UNM was established to implement child- and youth-focused programs that address their special needs.\n\nAfter two years of concerted efforts, it became clear that these children were too traumatized to fully participate in or benefit from the programs offered. With the addition of psychosocial and health services in 2004, UNM expanded and strengthened its activities greatly—especially in Kigali City and the Southern and Eastern Provinces.\n\nIn recognition of the needs of orphans in Rwanda, the Ministerial Decree granting legal entity to the Association Uyisenga Ni Imanzi is N° 70/11 of 10th August 2005, published in October 2005. Several awards have crowned UNM's activities, mainly in the fight against HIV/AIDS among youth, the care of children, and the promotion of children's rights.\n\nUNM is an active member of local and international umbrellas: Ibuka, Rwanda NGO Forum on AIDS and Health Promotion, the International Rehabilitation Council for Torture Victims, and Family for Every Child.",
  storyImage: "",
};

function OurStory() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const about = data?.about || {};
        setContent({
          storyTitle: typeof about?.storyTitle === "string" ? about.storyTitle : DEFAULT_CONTENT.storyTitle,
          storyText: typeof about?.storyText === "string" ? about.storyText : DEFAULT_CONTENT.storyText,
          storyImage: typeof about?.storyImage === "string" ? about.storyImage : DEFAULT_CONTENT.storyImage,
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
