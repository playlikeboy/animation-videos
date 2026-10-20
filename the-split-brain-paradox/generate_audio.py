#!/usr/bin/env python3
"""
Audio Asset Generator for 'THE SPLIT-BRAIN PARADOX'
Synthesizes all 5 scene voiceovers with Edge-TTS, generates procedural
ambient scores (300 seconds), and sound design effects.
"""

import os
import sys
import subprocess
from pathlib import Path

# Add audio-engine to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / "audio-engine"))

from tts_engine import synthesize_text
from ambient_synthesizer import generate_score
from sfx_generator import generate_sfx
from audio_mixer import mix_composition_audio

VOICEOVER_SCRIPTS = {
    "scene1": (
        "Every moment of your waking life feels unbroken. "
        "You think your thoughts in a single voice. You make decisions with a single will. "
        "You believe you are one person. "
        "But beneath the surface of your skull sits not one mind, but two. "
        "Two separate hemispheres, with distinct ways of experiencing reality, "
        "bound together by a fragile bridge of two hundred million nerve fibers: the corpus callosum."
    ),
    "scene2": (
        "In the mid-twentieth century, neurosurgeons faced patients whose severe epilepsy "
        "bounced uncontrollably between hemispheres. To save them, surgeons did the unthinkable: they cut the bridge. "
        "The corpus callosum was severed. "
        "When the patients woke up, they walked, spoke, and remembered normally. "
        "But soon, subtle anomalies emerged. "
        "A patient would reach to button their shirt with their right hand, only for their left hand to reach up and unbutton it. "
        "Two distinct wills were living in the same body."
    ),
    "scene3": (
        "In the 1960s, neuroscientists Roger Sperry and Michael Gazzaniga devised an experiment "
        "that would shatter our understanding of human consciousness. "
        "They flashed two different images at the same time: to the right visual field, a chicken claw; "
        "to the left visual field, a snowy winter scene. "
        "The left hemisphere, the only hemisphere capable of speech, saw the chicken claw. "
        "The silent right hemisphere saw the snow. "
        "When asked to point with their left hand, the patient immediately pointed to a snow shovel."
    ),
    "scene4": (
        "Then came the most chilling discovery in cognitive neuroscience. "
        "Gazzaniga asked the patient: Why did you pick the shovel? "
        "Remember: the speaking left brain never saw the snow. It had no logical reason to know why the hand picked a shovel. "
        "Did it admit ignorance? Never. "
        "Without missing a beat, the left hemisphere replied: Oh, that's easy! You need a shovel to clean out the chicken coop. "
        "The left brain instantly invented a fiction, believed its own lie, and defended it as reality."
    ),
    "scene5": (
        "Gazzaniga called this neural system The Interpreter. "
        "Its job is to weave the chaos of our unconscious impulses into a coherent story called Me. "
        "You are not a solitary captain steering a ship; "
        "you are a bustling parliament of modular networks, united by a brilliant, relentless storyteller. "
        "The next time you explain why you feel what you feel, or why you did what you did, ask yourself: "
        "is that the truth, or is it just your Interpreter telling you a story? "
        "Tomorrow is waiting."
    )
}

def main():
    proj_dir = Path(__file__).resolve().parent
    vo_dir = proj_dir / "assets" / "audio" / "voiceovers"
    music_dir = proj_dir / "assets" / "audio" / "music"
    sfx_dir = proj_dir / "assets" / "audio" / "sfx"

    vo_dir.mkdir(parents=True, exist_ok=True)
    music_dir.mkdir(parents=True, exist_ok=True)
    sfx_dir.mkdir(parents=True, exist_ok=True)

    print("🧠 1. Synthesizing Scene Voiceovers with Neural Voice (Christopher)...")
    for scene, text in VOICEOVER_SCRIPTS.items():
        out_path = vo_dir / f"{scene}.mp3"
        print(f"   🎙️ Generating {scene} voiceover...")
        res = synthesize_text(text, str(out_path), preset="cinematic-narrator")
        print(f"      Duration: {res['duration']:.2f}s")

    print("\n🎵 2. Composing 300-Second Ambient Soundtrack (Cinematic D-minor Drone)...")
    bgm_path = music_dir / "ambient-soundtrack.mp3"
    generate_score("cinematic-drone", str(bgm_path), duration=300)
    print(f"   ✓ Generated: {bgm_path} (300s)")

    print("\n💥 3. Synthesizing Neuroscience Sound Design FX...")
    generate_sfx("whoosh", str(sfx_dir / "synaptic-pulse.mp3"))
    generate_sfx("impact", str(sfx_dir / "sever-impact.mp3"))
    generate_sfx("chime", str(sfx_dir / "epiphany-chime.mp3"))
    generate_sfx("glitch", str(sfx_dir / "interpreter-clockwork.mp3"))
    generate_sfx("ui-click", str(sfx_dir / "switch-click.mp3"))

    print("\n✨ All audio assets successfully created for THE SPLIT-BRAIN PARADOX!")

if __name__ == "__main__":
    main()
