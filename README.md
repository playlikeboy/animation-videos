# 🎬 AI Animation Video Production Studio

> **Multi-World Code-First Video Production Pipeline** powered by **HyperFrames**, **Remotion**, **Neural Audio Synthesis**, and **5 Creative Video Workflows** based on [CampusLoop's AI Video Systems Research](https://campusloop.space/articles/same-ai-five-worlds-ai-video-workflows-f79721).

[![HyperFrames](https://img.shields.io/badge/Engine-HyperFrames-blue.svg)](https://github.com/heygen-com/hyperframes)
[![Remotion](https://img.shields.io/badge/Engine-Remotion-red.svg)](https://remotion.dev)
[![FFmpeg](https://img.shields.io/badge/Encoding-FFmpeg_8.0-green.svg)](https://ffmpeg.org)
[![Scripts](https://img.shields.io/badge/Scripts-53_Production_Ready-orange.svg)](scripts/SCRIPTS_CATALOG.md)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🏛️ Studio Architecture & Directory Structure

```
animation-videos/
├── audio-engine/                  # 🎙️ Studio-Grade Audio Production Suite
│   ├── tts_engine.py              # Neural Edge-TTS engine with word-level SRT timestamps
│   ├── ambient_synthesizer.py     # Procedural lavfi score generator (drones, synthwave, lofi)
│   ├── sfx_generator.py           # Procedural sound design (whooshes, risers, chimes, UI taps)
│   ├── audio_mixer.py             # Multi-track mixer with intelligent sidechain auto-ducking
│   └── generate_all_audio.py      # Batch CLI audio orchestrator
│
├── the-five-minute-rule/          # Full 5-minute animated short film (Silhouette Vector)
├── templates/                     # 🎥 Reusable starter compositions for the 5 visual worlds:
│   ├── template-hyperframes-saas/     # SaaS dashboard telemetry & window motion
│   ├── template-onetake-kinetic/      # Unbroken camera flight & kinetic typography
│   ├── template-collage-broll/        # Paper cutout stop-motion editorial metaphor
│   ├── template-claude-canvas2d/      # Hand-painted illustrated 2D mascot with line boil
│   └── template-lemo-opuscar/         # Cyberpunk neon noir cinematic code style
│
├── remotion/                      # ⚛️ React-Based Remotion Video Studio
│   ├── src/
│   │   ├── index.ts               # Remotion root registration
│   │   ├── Root.tsx               # Composition registry & dimensions
│   │   └── compositions/
│   │       └── MainVideo.tsx      # Spring physics and glassmorphic motion components
│   └── package.json
│
├── scripts/                       # 📜 53 Production Video Scripts & Storyboards
│   ├── SCRIPTS_CATALOG.md         # Master index and table of all 53 video scripts
│   ├── catalog.json               # Machine-readable script registry metadata
│   ├── build_catalog.py           # Procedural catalog builder
│   ├── 01-hyperframes-saas-explainer/    # 11 Scripts: SaaS, telemetry, PR explainers
│   ├── 02-onetake-kinetic-continuity/    # 11 Scripts: Unbroken camera, kinetic launches
│   ├── 03-collage-broll-metaphors/       # 10 Scripts: Paper collage, halftone metaphors
│   ├── 04-claude-animation-mascot-2d/    # 10 Scripts: 2D illustrated character stories
│   └── 05-lemo-opuscar-cinematic-styles/ # 11 Scripts: Code-authored cinematic film styles
│
├── skills/                        # 🧠 Antigravity & Agentic Custom Skills
│   ├── hyperframes-video/SKILL.md        # Skill: Web-native HTML/GSAP rendering
│   ├── remotion-video/SKILL.md           # Skill: Remotion React programmatic video
│   ├── onetake-continuity/SKILL.md       # Skill: Unbroken continuous motion
│   ├── collage-broll/SKILL.md            # Skill: Tactile paper collage & metaphors
│   ├── claude-animation-2d/SKILL.md      # Skill: 2D canvas character grammar
│   └── lemo-opuscar-cinematic/SKILL.md   # Skill: 10 code-authored cinematic styles
│
├── renderers/                     # ⚙️ Headless Video Rendering Pipelines
│   ├── render_html_composition.js # Chromium + FFmpeg frame-accurate seekable renderer
│   ├── batch_renderer.py          # Master CLI to render any script to MP4
│   └── package.json               # Puppeteer-core headless harness
│
├── rendered-videos/               # 🎞️ Output Directory for Rendered Master MP4 Videos
│   ├── 01-hyperframes-saas-demo.mp4
│   ├── 02-onetake-kinetic-demo.mp4
│   ├── 03-collage-broll-demo.mp4
│   ├── 04-claude-canvas2d-demo.mp4
│   ├── 05-lemo-opuscar-demo.mp4
│   └── the-five-minute-rule-scene1-showcase.mp4
│
└── tools/                         # 🛠️ MCP Servers & Integration Tools
    └── imgbb-mcp/                 # Model Context Protocol server for image hosting
```

---

## 🎨 The 5 Creative Video Workflows

Derived from the [CampusLoop Video Systems Analysis](https://campusloop.space/articles/same-ai-five-worlds-ai-video-workflows-f79721), each workflow solves a distinct layer in the video-making system:

| Workflow | Core Metaphor & Look | Ideal Format | Primary Engine |
| :--- | :--- | :--- | :--- |
| **1. HyperFrames** | Web-native DOM, glassmorphism, telemetry, chart races | SaaS launches, UI demos, explainers | HTML5, CSS, GSAP, FFmpeg |
| **2. OneTake** | Unbroken kinetic camera journeys, morphing visual anchors | High-energy product reveals, tech teasers | 3D CSS transforms, cubic-bezier |
| **3. Collage B-roll** | Torn paper cutouts, duotone halftone imagery, 12fps stop-motion | Editorial commentary, essay videos, Shorts | Paper textures, stepped easing |
| **4. Claude Animation** | Hand-painted 2D characters, organic line boil, squash & stretch | Mascot-led channels, comic shorts | HTML5 Canvas, p5.js, vector wash |
| **5. Lemo Opuscar** | Algorithmic film styles: Pixel Art, Cyberpunk Neon, Bauhaus, Origami | Atmospheric short films, cinematic art | Custom canvas shaders, scanlines |

---

## 🎙️ Best-in-Class Audio Production Suite

A video is only as compelling as its sound. The studio includes an automated audio production pipeline:

1. **Neural Voiceover (`audio-engine/tts_engine.py`)**:
   - Neural TTS voices (`Christopher`, `Jenny`, `Guy`, `Aria`, `Ryan`, `Sonia`, `Eric`).
   - Word-level subtitle generation (`.srt` with microsecond synchronization).
2. **Procedural Score Synthesis (`audio-engine/ambient_synthesizer.py`)**:
   - Harmonic drone chords (D-minor, A-minor ambient pads).
   - Cyberpunk synthwave basslines with sub-oscillators.
   - Warm lofi chord beds with tape flutter and vinyl crackle.
3. **Sound Design FX (`audio-engine/sfx_generator.py`)**:
   - Directional air whooshes, sub-bass title drops, crystalline chime bells, UI clicks, paper tears, and glitch bursts.
4. **Intelligent Mixer (`audio-engine/audio_mixer.py`)**:
   - Automatic sidechain compression (ducking): music automatically dips during narration and swells during pauses.

---

## 🚀 Quickstart & Usage

### 1. Synthesize Audio
```bash
# Generate neural voiceover
python3 audio-engine/tts_engine.py "Welcome to the studio." out/voice.mp3 cinematic-narrator

# Compose atmospheric score
python3 audio-engine/ambient_synthesizer.py cyberpunk-synthwave out/score.mp3 10

# Mix with automatic ducking
python3 audio-engine/audio_mixer.py out/voice.mp3 out/score.mp3 out/master.mp3
```

### 2. Render Videos with Headless Chromium & FFmpeg
```bash
# Render any HTML composition to MP4
node renderers/render_html_composition.js <path/to/index.html> <path/to/output.mp4> [duration_sec] [fps] [audio_path]

# Example:
node renderers/render_html_composition.js templates/template-hyperframes-saas/index.html rendered-videos/demo.mp4 8 30 templates/template-hyperframes-saas/master.mp3
```

### 3. Batch Render Any of the 53 Scripts
```bash
# List all 53 scripts in catalog
python3 renderers/batch_renderer.py --list

# Render specific script by index (e.g. #02)
python3 renderers/batch_renderer.py --index 2

# Render a representative video for all 5 styles
python3 renderers/batch_renderer.py --all-styles
```

---

## 📦 Installed Agent Skills
Custom skills are equipped in `skills/` and registered globally in `~/.gemini/config/skills/`:
- `/hyperframes-video`
- `/remotion-video`
- `/onetake-continuity`
- `/collage-broll`
- `/claude-animation-2d`
- `/lemo-opuscar-cinematic`

---

## 📄 License & Attribution
- Core studio code & templates: **MIT License**.
- Based on research and production workflows documented by **CampusLoop Systems & Tech Desk**.
