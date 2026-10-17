#!/usr/bin/env python3
"""
Procedural Sound Effects (SFX) Generator
Synthesizes professional sound design assets for video compositions:
whooshes, risers, impacts, chimes, UI clicks, paper rustles, glitches.
"""

import os
import sys
import subprocess

def make_whoosh(output_path: str):
    """Cinematic air whoosh for transitions."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=0.8:c=pink:r=44100:a=0.5",
        "-af", "bandpass=f=800:width_type=h:w=500,volume=1.5,afade=t=in:st=0:d=0.35,afade=t=out:st=0.35:d=0.45",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_impact_sub(output_path: str):
    """Deep cinematic sub-bass impact for title reveals."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=frequency=60:duration=1.2",
        "-af", "volume=1.8,afade=t=out:st=0.1:d=1.1,lowpass=f=120",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_ui_click(output_path: str):
    """Crisp modern UI button click / tap."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=frequency=1400:duration=0.04",
        "-af", "volume=1.2,afade=t=out:st=0.01:d=0.03",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_ui_pop(output_path: str):
    """Playful bubble / pop reveal sound."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=frequency=420:duration=0.12",
        "-af", "asetrate=44100*1.5,volume=1.4,afade=t=out:st=0.03:d=0.09",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_timer_chime(output_path: str):
    """Crystalline bell chime for moments of clarity / realization."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=frequency=1046.50:duration=2.5", # High C
        "-af", "volume=0.8,afade=t=out:st=0.2:d=2.3",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_paper_tear(output_path: str):
    """Tactile paper tear / rustle for collage b-roll."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=0.4:c=brown:r=44100:a=0.4",
        "-af", "highpass=f=1200,volume=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=0.15:d=0.25",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def make_digital_glitch(output_path: str):
    """Digital telemetry glitch / data blip."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=frequency=2400:duration=0.15",
        "-af", "tremolo=f=30.0:d=0.9,volume=1.0,afade=t=out:st=0.05:d=0.1",
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

SFX_BUILDERS = {
    "whoosh": make_whoosh,
    "impact": make_impact_sub,
    "ui-click": make_ui_click,
    "ui-pop": make_ui_pop,
    "chime": make_timer_chime,
    "paper-tear": make_paper_tear,
    "glitch": make_digital_glitch
}

def generate_sfx(sfx_type: str, output_path: str):
    builder = SFX_BUILDERS.get(sfx_type, make_ui_click)
    builder(output_path)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 sfx_generator.py <sfx_type> <output_path>")
        print(f"Available types: {list(SFX_BUILDERS.keys())}")
        sys.exit(1)
    st = sys.argv[1]
    op = sys.argv[2]
    generate_sfx(st, op)
    print(f"Generated SFX: {op}")
