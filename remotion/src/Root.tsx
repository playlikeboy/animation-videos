import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./compositions/MainVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={180} // 6 seconds @ 30 FPS
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Programmatic React Video",
          subtitle: "Remotion Meets Multi-World AI Video Workflows"
        }}
      />
    </>
  );
};
