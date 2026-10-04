import { ImageResponse } from "next/og";
import { getPublicProjectDetail } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPublicProjectDetail(slug);
  const title = p?.title ?? slug.replace(/-/g, " ").toUpperCase();
  const tagline = p?.tagline ?? "A Vidun project.";

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
            padding: "56px 72px",
            display: "flex",
            flexDirection: "column",
            maxWidth: 1000,
          }}
        >
          <div style={{ fontSize: 26, fontFamily: "monospace", display: "flex" }}>
            VIDUN.DEV — CASE STUDY
          </div>
          <div
            style={{
              fontSize: title.length > 12 ? 64 : 88,
              fontWeight: 900,
              lineHeight: 1,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, fontFamily: "monospace", display: "flex", marginTop: 16 }}>
            {tagline.slice(0, 90)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
