import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VoiceApp — транскрипция, сводка и чат с аудио";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(91 64 192) 0%, rgb(15 14 25) 50%, rgb(8 8 12) 100%)",
          color: "white",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "24px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Voice</span>
          <span
            style={{
              fontWeight: 600,
              background: "linear-gradient(90deg, #c4b5fd, #f0abfc)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            App
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              alignSelf: "flex-start",
              fontSize: "16px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "rgb(167 139 250)",
              }}
            />
            🇰🇿 Сделано в Казахстане · 10 минут бесплатно
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "92px",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            <span>Спроси у своей</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #c4b5fd, #f0abfc, #c4b5fd)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                marginLeft: "20px",
              }}
            >
              записи
            </span>
            <span style={{ color: "rgb(150 150 160)" }}>.</span>
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "rgb(180 180 200)",
              maxWidth: "900px",
            }}
          >
            Транскрипт со спикерами, краткое содержание и чат по содержимому. Подписка от 1 990 ₸/мес.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "16px",
            color: "rgb(140 140 160)",
          }}
        >
          <span>voiceapp-zeta.vercel.app</span>
          <span>AssemblyAI · Anthropic Claude · Supabase</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
