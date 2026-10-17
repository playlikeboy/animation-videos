#!/usr/bin/env python3
"""
Master Script Catalog Builder
Generates 52 structured animation video scripts across 5 creative workflows:
1. HyperFrames SaaS & Explainer
2. OneTake Kinetic Continuity
3. Collage B-roll & Metaphors
4. Claude Animation Base (2D Characters)
5. Lemo Opuscar (Cinematic Code Styles)
"""

import os
import json

CATEGORIES = [
    {
        "id": "01-hyperframes-saas-explainer",
        "name": "HyperFrames Web-Native & SaaS Explainers",
        "description": "HTML/CSS/JS web compositions, responsive SaaS demos, chart races, and deterministic timelines.",
        "workflow": "HyperFrames",
        "scripts": [
            ("the-five-minute-rule", "The 5-Minute Rule", "300s", "16:9 1080p", "Minimalist Silhouette Vector", "A paralyzed procrastinator discovers the momentum of taking action for just 300 seconds."),
            ("saas-cloud-orchestrator", "HyperScale Cloud Orchestrator", "60s", "16:9 1080p", "SaaS Dashboard UI / Glassmorphism", "Visualizing automated kubernetes cluster auto-healing in real-time under traffic spikes."),
            ("chart-race-economic-shift", "The 20-Year Energy Revolution", "90s", "16:9 1080p", "Kinetic Data Visualization / Chart Race", "Dynamic bar chart race tracking the global ascendancy of solar and wind over coal from 2005 to 2025."),
            ("developer-pr-breakdown", "Pull Request #402: REST to gRPC", "45s", "16:9 1080p", "Terminal & Code Diff Highlighting", "A high-velocity code walkthrough showing a 4x throughput boost by migrating internal microservices to protobuf."),
            ("dark-mode-design-system", "Tokenized: The Fluid Design System", "60s", "16:9 1080p", "Minimalist Design System Spec", "Demonstrating dynamic color tokens, bezier spring curves, and seamless dark mode transitions."),
            ("fintech-realtime-settlement", "Atomic Settlement: Zero Float", "60s", "16:9 1080p", "Fintech Neon Ledger / Iso Flow", "Tracing a cross-border remittance settling in 140 milliseconds with zero-knowledge proof verification."),
            ("typography-in-motion", "Form Follows Function", "45s", "16:9 1080p", "Swiss Kinetic Typography", "A rhythmic visual manifesto on why whitespace, proportion, and hierarchy define great software."),
            ("headless-browser-pipeline", "The Headless Video Factory", "60s", "16:9 1080p", "Technical Pipeline Schematic", "How web browsers render deterministic 60fps video frames through Chromium and FFmpeg."),
            ("data-privacy-vault", "The Zero-Knowledge Vault", "60s", "16:9 1080p", "Cryptographic Iso Shard", "Explaining end-to-end homomorphic encryption where data is processed without ever being decrypted."),
            ("ai-model-weights-evaluator", "Benchmarking the Frontier", "60s", "16:9 1080p", "Telemetry HUD / Radar Graphs", "Comparing token latency, reasoning benchmarks, and parameter quantization in real-time charts."),
            ("sustainable-datacenter-metrics", "Zero Watt Waste", "45s", "16:9 1080p", "Eco Telemetry / Green & Obsidian", "Tracking geothermal and liquid immersion cooling metrics inside next-generation server farms.")
        ]
    },
    {
        "id": "02-onetake-kinetic-continuity",
        "name": "OneTake Kinetic Continuity & Product Launches",
        "description": "Unbroken continuous camera flights, morphing vector anchors, and kinetic physics transitions.",
        "workflow": "OneTake",
        "scripts": [
            ("quantum-chip-reveal", "Quantum Core X1: Beyond Silicon", "60s", "16:9 1080p", "Continuous Macro Zoom & 3D Morph", "A camera dives into a single atom and emerges out of a cryogenic quantum compute blade."),
            ("the-morning-coffee-ritual", "First Brew: The Science of Pour", "45s", "9:16 Vertical", "Continuous Kinetic Orbit", "Tracking a single water droplet descending into roasted grounds, spiraling into morning sunlight."),
            ("kinetic-smartwatch-ultra", "Apex Watch Ultra", "60s", "16:9 1080p", "3D Transform & Kinetic Lighting", "Machined titanium chassis rotates seamlessly into an underwater dive gauge and alpine compass."),
            ("autonomous-drone-journey", "SkyCourier: Autonomous Logistics", "60s", "16:9 1080p", "Continuous Tracking Velocity", "Camera follows a drone launching from an automated rooftop bay across a futuristic skyline."),
            ("electric-supercar-aerodynamics", "Veloce GT: Sculpted by Air", "45s", "16:9 1080p", "Aerodynamic Particle Streamlines", "Fluorescent wind tunnel smoke flows across carbon fiber surfaces and morphs into a neon racetrack."),
            ("designer-workspace-canvas", "The Infinite Canvas", "60s", "16:9 1080p", "Fractal Zoom & Spatial UI", "Zooming into a sticky note that becomes a wireframe, which expands into an interactive live product."),
            ("frictionless-auth-key", "Passkeys: The End of Passwords", "45s", "9:16 Vertical", "Morphing Vector Iconography", "A physical antique brass padlock dissolves into laser-etched cryptographic keyrings on a phone screen."),
            ("neuro-link-headset-demo", "Synapse One: Spatial Thought", "60s", "16:9 1080p", "Synaptic Luminescence", "A gentle pulse traveling along neural axons transforms into a floating spatial computing interface."),
            ("soundwave-acoustics-lab", "Studio Acoustic Pure", "45s", "16:9 1080p", "Sine Wave to Architectural Space", "A single crystal wine glass ring turns into undulating room acoustic absorption panels."),
            ("orbiting-satellite-mesh", "Constellation: Earth Linked", "60s", "16:9 1080p", "Orbital Parallax & Laser Interlinks", "Sweeping from ground relay stations up into an orbital laser mesh delivering planetary broadband."),
            ("modular-phone-architecture", "Project Phoenix: Repairable Tech", "45s", "16:9 1080p", "Exploded View & Magnetic Snaps", "Every component of a modular smartphone effortlessly snaps apart and reassembles in mid-air.")
        ]
    },
    {
        "id": "03-collage-broll-metaphors",
        "name": "Collage B-roll & Editorial Metaphors",
        "description": "Tactile paper cutouts, duotone halftone imagery, risograph textures, and stop-motion metaphors.",
        "workflow": "Collage B-roll",
        "scripts": [
            ("the-tyranny-of-multitasking", "The Myth of Multitasking", "60s", "9:16 Vertical", "Torn Paper & Ticking Clock Clutter", "A vintage desk is violently buried under 40 ticking alarm clocks to represent sensory overload."),
            ("technical-debt-catastrophe", "Technical Debt: The Hidden Jenga", "60s", "16:9 1080p", "Halftone Paper Tower / Tape Strips", "A delicate tower made of yellowed newspaper code snippets begins to wobble when one block is pulled."),
            ("the-attention-economy", "Your Attention is the Product", "60s", "9:16 Vertical", "Risograph Halftone / Neon Glare", "Silhouetted faces illuminated solely by glowing casino reels trapped inside mobile phone screens."),
            ("deep-work-in-a-noisy-world", "The Glass Bell of Deep Work", "60s", "16:9 1080p", "Textured Paper & Ink Splatters", "A thick soundproof glass bell jar drops over a writer's desk, dampening the chaotic world outside."),
            ("the-imposter-syndrome-mirror", "Unmasking the Imposter", "45s", "9:16 Vertical", "Cardboard Cutout / Gold Leaf Foil", "Peeling away layers of grey cardboard masks to reveal a brilliant, hand-embossed gold mosaic."),
            ("algorithmic-echo-chambers", "The Hall of Familiar Mirrors", "60s", "16:9 1080p", "Prismatic Paper Reflections", "A reader walks down an infinite corridor of mirrors that all reflect the exact same newspaper headline."),
            ("the-death-of-the-cookie", "The Crumbling Third-Party Cookie", "45s", "9:16 Vertical", "Stop-Motion Paper Crumbs", "A vintage glass cookie jar shatters into thousands of halftone dots that morph into padlock shields."),
            ("compound-interest-snowball", "The Eighth Wonder of the World", "60s", "16:9 1080p", "Origami Snowflake Avalanche", "A tiny paper snowflake tumbles down an origami slope, gathering golden coins into an unstoppable boulder."),
            ("burnout-and-the-empty-battery", "Running on Residual Charge", "45s", "9:16 Vertical", "Dry Marker Sketch / Paper Battery", "A cardboard battery gauge dropping into blinking red chalk hash marks before being plugged into rest."),
            ("open-source-cathedral-and-bazaar", "The Cathedral and the Bazaar", "60s", "16:9 1080p", "Victorian Blueprint vs Beehive", "A rigid stone cathedral blueprint breaks apart to form a buzzing, collaborative open-source marketplace.")
        ]
    },
    {
        "id": "04-claude-animation-mascot-2d",
        "name": "Claude Animation Base & 2D Mascot Narratives",
        "description": "Hand-painted illustrated character animation, line boil, expressive poses, and emotive storytelling.",
        "workflow": "Claude Animation Base",
        "scripts": [
            ("the-little-robot-who-could", "Pip and the Watercolor Dawn", "60s", "16:9 1080p", "Hand-Painted Watercolor / Line Boil", "A small rusty tin robot with big glowing oval eyes learns to mix paint and paint the sunrise."),
            ("git-merge-conflict-adventure", "Barnaby the Fox: Merge Conflict", "60s", "16:9 1080p", "Storybook Illustrated 2D", "An intrepid fox detective untangles two intertwined glowing branch vines without snapping either one."),
            ("the-curious-cloud-traveler", "Cirrus: The Cloud Who Wanted to Rain", "45s", "16:9 1080p", "Soft Pastel Wash / Fluid Motion", "A fluffy, timid cloud character discovers how to turn thunder into nourishing drops for a dry flower."),
            ("debug-detective-owl", "Detective Hoot and the Semicolon", "60s", "16:9 1080p", "Moody Ink Wash / Character Poses", "A pipe-smoking owl in a trench coat examines magnifying glass clues across a moonlit library of code."),
            ("the-sleepy-sprout-grows", "Sprout's First Morning Sun", "45s", "9:16 Vertical", "Organic Brush Linework", "A cozy little seedling yawns, shakes off dew droplets, and stretches its two green leaves toward the sun."),
            ("the-brave-pixel-and-the-vector", "Dot Meets Spline", "60s", "16:9 1080p", "Mixed Media: 8-Bit Pixel + Brush Spline", "A lonely pixel square befriends a soaring, elegant vector ribbon and they build a roller coaster together."),
            ("the-art-of-saying-no", "Mochi the Cat's Gentle Boundary", "45s", "9:16 Vertical", "Minimalist Japanese Sumi-e Brush", "A calm, round white cat gracefully pats away a bombardment of incoming calendar invite pebbles."),
            ("how-the-internet-actually-works", "Barnaby Pigeon's Packet Flight", "60s", "16:9 1080p", "Whimsical Animated Map & Mascot", "A determined pigeon courier navigates stormy undersea cables to deliver an urgent digital envelope."),
            ("the-lonely-astronauts-garden", "Astro & The Moon Daisy", "60s", "16:9 1080p", "Gouache Texture on Dark Charcoal", "A solitary astronaut waters a glowing blue flower inside their lunar dome while watching the Earth turn."),
            ("the-inventors-notebook", "When Sketches Wake Up", "60s", "16:9 1080p", "Living Graphite Sketchbook", "Pencil-drawn gears and wings come to life on parchment paper, helping their sleeping creator finish an invention.")
        ]
    },
    {
        "id": "05-lemo-opuscar-cinematic-styles",
        "name": "Lemo Opuscar & Code-Authored Cinematic Styles",
        "description": "Exploration of distinct code-authored aesthetic film styles (Pixel Art, Cyberpunk, Bauhaus, Origami, Blueprint, etc.)",
        "workflow": "Lemo Opuscar",
        "scripts": [
            ("style-pixel-art-chronicles", "The Quest for the Lost Algorithm", "60s", "16:9 1080p", "16-Bit Pixel Art / Chiptune Score", "A pixel knight and mage confer over an ancient glowing terminal inside a tavern cellar."),
            ("style-cyberpunk-neon-dystopia", "Protocol 0x99: Ghost in the Signal", "60s", "16:9 1080p", "CRT Scanlines / Neon Bloom / Synthwave", "Rain pours down neon-drenched high-rises as a rogue data packet is traced across optical fiber nodes."),
            ("style-bauhaus-kinetic-manifesto", "Kandinsky's Machine: Form & Color", "45s", "16:9 1080p", "Bauhaus Swiss Grid / Primary Triad", "Stark red circles, blue triangles, and yellow squares dance in mathematical syncopation to a ticking metronome."),
            ("style-origami-popup-fable", "The Legend of Mount Origami", "60s", "16:9 1080p", "CSS 3D Pop-Up Book / Paper Creases", "A paper traveler ascends a three-dimensional pop-up paper mountain with dynamic folding bridges."),
            ("style-blueprint-space-elevator", "Orbital Tether: Engineering Spec", "60s", "16:9 1080p", "Cyan Blueprint / Drafting Vectors", "Technical architectural cross-sections calculate carbon nanotube tensile stress for an orbital tether."),
            ("style-cel-anime-hyperdrive", "Velocity Horizon: Warp Engage", "45s", "16:9 1080p", "Cel Anime / Speed Lines / Dutch Angles", "Intense anime speed lines and chromatic lens flares as an experimental starfighter initiates warp drive."),
            ("style-gothic-silhouette-tales", "The Raven's Clockwork Hour", "60s", "16:9 1080p", "Gothic Victorian Shadow Play", "Intricate dark silhouette clocktowers and foggy gaslit cobblestones beneath an oversized full moon."),
            ("style-claymation-stopmotion-kitchen", "The Midnight Cookie Bakers", "45s", "9:16 Vertical", "Tactile Claymation / 12fps Stepped", "Chubby clay hands roll out dough and sprinkle colorful sugar beads with charming handmade imperfections."),
            ("style-vaporwave-90s-nostalgia", "Aesthetic 1995: Dial-Up Dreams", "60s", "16:9 1080p", "Vaporwave Pastel Grid & Wireframe", "An endless purple sunset grid where spinning wireframe teapots and classical busts float over ocean waves."),
            ("style-infographic-global-nervous-system", "Planetary Pulse: Subsea Telemetry", "60s", "16:9 1080p", "Kinetic Infographic / Data Node Mesh", "Interactive globe showing undersea fiber conduits carrying 99% of humanity's digital communications."),
            ("style-monochrome-noir-detective", "The Typist's Shadow", "60s", "16:9 1080p", "Stark Film Noir / Shadow Blinds", "Venetian blinds cast diagonal razor-sharp bars of light across an old mechanical typewriter clacking in the night.")
        ]
    }
]

def generate_script_content(cat, s_tuple, index_num):
    slug, title, dur, res, style, synopsis = s_tuple
    
    content = f"""# {title}

**Script ID:** `{slug}`  
**Category:** {cat['name']}  
**Workflow Engine:** {cat['workflow']}  
**Style Reference:** {style}  
**Resolution:** {res}  
**Duration:** {dur}  
**Production Index:** #{index_num:02d} of 52  

---

## 1. Executive Synopsis
{synopsis}

---

## 2. Creative & Visual Grammar Guidelines
- **Color Palette & Material:**
  - Designed specifically for the **{style}** aesthetic.
  - High dynamic contrast, WCAG AA verified typography, and deterministic rendering rules.
- **Camera & Motion Language:**
  - Fluid easing using cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Continuous motion continuity with visual anchors preserving spectator focus across scene changes.
- **Audio Profile:**
  - Recommended Voiceover Preset: `cinematic-narrator` / `saas-explainer`
  - Atmospheric Score: Synthesized procedural chord bed tailored to the story's emotional arc.
  - Sound Design (SFX): Sub-drops on key reveals, crisp interface clicks, and directional whoosh transitions.

---

## 3. Scene-by-Scene Production Breakdown

### Scene 1: The Inciting Spark (0.0s – 15.0s)
* **Setting & Mood:** Opening hook introducing the core conflict or premise.
* **Key Visuals:**
  - Main hero element enters frame with deliberate kinetic weight.
  - Style-specific rendering accents activate (halftone dots / neon glow / paper fold / brush stroke).
* **Narration Script:**
  > "Every breakthrough begins with a single, quiet realization: what brought us here is not enough to take us where we need to go."
* **Audio Cues:**
  - Ambient drone swells softly from 0 to -14dB.
  - Subtle `whoosh.mp3` on title card reveal.

---

### Scene 2: The Rising Tension & Complexity (15.0s – 35.0s)
* **Setting & Mood:** Exploration of the problem space, escalating stakes, and technical friction.
* **Key Visuals:**
  - Visual layers multiply or camera executes a dynamic tracking journey.
  - Micro-telemetry, data counters, or character expressions signal mounting resistance.
* **Narration Script:**
  > "Complexity has a way of compounding in the dark. We construct intricate monuments to our ambitions, only to find ourselves paralyzed beneath their weight."
* **Audio Cues:**
  - Rhythmic pulse enters the soundtrack.
  - `ui-click.mp3` or `paper-tear.mp3` accentuates pivotal moments.

---

### Scene 3: The Catalyst & Transformation (35.0s – 50.0s)
* **Setting & Mood:** The turning point where clarity replaces confusion.
* **Key Visuals:**
  - Seamless anchor morph: the blocking element shifts into an empowering tool or perspective.
  - Lighting transitions from cold, restrained tones to luminous amber or radiant cyan.
* **Narration Script:**
  > "The secret is not brute force; it is the courage to begin small. A single stride, a single line of code, a single moment of focus shatters the inertia."
* **Audio Cues:**
  - Crystalline `chime.mp3` rings out as revelation lands.
  - Background score introduces harmonic resolution chords.

---

### Scene 4: The Horizon & Momentum (50.0s – End)
* **Setting & Mood:** Expansive resolution, forward momentum, and lasting call-to-action.
* **Key Visuals:**
  - Camera pulls back or cranes upward toward an infinite, open horizon.
  - Final branding, title badge, and metric highlights settle into a pristine locked composition.
* **Narration Script:**
  > "A mountain is moved stone by stone. Tomorrow is not built by chance; it is crafted, frame by frame, starting right now."
* **Audio Cues:**
  - Master musical score resolves with a gentle, resonant fade-out.
  - Sub-bass `impact.mp3` lands precisely as the final title typography locks.

---

## 4. Technical Implementation Mapping
- **Primary Framework:** `{cat['workflow']}`
- **Audio Assets Required:**
  - `voiceovers/scene1.mp3`, `voiceovers/scene2.mp3`, `voiceovers/scene3.mp3`, `voiceovers/scene4.mp3`
  - `music/ambient-score.mp3`
  - `sfx/whoosh.mp3`, `sfx/chime.mp3`, `sfx/impact.mp3`
- **Render Command:**
  ```bash
  python3 audio-engine/generate_all_audio.py --scenes-json {slug}-scenes.json --output-dir assets/audio/{slug}
  ```
"""
    return content

def main():
    base_dir = "/home/kunalkashyap8024/sop/animation-videos/scripts"
    os.makedirs(base_dir, exist_ok=True)
    
    catalog_entries = []
    total_count = 0
    
    for cat in CATEGORIES:
        cat_dir = os.path.join(base_dir, cat["id"])
        os.makedirs(cat_dir, exist_ok=True)
        
        for s_tuple in cat["scripts"]:
            total_count += 1
            slug, title, dur, res, style, syn = s_tuple
            filename = f"{slug}.md"
            filepath = os.path.join(cat_dir, filename)
            
            content = generate_script_content(cat, s_tuple, total_count)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
                
            catalog_entries.append({
                "index": total_count,
                "id": slug,
                "title": title,
                "category": cat["name"],
                "category_id": cat["id"],
                "workflow": cat["workflow"],
                "duration": dur,
                "resolution": res,
                "style": style,
                "synopsis": syn,
                "path": f"scripts/{cat['id']}/{filename}"
            })
            
    # Save catalog.json
    with open(os.path.join(base_dir, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog_entries, f, indent=2)
        
    # Generate Master SCRIPTS_CATALOG.md
    md_catalog = f"""# Master Script & Storyboard Catalog
**Total Production Scripts:** {total_count}  
**Creative Workflows:** 5 Systems (Based on CampusLoop AI Video Architecture)  
**Audio Integration:** Neural TTS + Procedural Lavfi Synthesizer + Auto-Ducking Mixer  

---

## Executive Overview
This catalog houses **{total_count} production-ready animation scripts** across five distinct visual languages and code-first workflows:
1. **HyperFrames Web-Native & SaaS Explainers** (11 Scripts)
2. **OneTake Kinetic Continuity & Product Launches** (11 Scripts)
3. **Collage B-roll & Editorial Metaphors** (10 Scripts)
4. **Claude Animation Base (2D Mascot Narratives)** (10 Scripts)
5. **Lemo Opuscar Code-Authored Film Styles** (11 Scripts)

---

## Script Index by Creative World

"""
    curr_cat = None
    for entry in catalog_entries:
        if entry["category"] != curr_cat:
            curr_cat = entry["category"]
            md_catalog += f"\n### {curr_cat} (`{entry['workflow']}`)\n\n"
            md_catalog += "| # | Title | Duration | Visual Style | Script Link |\n"
            md_catalog += "|---|---|---|---|---|\n"
        md_catalog += f"| {entry['index']:02d} | **{entry['title']}** | {entry['duration']} | {entry['style']} | [`{entry['id']}.md`]({entry['path']}) |\n"

    with open(os.path.join(base_dir, "SCRIPTS_CATALOG.md"), "w", encoding="utf-8") as f:
        f.write(md_catalog)

    print(f"✅ Successfully generated {total_count} animation scripts and SCRIPTS_CATALOG.md!")

if __name__ == "__main__":
    main()
