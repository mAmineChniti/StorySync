import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "oklch(0.985 0.002 247.839)",
          fontFamily: "'Inter', sans-serif",
          padding: "40px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(33, 34, 101, 0.1) 0%, rgba(33, 34, 101, 0.3) 100%)",
            zIndex: 1,
          }}
        />

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "oklch(0.13 0.028 261.692)",
            marginBottom: "20px",
            maxWidth: "80%",
            lineHeight: 1.2,
            zIndex: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          StorySync
        </h1>

        <p
          style={{
            fontSize: 36,
            color: "oklch(0.551 0.027 264.364)",
            maxWidth: "70%",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          Create, Share, and Collaborate on Stories
        </p>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            fontSize: 24,
            color: "oklch(0.21 0.034 264.665)",
            zIndex: 2,
          }}
        >
          Collaborative Storytelling
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
