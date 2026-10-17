#!/usr/bin/env python3
"""
Procedural Ambient Soundtrack & Musical Score Generator
Uses FFmpeg audio synthesis filters (lavfi) to produce cinematic scores,
harmonic drones, synthwave pads, and textured atmospheres.
"""

import os
import sys
import subprocess

def generate_ambient_drone(output_path: str, duration: int = 60, key: str = "D_minor"):
    """
    Generates a deep, rich cinematic drone chord.
    D minor chord: D2 (73.42Hz), A2 (110.00Hz), F3 (174.61Hz), C4 (261.63Hz)
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fade_in_dur = min(3.0, max(0.5, duration * 0.1))
    fade_out_dur = min(4.0, max(0.5, duration * 0.15))
    fade_out_start = max(0.0, duration - fade_out_dur)
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"sine=frequency=73.42:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=110.00:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=174.61:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=261.63:duration={duration}",
        "-filter_complex",
        f"[0:a][1:a][2:a][3:a]amix=inputs=4:duration=longest[mixed];"
        f"[mixed]lowpass=f=400,volume=0.35,afade=t=in:st=0:d={fade_in_dur},afade=t=out:st={fade_out_start}:d={fade_out_dur}[out]",
        "-map", "[out]",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def generate_cyberpunk_synthwave(output_path: str, duration: int = 60):
    """
    Generates a dark, pulsating synthwave atmospheric bassline.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fade_in_dur = min(2.0, max(0.5, duration * 0.1))
    fade_out_dur = min(3.0, max(0.5, duration * 0.15))
    fade_out_start = max(0.0, duration - fade_out_dur)
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"sine=frequency=55.00:duration={duration}",   # A1 Sub-bass
        "-f", "lavfi", "-i", f"sine=frequency=110.00:duration={duration}",  # A2 Root
        "-f", "lavfi", "-i", f"sine=frequency=164.81:duration={duration}",  # E3 Fifth
        "-f", "lavfi", "-i", f"sine=frequency=220.00:duration={duration}",  # A3 Octave
        "-filter_complex",
        f"[0:a][1:a][2:a][3:a]amix=inputs=4:duration=longest[mixed];"
        f"[mixed]tremolo=f=4.0:d=0.7,volume=0.3,afade=t=in:st=0:d={fade_in_dur},afade=t=out:st={fade_out_start}:d={fade_out_dur}[out]",
        "-map", "[out]",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def generate_lofi_warmth(output_path: str, duration: int = 60):
    """
    Generates warm lofi chord bed with tape flutter.
    Major 7th / 9th chords: F3 (174.61Hz), A3 (220Hz), C4 (261.63Hz), E4 (329.63Hz)
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fade_in_dur = min(2.0, max(0.5, duration * 0.1))
    fade_out_dur = min(3.0, max(0.5, duration * 0.15))
    fade_out_start = max(0.0, duration - fade_out_dur)
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"sine=frequency=174.61:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=220.00:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=261.63:duration={duration}",
        "-f", "lavfi", "-i", f"sine=frequency=329.63:duration={duration}",
        "-filter_complex",
        f"[0:a][1:a][2:a][3:a]amix=inputs=4:duration=longest[mixed];"
        f"[mixed]chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.2,lowpass=f=600,volume=0.28,afade=t=in:st=0:d={fade_in_dur},afade=t=out:st={fade_out_start}:d={fade_out_dur}[out]",
        "-map", "[out]",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

TRACK_GENERATORS = {
    "cinematic-drone": generate_ambient_drone,
    "cyberpunk-synthwave": generate_cyberpunk_synthwave,
    "lofi-warmth": generate_lofi_warmth,
}

def generate_score(track_type: str, output_path: str, duration: int = 60):
    gen = TRACK_GENERATORS.get(track_type, generate_ambient_drone)
    gen(output_path, duration)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 ambient_synthesizer.py <track_type> <output_path> [duration_sec]")
        sys.exit(1)
    t_type = sys.argv[1]
    o_path = sys.argv[2]
    dur = int(sys.argv[3]) if len(sys.argv) > 3 else 60
    generate_score(t_type, o_path, dur)
    print(f"Generated track: {o_path} ({dur}s)")
