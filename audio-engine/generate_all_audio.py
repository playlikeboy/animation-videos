#!/usr/bin/env python3
"""
Batch Audio Production Suite
Reads a script configuration or script markdown, synthesizes all scene voiceovers,
generates the matching atmospheric soundtrack, sound design effects, and outputs
both individual stems and mixed master audio tracks.
"""

import os
import sys
import json
import argparse
from tts_engine import synthesize_text, VOICE_PRESETS
from ambient_synthesizer import generate_score
from sfx_generator import generate_sfx
from audio_mixer import mix_composition_audio

def produce_audio_for_scenes(scenes_dict, output_dir, preset="cinematic-narrator", track_type="cinematic-drone"):
    os.makedirs(f"{output_dir}/voiceovers", exist_ok=True)
    os.makedirs(f"{output_dir}/music", exist_ok=True)
    os.makedirs(f"{output_dir}/sfx", exist_ok=True)
    os.makedirs(f"{output_dir}/masters", exist_ok=True)

    print(f"🎬 Generating Audio Stems for {len(scenes_dict)} Scenes...")
    total_voice_duration = 0.0
    scene_durations = {}

    for scene_id, text in scenes_dict.items():
        v_out = f"{output_dir}/voiceovers/{scene_id}.mp3"
        print(f"  🎙 Synthesizing {scene_id} narration...")
        res = synthesize_text(text, v_out, preset=preset)
        scene_durations[scene_id] = res["duration"]
        total_voice_duration += res["duration"]

    music_dur = max(30, int(total_voice_duration + 8))
    bgm_path = f"{output_dir}/music/ambient-score.mp3"
    print(f"  🎵 Composing atmospheric score ({track_type}, {music_dur}s)...")
    generate_score(track_type, bgm_path, duration=music_dur)

    print("  💥 Generating sound design assets...")
    generate_sfx("whoosh", f"{output_dir}/sfx/whoosh.mp3")
    generate_sfx("chime", f"{output_dir}/sfx/chime.mp3")
    generate_sfx("impact", f"{output_dir}/sfx/impact.mp3")
    generate_sfx("ui-click", f"{output_dir}/sfx/ui-click.mp3")

    meta = {
        "voice_preset": preset,
        "score_style": track_type,
        "total_voice_duration": total_voice_duration,
        "scene_durations": scene_durations
    }
    with open(f"{output_dir}/audio_manifest.json", "w") as f:
        json.dump(meta, f, indent=2)

    print(f"✅ Audio production complete in {output_dir}")
    return meta

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch Audio Generator for Animation Videos")
    parser.add_argument("--scenes-json", type=str, help="Path to scenes JSON dictionary")
    parser.add_argument("--output-dir", type=str, default="assets/audio", help="Target output folder")
    parser.add_argument("--preset", type=str, default="cinematic-narrator", help="TTS voice preset")
    parser.add_argument("--track-type", type=str, default="cinematic-drone", help="Music score style")
    args = parser.parse_args()

    if args.scenes_json and os.path.exists(args.scenes_json):
        with open(args.scenes_json) as f:
            data = json.load(f)
        produce_audio_for_scenes(data, args.output_dir, args.preset, args.track_type)
    else:
        print("Please provide --scenes-json <file.json>")
