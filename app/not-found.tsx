import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-x section min-h-[60vh]">
        <span className="eyebrow">404</span>
        <h1 className="display display-lg mt-4">This page is not on the staging server.</h1>
        <p className="lede mt-5">The link may be old, or the page has not shipped yet.</p>
        <Button href="/" className="mt-8">
          Back to the homepage
        </Button>
      </main>
      <SiteFooter />
    </>
  );
}
