import puppeteer from '../renderers/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const snapshots = [
  { time: 15, name: 'frame-01-at-15s.png', label: 'Scene 1: The Two Hemispheres & Corpus Callosum' },
  { time: 82, name: 'frame-02-at-82s.png', label: 'Scene 2: The Severed Bridge & Alien Hand Conflict' },
  { time: 146, name: 'frame-03-at-146s.png', label: 'Scene 3: The Tachistoscope Experiment (Snow vs Chicken)' },
  { time: 205, name: 'frame-04-at-205s.png', label: 'Scene 4: The Left-Brain Interpreter Fabricates' },
  { time: 275, name: 'frame-05-at-275s.png', label: 'Scene 5: The Symphony of the Modular Mind' }
];

async function capture() {
  const chromePath = process.env.CHROME_PATH || '/home/kunalkashyap8024/.local/bin/chrome';
  const htmlPath = path.resolve('the-split-brain-paradox/index.html');
  const snapDir = path.resolve('the-split-brain-paradox/snapshots');
  fs.mkdirSync(snapDir, { recursive: true });

  console.log('📸 Launching Chromium for Snapshot Capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  for (const s of snapshots) {
    console.log(`  Taking snapshot at t=${s.time}s (${s.label})...`);
    await page.evaluate((t) => {
      if (typeof window.seekFrame === 'function') {
        window.seekFrame(t);
      }
    }, s.time);

    const outPath = path.join(snapDir, s.name);
    await page.screenshot({ path: outPath });
  }

  await browser.close();
  console.log('✓ All snapshots captured.');

  // Create contact sheet with FFmpeg tile
  try {
    const tileCmd = `ffmpeg -y -i "${snapDir}/frame-01-at-15s.png" -i "${snapDir}/frame-02-at-82s.png" -i "${snapDir}/frame-03-at-146s.png" -i "${snapDir}/frame-04-at-205s.png" -i "${snapDir}/frame-05-at-275s.png" -filter_complex "[0:v][1:v][2:v][3:v][4:v]xstack=inputs=5:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0[out]" -map "[out]" -q:v 2 "${snapDir}/contact-sheet.jpg"`;
    execSync(tileCmd);
    console.log('✓ Contact sheet generated at snapshots/contact-sheet.jpg');
  } catch (e) {
    console.log('Tile montage fallback:', e.message);
  }
}

capture().catch(console.error);
