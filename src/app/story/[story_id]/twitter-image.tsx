import { StoryService } from "@/lib/requests";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: { story_id: string };
}) {
  try {
    const story = await StoryService.getDetails(params.story_id);

    if (!story) {
      return new Response("Story Not Found", { status: 404 });
    }

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
            padding: "30px",
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
              fontSize: 48,
              fontWeight: 800,
              color: "oklch(0.13 0.028 261.692)",
              marginBottom: "15px",
              maxWidth: "80%",
              lineHeight: 1.2,
              zIndex: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {story.title}
          </h1>

          {story.description && (
            <p
              style={{
                fontSize: 24,
                color: "oklch(0.551 0.027 264.364)",
                maxWidth: "70%",
                zIndex: 2,
                textAlign: "center",
              }}
            >
              {story.description}
            </p>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 30,
              right: 30,
              fontSize: 20,
              color: "oklch(0.21 0.034 264.665)",
              zIndex: 2,
            }}
          >
            StorySync
          </div>
        </div>
      ),
      {
        width: 800,
        height: 418,
      },
    );
  } catch (error) {
    console.error("Error generating Twitter image:", error);
    return new Response("Failed to generate Twitter image", { status: 500 });
  }
}
