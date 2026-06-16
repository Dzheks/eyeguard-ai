import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Scene } from "./scenes/Scene";
import { FadeTransition } from "./scenes/Transition";

const FPS = 30;
const TRANSITION = 20; // frames of cross-fade overlap

// Scene durations in seconds → frames
const DURATIONS = [90, 90, 120, 90, 60]; // 3s, 3s, 4s, 3s, 2s = 15s total
const START: number[] = [];
DURATIONS.reduce((acc, d, i) => {
  START[i] = acc;
  return acc + d - (i < DURATIONS.length - 1 ? TRANSITION : 0);
}, 0);

const SCENES = [
  {
    image: "portrait-outdoor.jpg",
    label: "7:00 AM",
    caption: "Morning.",
    kenBurns: "zoom-in" as const,
  },
  {
    image: "kitchen.jpg",
    label: "Breakfast",
    caption: "Breakfast\nvibes.",
    kenBurns: "pan-right" as const,
  },
  {
    image: "portrait-side.jpg",
    label: "5K Run",
    caption: "Clear\nmind.",
    kenBurns: "pan-left" as const,
  },
  {
    image: "portrait-front.jpg",
    label: "After",
    caption: "Reset.",
    kenBurns: "zoom-out" as const,
  },
  {
    image: "portrait-outdoor.jpg",
    label: "Work mode",
    caption: "Ready\nfor the\nday.",
    kenBurns: "zoom-in" as const,
  },
];

// Total duration: last scene end
const TOTAL = START[START.length - 1] + DURATIONS[DURATIONS.length - 1];

const KiraLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "56px 52px 0 52px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
          padding: "8px 18px",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        @kira
      </div>
    </AbsoluteFill>
  );
};

export const KiraReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map((scene, i) => (
        <Sequence
          key={i}
          from={START[i]}
          durationInFrames={DURATIONS[i]}
          name={`Scene ${i + 1}`}
        >
          <Scene
            image={scene.image}
            label={scene.label}
            caption={scene.caption}
            kenBurns={scene.kenBurns}
          />
          {i < SCENES.length - 1 && (
            <Sequence
              from={DURATIONS[i] - TRANSITION}
              durationInFrames={TRANSITION}
            >
              <FadeTransition />
            </Sequence>
          )}
        </Sequence>
      ))}

      {/* Persistent @kira handle */}
      <KiraLogo />
    </AbsoluteFill>
  );
};

export { TOTAL, FPS };
