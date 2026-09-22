"use client";

import { useEffect } from "react";

/**
 * Sets the browser tab's title from inside a page that cannot export metadata —
 * the 404, which Next renders under the root layout's title. The page is
 * noindex, so only the visitor's tab needs to read right.
 */
export function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
