import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#324259",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#84a3c8",
            fontSize: 290,
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1,
            letterSpacing: "-8px",
          }}
        >
          A
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
