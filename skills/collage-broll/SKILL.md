---
name: collage-broll
description: Editorial paper-collage animation workflow transforming narration sentences into punchy visual metaphors.
---

# Collage B-roll Workflow Skill

Collage B-roll turns script narration into tactile, paper-cut, stop-motion editorial animations.

## Aesthetic Characteristics

1. **Visual Elements**:
   - Flat, vibrant pastel & earth-toned background fields.
   - Monochrome & duotone halftone photographic cutouts.
   - Textured paper edges, torn paper masks, tape strips, and stamp textures.
   - Hand-annotated doodles, arrows, highlighter strokes, and risograph dots.

2. **Stop-Motion Pacing (12 FPS Animation Grid)**:
   - Elements pop, slide, or snap into place with stepped easing (`steps(5, end)` or 12fps keyframe increments).
   - Subtle jitter/wiggle (`±1.5px` rotation and position displacement every few frames) for tactile handmade authenticity.

3. **The 3 Approval Gates**:
   - **Gate 1: Visual Metaphor Selection**: Map abstract statements to physical objects.
     - *Abstract*: "Database latency slows customer checkout."
     - *Metaphor*: A conveyor belt clogged with ticking vintage pocket watches and hourglasses.
   - **Gate 2: Still Collage Composition**: Layout layers (background -> cutout assets -> paper shapes -> typography labels).
   - **Gate 3: Motion & Paper Stagger**: Animate reveal order (0.0s bg drop, 0.2s cutout slam, 0.4s tape stick, 0.6s text stamp).
