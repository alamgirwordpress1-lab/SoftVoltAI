import { buildSearchIndex } from "@/lib/search/build-index";

// Built once at build time and served as a static file; fetched the first time search opens.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
