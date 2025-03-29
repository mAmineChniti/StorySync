import { StoryService } from "@/lib/requests";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StorySync Story";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { story_id: string };
}) {
  try {
    const story = await StoryService.getDetails(params.story_id);

    if (!story) {
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
              fontFamily: "sans-serif",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: 64,
                color: "oklch(0.13 0.028 261.692)",
              }}
            >
              Story Not Found
            </h1>
          </div>
        ),
        size
      );
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
            fontFamily: "sans-serif",
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
              fontSize: 64,
              fontWeight: 800,
              color: "oklch(0.13 0.028 261.692)",
              marginBottom: "15px",
              maxWidth: "80%",
              lineHeight: 1.2,
              zIndex: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {story.title}
          </h1>

          <p
            style={{
              fontSize: 36,
              color: "oklch(0.4 0.1 261.692)",
              zIndex: 2,
              maxWidth: "70%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            By {story.owner_id || "Anonymous"}
          </p>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          Error Generating Image
        </div>
      ),
      size
    );
  }
}
