import { cn } from "@/lib/utils";

/**
 * The floating reCAPTCHA badge is hidden (globals.css) so it does not sit on
 * the corner buttons. Google allows that only when the form itself says
 * reCAPTCHA protects it and links to Google's policies — which is this line.
 */
export function RecaptchaNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-[12px] leading-relaxed text-muted", className)}>
      This site is protected by reCAPTCHA and the Google{" "}
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
