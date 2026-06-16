import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface TransitionProps {
  type?: "fade" | "slide-up";
}

export const FadeTransition: React.FC<TransitionProps> = ({ type = "fade" }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 10, 20], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
