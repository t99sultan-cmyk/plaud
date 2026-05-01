import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgb(91 64 192) 0%, rgb(168 85 247) 50%, rgb(217 70 239) 100%)",
          color: "white",
          borderRadius: "14px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        V
      </div>
    ),
    { ...size },
  );
}
