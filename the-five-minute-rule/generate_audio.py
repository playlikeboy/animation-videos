import subprocess
import os

os.makedirs("assets/audio/voiceovers", exist_ok=True)
os.makedirs("assets/audio/sfx", exist_ok=True)
os.makedirs("assets/audio/music", exist_ok=True)

voiceover_lines = {
    "scene1": (
        "Every morning begins with a negotiation with yourself. "
        "You promised that today would be different. "
        "But when 5:30 arrives, the mountain feels too steep to climb. "
        "So you hit snooze. And the days slip through your fingers."
    ),
    "scene2": (
        "We don't fail because we are lazy. We fail because our ambition is violent. "
        "We expect ourselves to cross the entire ocean in a single jump. "
        "And because the jump feels impossible, we never even take the first step."
    ),
    "scene3": (
        "Hi. It's been a while. "
        "You don't need to conquer the entire marathon today. "
        "Forget the ten kilometers. Can you just step out your door for five minutes?"
    ),
    "scene4": (
        "The first sixty seconds feel heavy. Your mind invents ten reasons to turn back. "
        "Yet with every stride down the quiet road, the resistance fades. "
        "You aren't fighting the mountain anymore. You're just taking the next step."
    ),
    "scene5": (
        "A mountain is not moved all at once; it is moved stone by stone. "
        "You don't need endless motivation to change your life. "
        "You only need the courage to give yourself five minutes."
    )
}

print("1. Generating Voiceovers using macOS speech synthesis...")
for scene, text in voiceover_lines.items():
    aiff_path = f"assets/audio/voiceovers/{scene}.aiff"
    mp3_path = f"assets/audio/voiceovers/{scene}.mp3"
    print(f"   Generating {scene} voiceover...")
    # Generate speech with Oliver or Daniel or Samantha
    subprocess.run(["say", "-v", "Daniel", "-r", "160", text, "-o", aiff_path], check=True)
    subprocess.run(["ffmpeg", "-y", "-i", aiff_path, "-af", "volume=1.3", mp3_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(aiff_path):
        os.remove(aiff_path)

print("2. Generating Alarm Beep SFX...")
subprocess.run([
    "ffmpeg", "-y", "-f", "lavfi",
    "-i", "sine=frequency=880:duration=0.15",
    "-af", "volume=0.5,apad=pad_dur=0.15,aloop=loop=5:size=13230",
    "assets/audio/sfx/alarm-beep.mp3"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

print("3. Generating Timer Chime SFX...")
subprocess.run([
    "ffmpeg", "-y", "-f", "lavfi",
    "-i", "sine=frequency=1046.50:duration=2.5",
    "-af", "volume=0.7,afade=t=out:st=0.2:d=2.3",
    "assets/audio/sfx/timer-chime.mp3"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

print("4. Generating Ambient Cinematic Drone Track (300 seconds)...")
# Soft harmonic minor chord drone: D2 (73.42Hz), A2 (110Hz), F3 (174.61Hz), C4 (261.63Hz) with lowpass filter
subprocess.run([
    "ffmpeg", "-y",
    "-f", "lavfi", "-i", "sine=frequency=73.42:duration=300",
    "-f", "lavfi", "-i", "sine=frequency=110.00:duration=300",
    "-f", "lavfi", "-i", "sine=frequency=174.61:duration=300",
    "-f", "lavfi", "-i", "sine=frequency=261.63:duration=300",
    "-filter_complex",
    "[0:a][1:a][2:a][3:a]amix=inputs=4:duration=longest[mixed];"
    "[mixed]lowpass=f=450,volume=0.18,afade=t=in:st=0:d=4,afade=t=out:st=294:d=6[out]",
    "-map", "[out]",
    "assets/audio/music/ambient-soundtrack.mp3"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

print("✓ All audio assets successfully created!")
