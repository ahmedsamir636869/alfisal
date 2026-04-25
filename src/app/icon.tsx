import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
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
            fontSize: 108,
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1,
            letterSpacing: "-4px",
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size }
  );
}
