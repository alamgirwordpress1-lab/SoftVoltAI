"use client";

import { useState } from "react";
import { HeroBench } from "@/components/sections/HeroBench";
import { RebrandField, BRAND_PRESETS } from "@/components/sections/RebrandField";
import type { DemoCopy } from "@/lib/cms/copy-types";
import "./hero.css";

/**
 * White-label, demonstrated: the visitor types their agency name and the
 * finished client site credits them, while a lens shows the engine room
 * underneath — the staging server, commits and QA the client never sees.
 */
export function EngineRoomDemo({ copy }: { copy: DemoCopy }) {
  const [agency, setAgency] = useState(copy.sample_name || "Northwind Digital");
  const [brand, setBrand] = useState<string>(BRAND_PRESETS[0]);

  return (
    <section id="white-label-demo" className="section relative overflow-hidden" aria-labelledby="demo-title">
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6" data-reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="demo-title" className="display display-lg mt-4">
              {copy.heading}
            </h2>
            <p className="lede mt-5">{copy.lede}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
            <RebrandField name={agency} color={brand} onName={setAgency} onColor={setBrand} label={copy.field_label} colourLabel={copy.colour_label} />
            {copy.note ? <p className="mono mt-3 text-[11px] uppercase tracking-[0.1em] text-muted">{copy.note}</p> : null}
          </div>
        </div>

        <HeroBench agency={agency} brand={brand} site={copy} />
        <p className="sr-only">
          Illustration: a finished client website credited to your agency, with a lens revealing the staging server, code,
          commits and QA checks underneath.
        </p>
      </div>
    </section>
  );
}
