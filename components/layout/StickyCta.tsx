"use client";

import { useEffect, useState } from "react";
import { cta } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** One primary CTA pinned to the bottom of small screens once the hero has scrolled away. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const brief = document.getElementById("brief");
    if (!hero || !brief) return;
    let heroOut = false;
    let briefIn = false;
    const update = () => setVisible(heroOut && !briefIn);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) heroOut = !e.isIntersecting;
          if (e.target === brief) briefIn = e.isIntersecting;
        }
        update();
      },
      { threshold: 0.05 },
    );
    io.observe(hero);
    io.observe(brief);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur-[2px] transition-transform duration-300 ease-[var(--ease-out-quart)] sm:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <Button href={cta.primary.href} className="w-full" tabIndex={visible ? 0 : -1}>
        {cta.primary.label}
      </Button>
    </div>
  );
}
