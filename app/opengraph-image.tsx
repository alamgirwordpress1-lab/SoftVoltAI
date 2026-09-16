import { ImageResponse } from "next/og";

export const alt = "SoftVolt AI — You win the client. We deliver the work. Your brand gets the credit.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: "radial-gradient(circle at 85% 10%, rgba(101,245,69,0.22), rgba(14,20,17,0) 45%), #0e1411",
          color: "#f2f4f1",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect x="2" y="2" width="60" height="60" rx="16" fill="#1a211d" stroke="#2a352f" strokeWidth="1" />
            <path d="M35 9 17 35h12l-3 20 19-26H33l2-20Z" fill="#65f545" />
            <path d="M38 10.5h7" stroke="#65f545" strokeWidth="2" strokeLinecap="round" />
            <circle cx="49.5" cy="10.5" r="4" fill="#1a211d" stroke="#65f545" strokeWidth="2" />
            <circle cx="49.5" cy="10.5" r="1.5" fill="#65f545" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontFamily: "sans-serif", fontWeight: 600, letterSpacing: -1 }}>
            SoftVolt<span style={{ color: "#65f545", marginLeft: 10 }}>AI</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 82, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>You win the client.</span>
          <span>We deliver the work.</span>
          <span style={{ color: "#65f545" }}>Your brand gets the credit.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#9aa59e", fontFamily: "sans-serif" }}>
          White-label WordPress · Next.js · Payload · Shopify · AI automation · SEO · Paid media — softvoltai.com
        </div>
      </div>
    ),
    size,
  );
}
