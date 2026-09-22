import { NotFoundContent } from "@/components/sections/NotFoundContent";

/**
 * Every 404 on the site lands here: the catch-all route and each detail page
 * call notFound() inside this group, so the group's layout already draws the
 * header and the footer around it.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
