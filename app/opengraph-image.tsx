import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF8EF",
        }}
      >
        <div
          style={{
            border: "6px solid #171717",
            borderRadius: 24,
            background: "#fff",
            boxShadow: "12px 12px 0 #171717",
            padding: "60px 80px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 28, fontFamily: "monospace", display: "flex" }}>VIDUN.DEV</div>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ display: "flex" }}>I BUILD</span>
            <span style={{ display: "flex" }}>SOFTWARE</span>
            <span style={{ display: "flex" }}>THAT WORKS.</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
