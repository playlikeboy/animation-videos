#!/usr/bin/env python3
"""
High-Fidelity AI Text-to-Speech Engine
Supports edge-tts neural voices with rate, pitch, volume control,
and word-level timing metadata.
"""

import os
import sys
import asyncio
import subprocess
from typing import Optional, Dict, Any

VOICE_PRESETS = {
    "cinematic-narrator": "en-US-ChristopherNeural",
    "saas-explainer": "en-US-JennyNeural",
    "energetic-tech": "en-US-GuyNeural",
    "dramatic-story": "en-US-AriaNeural",
    "british-documentary": "en-GB-RyanNeural",
    "gentle-reflective": "en-GB-SoniaNeural",
    "deep-philosophical": "en-US-EricNeural"
}

async def generate_speech_edge(
    text: str,
    output_path: str,
    voice: str = "en-US-ChristopherNeural",
    rate: str = "+0%",
    pitch: str = "+0Hz",
    volume: str = "+0%"
) -> Dict[str, Any]:
    """Generates speech using Microsoft Edge Neural TTS."""
    import edge_tts
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=volume)
    
    srt_path = os.path.splitext(output_path)[0] + ".srt"
    submaker = edge_tts.SubMaker()
    
    with open(output_path, "wb") as file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
                
    with open(srt_path, "w", encoding="utf-8") as file:
        file.write(submaker.get_srt())
        
    # Get duration using ffprobe
    duration = 0.0
    try:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", output_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        duration = float(res.stdout.strip())
    except Exception:
        pass
        
    return {
        "audio_path": output_path,
        "srt_path": srt_path,
        "duration": duration,
        "voice": voice,
        "text": text
    }

def synthesize_text(
    text: str,
    output_path: str,
    preset: str = "cinematic-narrator",
    rate: str = "+0%",
    pitch: str = "+0Hz"
) -> Dict[str, Any]:
    """Synchronous wrapper for speech synthesis."""
    voice = VOICE_PRESETS.get(preset, preset)
    try:
        return asyncio.run(generate_speech_edge(text, output_path, voice=voice, rate=rate, pitch=pitch))
    except Exception as e:
        print(f"[TTS Engine] Error generating voiceover via edge-tts: {e}", file=sys.stderr)
        # Fallback to local tone/sine placeholder if offline
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "sine=frequency=440:duration=3",
            output_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {
            "audio_path": output_path,
            "vtt_path": None,
            "duration": 3.0,
            "voice": "fallback-tone",
            "text": text
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 tts_engine.py '<text>' <output_path> [preset]")
        sys.exit(1)
    text_input = sys.argv[1]
    out_file = sys.argv[2]
    voice_preset = sys.argv[3] if len(sys.argv) > 3 else "cinematic-narrator"
    result = synthesize_text(text_input, out_file, preset=voice_preset)
    print(f"Generated: {result['audio_path']} (duration: {result['duration']:.2f}s)")
