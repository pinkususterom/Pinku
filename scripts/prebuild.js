import fs from 'fs';
import path from 'path';

const ALBUM_URL = 'https://photos.app.goo.gl/PjsuDxjigo1t7JZ29';
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'utils', 'photos.json');

async function scrapeGooglePhotos() {
  console.log('[Pre-build] Fetching Google Photos Shared Album:', ALBUM_URL);
  try {
    const response = await fetch(ALBUM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch album: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Find all googleusercontent URLs starting with /pw/
    const matches = html.match(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+/g) || [];
    
    // Extract base URLs (removing query sizing parameters after '=')
    const baseUrls = matches.map(m => {
      const idx = m.indexOf('=');
      return idx !== -1 ? m.substring(0, idx) : m;
    });
    
    // Remove duplicates
    const uniqueBases = Array.from(new Set(baseUrls));
    console.log('[Pre-build] Found initial match count:', uniqueBases.length);

    // Extract video associations
    const assocRegex = /["'](https:\/\/video-downloads\.googleusercontent\.com\/[^"']+)["']\s*,\s*\[\s*["'](https:\/\/[a-z0-9.-]+\.googleusercontent\.com\/pw\/[^"']+)["']/gi;
    let assocMatch;
    const videoMap = new Map();
    while ((assocMatch = assocRegex.exec(html)) !== null) {
      const videoUrl = assocMatch[1];
      let imgUrl = assocMatch[2];
      const idx = imgUrl.indexOf('=');
      if (idx !== -1) {
        imgUrl = imgUrl.substring(0, idx);
      }
      videoMap.set(imgUrl, videoUrl);
    }
    
    let photosData = [];

    if (uniqueBases.length === 0) {
      console.warn('[Pre-build] Scraper returned 0 photos on main regex. Trying fallback...');
      const genericMatches = html.match(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[a-zA-Z0-9\-_]+/g) || [];
      const genericBases = genericMatches
        .filter(m => !m.includes('/a/')) // exclude avatars
        .map(m => {
          const idx = m.indexOf('=');
          return idx !== -1 ? m.substring(0, idx) : m;
        });
      const genericUnique = Array.from(new Set(genericBases)).filter(u => u.length > 60);
      
      if (genericUnique.length > 0) {
        photosData = genericUnique.map(baseUrl => ({
          baseUrl,
          videoUrl: videoMap.get(baseUrl) || null
        }));
      }
    } else {
      photosData = uniqueBases.map(baseUrl => ({
        baseUrl,
        videoUrl: videoMap.get(baseUrl) || null
      }));
    }

    if (photosData.length > 0) {
      const outputData = {
        photos: photosData,
        lastUpdated: new Date().toISOString()
      };
      
      fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputData, null, 2), 'utf-8');
      console.log(`[Pre-build] Successfully scraped & wrote ${photosData.length} photos to ${OUTPUT_PATH}`);
    } else {
      console.warn('[Pre-build] No photos found. Keeping current or writing default structure.');
      ensureDefaultPhotosJson();
    }
  } catch (error) {
    console.error('[Pre-build] Error scraping Google Photos on build. Using local fallback:', error);
    ensureDefaultPhotosJson();
  }
}

function ensureDefaultPhotosJson() {
  if (!fs.existsSync(OUTPUT_PATH)) {
    console.log('[Pre-build] Creating default photos JSON.');
    const defaultData = {
      photos: [],
      lastUpdated: new Date().toISOString(),
      note: "No online shared album parsed yet. Falls back dynamically to local beautiful images."
    };
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  } else {
    console.log('[Pre-build] Existing photos JSON remains unchanged.');
  }
}

scrapeGooglePhotos();
