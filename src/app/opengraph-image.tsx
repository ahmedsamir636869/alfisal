import { ImageResponse } from "next/og";

export const alt = "Alfisal — Architecture of Consequence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px 72px",
            background: "#2b3747",
            position: "relative",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {/* Subtle grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(132,163,200,0.06) 80px), " +
                "repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(132,163,200,0.06) 80px)",
            }}
          />

          {/* Top-left wordmark */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 72,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#84a3c8",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontFamily: "Georgia, serif",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Alfisal
            </span>
          </div>

          {/* Thin horizontal rule */}
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 72,
              right: 72,
              height: 1,
              background: "rgba(132,163,200,0.22)",
            }}
          />

          {/* Main headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 72,
                fontWeight: 400,
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: 820,
              }}
            >
              Architecture of Consequence.
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 22,
                color: "#84a3c8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Concept · Engineering · Delivery
            </p>
          </div>

          {/* Bottom right URL */}
          <p
            style={{
              position: "absolute",
              bottom: 56,
              right: 72,
              margin: 0,
              fontSize: 18,
              color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.05em",
            }}
          >
            alfisalcon.com
          </p>
        </div>
    ),
    {
      ...size,
    }
  );
}
