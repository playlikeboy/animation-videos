---
name: remotion-video
description: React-based programmatic video rendering and animation using Remotion.
---

# Remotion Video Production Skill

Remotion enables developers to create frame-accurate MP4/WebM videos using React, TypeScript, and CSS.

## Architecture

1. **Root Configuration (`Root.tsx`)**:
   - Registers compositions with ID, component, width, height, FPS, and durationInFrames.
   ```tsx
   import { Composition } from "remotion";
   import { MainVideo } from "./MainVideo";

   export const Root = () => {
     return (
       <Composition
         id="MainVideo"
         component={MainVideo}
         durationInFrames={30 * 60} // 60s @ 30fps
         fps={30}
         width={1920}
         height={1080}
       />
     );
   };
   ```

2. **Frame-Driven Motion**:
   - `useCurrentFrame()` returns the current frame index.
   - `interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })` calculates smooth property interpolations.
   - `spring({ frame, fps, config: { damping: 12 } })` creates natural physics-based spring animations.

3. **Audio Synchronization**:
   - `<Audio src={staticFile("audio/voiceover.mp3")} startFrom={0} volume={(f) => interpolate(f, [0, 15], [0, 1])} />`
   - Precise timing alignments between visual triggers and audio beats.

4. **Rendering**:
   - Preview in browser: `npx remotion preview`
   - Render to MP4: `npx remotion render Root MainVideo out/video.mp4`
