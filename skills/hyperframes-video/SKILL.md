---
name: hyperframes-video
description: HyperFrames composition and video rendering pipeline using HTML5, CSS, SVG, and GSAP.
---

# HyperFrames Video Production Skill

HyperFrames turns web-native compositions into frame-accurate rendered video using HTML, CSS, JavaScript, GSAP timelines, and headless browser capture.

## Core Architecture

1. **Root Composition (`index.html`)**:
   - Holds the main container `<div id="root" data-composition-id="main" data-start="0" data-duration="TOTAL_SECONDS">`
   - Orchestrates multi-scene sub-compositions or child clips
   - Hosts continuous background audio tracks `<audio data-start="0" data-duration="TOTAL_SECONDS">`
   - Declares the root paused GSAP timeline:
     ```js
     window.__timelines = window.__timelines || {};
     window.__timelines["main"] = gsap.timeline({ paused: true });
     ```

2. **Sub-Compositions (`compositions/*.html`)**:
   - Referenced in root via `<div class="scene-host clip" data-composition-src="compositions/scene1.html" data-start="0" data-duration="60"></div>`
   - Encapsulates isolated visual elements, local styling, and scene-specific timelines.

3. **Key Timed Attributes**:
   - `data-start`: Start time in seconds (float or integer).
   - `data-duration`: Duration in seconds.
   - `data-track-index`: Visual layer ordering in HyperFrames Studio.
   - `class="clip"`: Standard full-frame layout container.

4. **Seek-Safe Animation Rules**:
   - **Deterministic only**: No `Math.random()`, no `Date.now()`, no live network fetches during playback.
   - Timelines must register on `window.__timelines` so the frame renderer can seek precisely to timestamp `t`.
   - Audio elements must use `data-start` and explicit durations.
