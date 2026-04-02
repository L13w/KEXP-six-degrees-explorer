/**
 * Build-time data pipeline for the Six Degrees Week web app.
 *
 * Reads JSON files from the all-shows directory, filters to Six Degrees Week,
 * resolves KEXP streaming archive URLs, and outputs a single baked JSON file
 * that the web app imports at build time.
 *
 * Usage: node scripts/build-data.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(require('os').homedir(), 'Music', 'KEXP', 'all-shows');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'shows-data.json');

const SIX_DEGREES_START = new Date('2026-03-20T00:00:00-07:00');
const SIX_DEGREES_END = new Date('2026-03-28T00:00:00-07:00');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'KEXP-Six-Degrees-Builder/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Invalid JSON from ' + url)); }
      });
    }).on('error', reject);
  });
}

async function getStreamingUrl(timestampStr, location) {
  const url = `https://api.kexp.org/get_streaming_url/?bitrate=256&timestamp=${encodeURIComponent(timestampStr)}&location=${location}`;
  try {
    const data = await httpGet(url);
    return data['sg-url'] || null;
  } catch (e) {
    console.error('  API error:', e.message);
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('Reading JSON files from:', DATA_DIR);

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort();
  console.log(`Found ${files.length} JSON files`);

  const shows = [];
  const seen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const data = JSON.parse(raw);
    const startTime = new Date(data.show.start_time);

    // Filter to Six Degrees Week
    if (startTime < SIX_DEGREES_START || startTime >= SIX_DEGREES_END) continue;

    // Deduplicate by start_time + program_name
    const key = startTime.toISOString() + '|' + data.show.program_name;
    if (seen.has(key)) continue;
    seen.add(key);

    const baseName = file.replace('.json', '');

    shows.push({
      filename: baseName,
      show: data.show,
      tracks: data.tracks || [],
    });
  }

  console.log(`${shows.length} shows in Six Degrees Week`);

  // Resolve streaming URLs
  console.log('Resolving streaming archive URLs...');

  const output = [];

  for (let i = 0; i < shows.length; i++) {
    const s = shows[i];
    const startTime = new Date(s.show.start_time);
    const utcH = startTime.getUTCHours();
    const utcDate = startTime.toISOString().slice(0, 10);
    const ts = `${utcDate}T${String(utcH).padStart(2, '0')}:00:01Z`;

    // Determine location based on filename
    let location = 1;
    if (s.filename.includes('Vinelands')) location = 2;
    else if (s.filename.includes('Audioasis')) location = 3;

    const mp3Url = await getStreamingUrl(ts, location);

    if (mp3Url) {
      console.log(`  [${i + 1}/${shows.length}] ${s.show.program_name} -> OK`);
    } else {
      console.log(`  [${i + 1}/${shows.length}] ${s.show.program_name} -> NO URL`);
    }

    output.push({
      filename: s.filename,
      programName: s.show.program_name,
      programTags: s.show.program_tags || '',
      hosts: s.show.hosts || [],
      tagline: s.show.tagline || '',
      startTime: s.show.start_time,
      mp3StartTime: s.show.mp3_start_time || null,
      mp3Url: mp3Url,
      hostImage: s.show.host_image || '',
      programImage: s.show.program_image || '',
      tracks: s.tracks,
      hasMP3: !!mp3Url,
    });

    await sleep(200); // be polite to the API
  }

  const resolved = output.filter(s => s.mp3Url).length;
  console.log(`\nResolved ${resolved}/${output.length} streaming URLs`);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 0));

  const sizeMB = (fs.statSync(OUTPUT).size / (1024 * 1024)).toFixed(1);
  console.log(`Wrote ${OUTPUT} (${sizeMB} MB)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
