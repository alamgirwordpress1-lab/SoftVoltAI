import { cms } from "@/lib/cms";

/**
 * /shots/<case-study>.webp: the top of a case study's full-page screenshot.
 *
 * The screenshots in WordPress are whole pages, 300 to 550 kB each even after
 * next/image has resized them. The cards on the home page and /case-studies,
 * the banner of each case study and its "related" cards only show the top
 * 16:10 of it until someone hovers, so that is all they load: this cut, about
 * 25–85 kB, under the 100 kB a crawler flags. The whole page is fetched on
 * hover (components/ui/ScreenshotPan). A phone, which cannot hover, never
 * downloads it at all.
 *
 * Every case study is cut at build time and kept for a day; one added later is
 * cut on its first request.
 *
 * The cut is made by whatever the server has: on Cloudflare Workers (the live
 * site) that is the Images binding, because sharp is a native module and cannot
 * load there; on Vercel or a local build it is sharp. If neither works the card
 * is sent to the full picture, never to a broken image.
 */

/** 16:10, the frame every card and banner draws. Wide enough for a 600px card on a sharp screen. */
const WIDTH = 1200;
const HEIGHT = 750;

export const revalidate = 86400;

/** The part of Cloudflare's Images binding this route uses (wrangler.jsonc: "images": { "binding": "IMAGES" }). */
interface ImagesLike {
  input(stream: ReadableStream<Uint8Array>): {
    transform(t: { width: number; height: number; fit: "cover"; gravity: "top" }): {
      output(o: { format: "image/webp"; quality: number }): Promise<{ response(): Response }>;
    };
  };
}

async function cutOnCloudflare(bytes: ArrayBuffer): Promise<Uint8Array<ArrayBuffer> | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const images = (getCloudflareContext().env as { IMAGES?: unknown }).IMAGES as ImagesLike | undefined;
    if (!images) return null;
    const body = new Response(bytes).body;
    if (!body) return null;
    const out = await images
      .input(body)
      .transform({ width: WIDTH, height: HEIGHT, fit: "cover", gravity: "top" })
      .output({ format: "image/webp", quality: 66 });
    return new Uint8Array(await out.response().arrayBuffer());
  } catch {
    return null; // not on Workers, or the binding refused: try sharp
  }
}

async function cutWithSharp(bytes: ArrayBuffer): Promise<Uint8Array<ArrayBuffer>> {
  const { default: sharp } = await import("sharp");
  const cut = await sharp(Buffer.from(bytes), { limitInputPixels: false })
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .webp({ quality: 66 })
    .toBuffer();
  return new Uint8Array(cut);
}

export async function generateStaticParams() {
  const work = await cms.getWork();
  return work.filter((w) => w.thumb).map((w) => ({ file: `${w.slug}.webp` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.webp$/i, "");
  const item = (await cms.getWork()).find((w) => w.slug === slug);
  if (!item?.image || !/^https?:\/\//.test(item.image)) return new Response("Not found", { status: 404 });

  try {
    const res = await fetch(item.image, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`${res.status} for ${item.image}`);
    const bytes = await res.arrayBuffer();
    const cut = (await cutOnCloudflare(bytes)) ?? (await cutWithSharp(bytes));
    return new Response(new Uint8Array(cut), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    // a card with the full picture is better than a card with a broken one
    console.warn(`[shots] ${slug}: ${error instanceof Error ? error.message : error}`);
    return Response.redirect(item.image, 302);
  }
}
