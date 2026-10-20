#!/usr/bin/env python3
"""
Full 5-Minute Audio Master Mixer
Combines ambient score, scene voiceovers, and SFX into a single 300-second master track.
"""

import subprocess
from pathlib import Path

def main():
    base = Path(__file__).resolve().parent / "assets" / "audio"
    bgm = base / "music" / "ambient-soundtrack.mp3"
    out = base / "master-soundtrack.mp3"

    v1 = base / "voiceovers" / "scene1.mp3"
    v2 = base / "voiceovers" / "scene2.mp3"
    v3 = base / "voiceovers" / "scene3.mp3"
    v4 = base / "voiceovers" / "scene4.mp3"
    v5 = base / "voiceovers" / "scene5.mp3"

    sfx_whoosh = base / "sfx" / "synaptic-pulse.mp3"
    sfx_impact = base / "sfx" / "sever-impact.mp3"
    sfx_chime = base / "sfx" / "epiphany-chime.mp3"
    sfx_glitch = base / "sfx" / "interpreter-clockwork.mp3"

    # Precise timestamp offsets (in milliseconds)
    # Scene 1: 4s = 4000ms
    # Scene 2: 64s = 64000ms
    # Scene 3: 124s = 124000ms
    # Scene 4: 184s = 184000ms
    # Scene 5: 244s = 244000ms

    filter_complex = (
        "[1:a]adelay=4000|4000,volume=1.1[v1];"
        "[2:a]adelay=64000|64000,volume=1.1[v2];"
        "[3:a]adelay=124000|124000,volume=1.1[v3];"
        "[4:a]adelay=184000|184000,volume=1.1[v4];"
        "[5:a]adelay=244000|244000,volume=1.1[v5];"
        "[6:a]adelay=1500|1500,volume=0.8[s1];"
        "[7:a]adelay=78000|78000,volume=1.2[s2];"
        "[8:a]adelay=150000|150000,volume=0.9[s3];"
        "[9:a]adelay=200000|200000,volume=0.7[s4];"
        "[0:a]volume=0.25[bgm];"
        "[v1][v2][v3][v4][v5][s1][s2][s3][s4]amix=inputs=9:dropout_transition=0[voices_sfx];"
        "[bgm][voices_sfx]amix=inputs=2:duration=first[out]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(bgm),
        "-i", str(v1),
        "-i", str(v2),
        "-i", str(v3),
        "-i", str(v4),
        "-i", str(v5),
        "-i", str(sfx_whoosh),
        "-i", str(sfx_impact),
        "-i", str(sfx_chime),
        "-i", str(sfx_glitch),
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-t", "300",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        str(out)
    ]

    print("🎧 Mixing 300-second Master Audio Soundtrack with FFmpeg...")
    subprocess.run(cmd, check=True)
    print(f"✓ Master Audio Track generated at: {out}")

if __name__ == "__main__":
    main()
