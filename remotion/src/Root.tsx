import React from "react";
import { Composition } from "remotion";
import { KiraReel, TOTAL, FPS } from "./KiraReel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KiraDayInLife"
      component={KiraReel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
