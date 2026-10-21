import sharp from "sharp";
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
 */

/** 16:10, the frame every card and banner draws. Wide enough for a 600px card on a sharp screen. */
const WIDTH = 1200;
const HEIGHT = 750;

export const revalidate = 86400;

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
    const cut = await sharp(Buffer.from(await res.arrayBuffer()), { limitInputPixels: false })
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
      .webp({ quality: 66 })
      .toBuffer();
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
