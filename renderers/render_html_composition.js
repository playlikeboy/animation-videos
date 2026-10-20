import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Headless HTML5 / HyperFrames Video Renderer
 * Renders web compositions into MP4 videos with frame-accurate precision.
 */
export async function renderHtmlComposition({
  htmlPath,
  outputPath,
  audioPath = null,
  duration = 10,
  fps = 30,
  width = 1920,
  height = 1080
}) {
  const absoluteHtml = path.resolve(htmlPath);
  const absoluteOutput = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });

  const chromePath = process.env.CHROME_PATH || '/home/kunalkashyap8024/.local/bin/chrome';
  console.log(`🎬 Launching Chromium: ${chromePath}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--allow-file-access-from-files',
      '--allow-file-access',
      '--hide-scrollbars',
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  console.log(`📄 Loading composition: file://${absoluteHtml}`);
  await page.goto(`file://${absoluteHtml}`, { waitUntil: 'networkidle0' });

  // Setup FFmpeg process
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', `${fps}`,
    '-i', '-', // standard input
  ];

  if (audioPath && fs.existsSync(audioPath)) {
    ffmpegArgs.push('-i', path.resolve(audioPath));
    ffmpegArgs.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  }

  ffmpegArgs.push(
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-pix_fmt', 'yuv420p',
    absoluteOutput
  );

  console.log(`⚙️ Spawning FFmpeg to encode ${absoluteOutput}`);
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    // Optional debug logging
  });

  const totalFrames = Math.floor(duration * fps);
  console.log(`🎞️ Rendering ${totalFrames} frames (${duration}s @ ${fps}fps)...`);

  for (let frame = 0; frame < totalFrames; frame++) {
    const timestamp = frame / fps;

    // Seek all registered GSAP timelines in page
    await page.evaluate((t) => {
      if (window.__timelines) {
        for (const key of Object.keys(window.__timelines)) {
          const tl = window.__timelines[key];
          if (tl && typeof tl.time === 'function') {
            tl.time(t);
          }
        }
      }
      if (typeof window.seekFrame === 'function') {
        window.seekFrame(t);
      }
    }, timestamp);

    const buffer = await page.screenshot({ type: 'png', omitBackground: false });
    ffmpeg.stdin.write(buffer);

    if (frame % (fps * 2) === 0 || frame === totalFrames - 1) {
      const pct = Math.round((frame / totalFrames) * 100);
      process.stdout.write(`\r   Progress: ${pct}% (frame ${frame + 1}/${totalFrames})`);
    }
  }

  console.log('\n⏳ Finalizing video stream...');
  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Render successful: ${absoluteOutput}`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with error code ${code}`));
      }
    });
  });

  await browser.close();
  return absoluteOutput;
}

if (process.argv[1].endsWith('render_html_composition.js')) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node render_html_composition.js <htmlPath> <outputPath> [duration] [fps] [audioPath]');
    process.exit(1);
  }
  const [htmlPath, outputPath, durStr, fpsStr, audioPath] = args;
  renderHtmlComposition({
    htmlPath,
    outputPath,
    duration: parseFloat(durStr || '10'),
    fps: parseInt(fpsStr || '30', 10),
    audioPath
  }).catch((err) => {
    console.error('Render failed:', err);
    process.exit(1);
  });
}
