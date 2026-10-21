import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * next/image filling its positioned frame, the way `fill` does, but with width
 * and height attributes on the <img>.
 *
 * `fill` drops both attributes, and Screaming Frog (and Lighthouse) report
 * every such picture as "missing size attributes". Here the two numbers only
 * give the picture its proportions; the classes stretch it over the frame and
 * `sizes` still picks the file, so nothing on screen changes. Pass the frame's
 * own proportions when they are not 16:10.
 */
export function CoverImage({ alt, className, width = 1600, height = 1000, ...props }: Omit<ImageProps, "fill" | "width" | "height"> & { width?: number; height?: number }) {
  return <Image {...props} alt={alt} width={width} height={height} className={cn("absolute inset-0 h-full w-full", className)} />;
}
