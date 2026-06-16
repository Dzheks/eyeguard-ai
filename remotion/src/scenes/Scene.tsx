import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface SceneProps {
  image: string;
  label: string;
  caption: string;
  /** Ken Burns direction: "zoom-in" | "zoom-out" | "pan-right" | "pan-left" */
  kenBurns?: "zoom-in" | "zoom-out" | "pan-right" | "pan-left";
  /** Delay label appear (frames) */
  labelDelay?: number;
}

export const Scene: React.FC<SceneProps> = ({
  image,
  label,
  caption,
  kenBurns = "zoom-in",
  labelDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  let scaleX = 1;
  let scaleY = 1;
  let translateX = 0;
  let translateY = 0;

  if (kenBurns === "zoom-in") {
    const scale = interpolate(progress, [0, 1], [1, 1.08]);
    scaleX = scale;
    scaleY = scale;
  } else if (kenBurns === "zoom-out") {
    const scale = interpolate(progress, [0, 1], [1.08, 1]);
    scaleX = scale;
    scaleY = scale;
  } else if (kenBurns === "pan-right") {
    translateX = interpolate(progress, [0, 1], [-3, 3]);
    const scale = 1.06;
    scaleX = scale;
    scaleY = scale;
  } else if (kenBurns === "pan-left") {
    translateX = interpolate(progress, [0, 1], [3, -3]);
    const scale = 1.06;
    scaleX = scale;
    scaleY = scale;
  }

  const labelOpacity = interpolate(
    frame,
    [labelDelay, labelDelay + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const labelY = interpolate(
    frame,
    [labelDelay, labelDelay + 10],
    [14, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const captionOpacity = interpolate(
    frame,
    [labelDelay + 6, labelDelay + 16],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Background photo with Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `scale(${scaleX}, ${scaleY}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: "center center",
        }}
      >
        <img
          src={staticFile(`kira/${image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </AbsoluteFill>

      {/* Gradient overlay bottom */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 38%, transparent 65%)",
        }}
      />

      {/* Labels */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 52px 120px 52px",
        }}
      >
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {label}
          </div>
          <div
            style={{
              opacity: captionOpacity,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
              maxWidth: 480,
            }}
          >
            {caption}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
