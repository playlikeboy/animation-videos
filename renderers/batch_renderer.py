#!/usr/bin/env python3
"""
Batch Animation Video Renderer
Orchestrates script parsing, neural TTS synthesis, atmospheric score generation,
and headless Chromium/FFmpeg video rendering into output MP4s.
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_CATALOG = BASE_DIR / "scripts" / "catalog.json"
RENDER_SCRIPT = BASE_DIR / "renderers" / "render_html_composition.js"
AUDIO_ENGINE = BASE_DIR / "audio-engine" / "tts_engine.py"
AMBIENT_ENGINE = BASE_DIR / "audio-engine" / "ambient_synthesizer.py"
MIXER_ENGINE = BASE_DIR / "audio-engine" / "audio_mixer.py"
OUTPUT_DIR = BASE_DIR / "rendered-videos"

def load_catalog():
    if not SCRIPTS_CATALOG.exists():
        print(f"Error: Catalog not found at {SCRIPTS_CATALOG}")
        sys.exit(1)
    with open(SCRIPTS_CATALOG) as f:
        return json.load(f)

def render_script_video(entry, preview_duration=6):
    slug = entry["id"]
    workflow = entry["workflow"]
    title = entry["title"]
    print(f"\n========================================================")
    print(f"🎬 Producing Video: {title} ({workflow})")
    print(f"========================================================")

    out_mp4 = OUTPUT_DIR / f"{entry['index']:02d}-{slug}.mp4"
    temp_dir = BASE_DIR / "assets" / "renders_cache" / slug
    temp_dir.mkdir(parents=True, exist_ok=True)

    voice_path = temp_dir / "voice.mp3"
    bgm_path = temp_dir / "bgm.mp3"
    master_audio = temp_dir / "master.mp3"

    # Select template by workflow
    template_map = {
        "HyperFrames": BASE_DIR / "templates" / "template-hyperframes-saas" / "index.html",
        "OneTake": BASE_DIR / "templates" / "template-onetake-kinetic" / "index.html",
        "Collage B-roll": BASE_DIR / "templates" / "template-collage-broll" / "index.html",
        "Claude Animation Base": BASE_DIR / "templates" / "template-claude-canvas2d" / "index.html",
        "Lemo Opuscar": BASE_DIR / "templates" / "template-lemo-opuscar" / "index.html"
    }
    template_html = template_map.get(workflow, template_map["HyperFrames"])

    # 1. Synthesize audio
    print(f"1. Synthesizing Voiceover narration...")
    narration_text = f"{title}. {entry['synopsis']}"
    preset = "cinematic-narrator" if "Lemo" in workflow or "OneTake" in workflow else "saas-explainer"
    subprocess.run([
        sys.executable, str(AUDIO_ENGINE), narration_text, str(voice_path), preset
    ], check=True)

    # 2. Synthesize ambient score
    print(f"2. Synthesizing Atmospheric score...")
    score_style = "cyberpunk-synthwave" if "Lemo" in workflow or "OneTake" in workflow else "lofi-warmth"
    subprocess.run([
        sys.executable, str(AMBIENT_ENGINE), score_style, str(bgm_path), str(preview_duration + 2)
    ], check=True)

    # 3. Mix master audio
    print(f"3. Mixing Master soundtrack with auto-ducking...")
    subprocess.run([
        sys.executable, str(MIXER_ENGINE), str(voice_path), str(bgm_path), str(master_audio)
    ], check=True)

    # 4. Render video frames with headless Chromium + FFmpeg
    print(f"4. Rendering composition frames to MP4 ({out_mp4})...")
    node_cmd = [
        "node", str(RENDER_SCRIPT),
        str(template_html),
        str(out_mp4),
        str(preview_duration),
        "30",
        str(master_audio)
    ]
    subprocess.run(node_cmd, check=True)
    print(f"🎉 Complete! Master Video: {out_mp4}")
    return str(out_mp4)

def main():
    parser = argparse.ArgumentParser(description="Render Animation Videos from Script Catalog")
    parser.add_argument("--list", action="store_true", help="List all catalog scripts")
    parser.add_argument("--id", type=str, help="Render specific script by ID")
    parser.add_argument("--index", type=int, help="Render specific script by index (1-52)")
    parser.add_argument("--all-styles", action="store_true", help="Render one video from each of the 5 styles")
    parser.add_argument("--duration", type=int, default=6, help="Render duration in seconds (default: 6)")
    args = parser.parse_args()

    catalog = load_catalog()

    if args.list:
        print(f"\n📜 Catalog contains {len(catalog)} scripts:")
        for item in catalog:
            print(f"  [{item['index']:02d}] {item['title']} ({item['workflow']}) - id: {item['id']}")
        return

    if args.id:
        match = next((item for item in catalog if item["id"] == args.id), None)
        if match:
            render_script_video(match, preview_duration=args.duration)
        else:
            print(f"Script with ID '{args.id}' not found.")
        return

    if args.index:
        match = next((item for item in catalog if item["index"] == args.index), None)
        if match:
            render_script_video(match, preview_duration=args.duration)
        else:
            print(f"Script with index '{args.index}' not found.")
        return

    if args.all_styles:
        # Pick one representative from each workflow
        workflows = ["HyperFrames", "OneTake", "Collage B-roll", "Claude Animation Base", "Lemo Opuscar"]
        for wf in workflows:
            item = next((s for s in catalog if s["workflow"] == wf), None)
            if item:
                render_script_video(item, preview_duration=args.duration)
        return

    print("Use --list to view scripts, --id <id> or --index <n> to render, or --all-styles to render all 5 workflows.")

if __name__ == "__main__":
    main()
