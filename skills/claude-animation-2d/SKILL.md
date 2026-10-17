---
name: claude-animation-2d
description: Hand-painted 2D illustrated character animation using p5.js / HTML5 Canvas with expressive mascot grammar.
---

# Claude Animation Base (2D Character Animation) Skill

Claude Animation Base is a code-first starter kit for hand-painted, illustrated character and mascot animation using p5.js, canvas, and vector styling.

## Design Grammar

1. **Character Consistency & Proportions**:
   - Establish fixed proportional ratios (head-to-body, limb length, eye scale).
   - Use reusable drawing functions (`drawMascot(x, y, emotion, pose, frame)`).
   - Maintain a cohesive color palette (3 primary colors + 2 accent tones).

2. **Hand-Made Feel (Line Boil & Texture)**:
   - Introduce subtle frame-by-frame linework oscillation (`sin(frame * 0.3) * 0.8px`).
   - Use textured brushes, charcoal/ink strokes, or soft watercolor fills rather than sterile geometric shapes.

3. **Classic Animation Principles in Code**:
   - **Squash and Stretch**: Scale character $(1.15, 0.85)$ on impact; $(0.85, 1.15)$ during jump anticipation.
   - **Anticipation**: Brief reverse movement before major action.
   - **Follow-Through & Secondary Action**: Hair, scarves, and accessories lag 2-3 frames behind primary torso movement.
   - **Eye Blinks & Emotional Tilted Brows**: Periodic blinks every 3-5 seconds; eye angles convey wonder, fatigue, joy, or focus.

4. **Scene Integration**:
   - Export SVG/Canvas frames or integrate via interactive canvas element inside HyperFrames / Remotion.
