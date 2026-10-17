---
name: onetake-continuity
description: Continuous-motion animation workflow focused on unbroken visual continuity, kinetic camera tracking, and morphing transitions.
---

# OneTake Continuity Workflow Skill

OneTake treats video production not as isolated slides or disconnected cuts, but as an unbroken visual journey where every beat evolves directly out of the previous beat.

## Key Principles

1. **Morphing State Transitions**:
   - Rather than fading out Scene A and fading in Scene B, an element in Scene A transforms into Scene B's focal point.
   - Example: A pulsating status indicator dot zooms forward and expands to become the viewport of a smartphone mockup.

2. **Kinetic Camera Language**:
   - Continuous dolly, truck, and pan motions using CSS 3D transforms (`perspective`, `transform3d`, `rotateX/Y`).
   - Use cubic-bezier easing with smooth acceleration and decrescendo deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`).

3. **Kinetic Typography**:
   - Words punch into frame synced to voiceover cadence.
   - Letters reveal along motion vectors with subtle directional motion blur.

4. **Production Stages**:
   - **Beat Sheet**: Outline 4 to 8 continuous beats with exact physical connecting anchors.
   - **Vector Journey**: Map camera coordinates $(X, Y, Z, \theta)$ across the entire timeline.
   - **Render & Verification**: Check motion fluidity, frame timing, and contrast legibility.
