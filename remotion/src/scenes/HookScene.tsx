import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PUNCH_DURATION = 12; // frames for the punch-in zoom

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Hard punch-in zoom at the very start, settles into a slow creep
  const punchScale = interpolate(frame, [0, PUNCH_DURATION], [1.35, 1.08], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slowCreep = interpolate(
    frame,
    [PUNCH_DURATION, durationInFrames],
    [1.08, 1.16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = frame < PUNCH_DURATION ? punchScale : slowCreep;

  // Quick camera shake on impact (first few frames)
  const shakeAmount = interpolate(frame, [0, 6], [14, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const shakeX = Math.sin(frame * 3) * shakeAmount;
  const shakeY = Math.cos(frame * 4) * shakeAmount * 0.6;

  // Text slam: scale bounce in, slight overshoot
  const textSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 180 },
  });
  const textScale = interpolate(textSpring, [0, 1], [2.2, 1]);
  const textOpacity = interpolate(frame, [2, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash white on impact
  const flashOpacity = interpolate(frame, [0, 4, 10], [0.9, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  // Second line fades in slightly later
  const subOpacity = interpolate(frame, [14, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [14, 22], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile("kira/nyc-pizza.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Impact flash */}
      <AbsoluteFill
        style={{ backgroundColor: "#fff", opacity: flashOpacity, pointerEvents: "none" }}
      />

      {/* Vignette for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 32%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Slammed headline */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 64px",
        }}
      >
        <div
          style={{
            transform: `scale(${textScale})`,
            opacity: textOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 76,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              textTransform: "uppercase",
            }}
          >
            POV:
            <br />
            it's NYC
            <br />
            and pizza wins
          </div>
        </div>
      </AbsoluteFill>

      {/* Subline near bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 48px 96px 48px",
        }}
      >
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          a day in my life ↓
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
