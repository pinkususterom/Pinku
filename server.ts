import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Type definitions for Express routing
const app = express();
const PORT = 3000;

// simple memory cache to speed up loads and avoid rate limits
interface PhotoObject {
  baseUrl: string;
  videoUrl: string | null;
}
interface Cache {
  data: PhotoObject[];
  lastFetched: number;
}
let photosCache: Cache | null = null;
const CACHE_TTL = 3600 * 1000; // 1 hour caching

// Endpoint to fetch images from the Google Photos Shared Album
app.get('/api/photos', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  if (!forceRefresh && photosCache && (now - photosCache.lastFetched < CACHE_TTL)) {
    console.log('Serving Google Photos from memory cache. Count:', photosCache.data.length);
    res.json({ photos: photosCache.data });
    return;
  }

  const albumUrl = 'https://photos.app.goo.gl/PjsuDxjigo1t7JZ29';
  console.log('Fetching Google Photos Shared Album from:', albumUrl);

  try {
    const fetchResponse = await fetch(albumUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch album: ${fetchResponse.statusText}`);
    }

    const html = await fetchResponse.text();
    
    // Find all googleusercontent URLs starting with /pw/
    const matches = html.match(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+/g) || [];
    
    // Extract base URLs (removing query sizing parameters after '=')
    const baseUrls = matches.map(m => {
      const idx = m.indexOf('=');
      return idx !== -1 ? m.substring(0, idx) : m;
    });
    
    // Remove duplicates
    const uniqueBases = Array.from(new Set(baseUrls));

    // Extract video associations
    const assocRegex = /["'](https:\/\/video-downloads\.googleusercontent\.com\/[^"']+)["']\s*,\s*\[\s*["'](https:\/\/[a-z0-9.-]+\.googleusercontent\.com\/pw\/[^"']+)["']/gi;
    let assocMatch;
    const videoMap = new Map<string, string>();
    while ((assocMatch = assocRegex.exec(html)) !== null) {
      const videoUrl = assocMatch[1];
      let imgUrl = assocMatch[2];
      const idx = imgUrl.indexOf('=');
      if (idx !== -1) {
        imgUrl = imgUrl.substring(0, idx);
      }
      videoMap.set(imgUrl, videoUrl);
    }
    
    // Validate we got actual images
    if (uniqueBases.length === 0) {
      console.warn('Scraper returned 0 photos. Checking fallback matcher...');
      // Fallback: wider match in case of subdomain/path variations
      const genericMatches = html.match(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[a-zA-Z0-9\-_]+/g) || [];
      const genericBases = genericMatches
        .filter(m => !m.includes('/a/')) // exclude avatars
        .map(m => {
          const idx = m.indexOf('=');
          return idx !== -1 ? m.substring(0, idx) : m;
        });
      const genericUnique = Array.from(new Set(genericBases)).filter(u => u.length > 60); // exclude short static resource keys
      
      if (genericUnique.length > 0) {
        const fallbacksData = genericUnique.map(baseUrl => ({
          baseUrl,
          videoUrl: videoMap.get(baseUrl) || null
        }));
        photosCache = { data: fallbacksData, lastFetched: now };
        res.json({ photos: fallbacksData });
        return;
      }
    }

    const photosData = uniqueBases.map(baseUrl => ({
      baseUrl,
      videoUrl: videoMap.get(baseUrl) || null
    }));

    photosCache = { data: photosData, lastFetched: now };
    console.log('Successfully scraped novel shared album photos. Count:', photosData.length);
    res.json({ photos: photosData });
  } catch (error: any) {
    console.error('Error parsing shared album:', error);
    // If we have stale cache, serve that instead of failing
    if (photosCache) {
      console.log('Serving stale cache after fetch error');
      res.json({ photos: photosCache.data, warning: 'Using stale cache' });
    } else {
      res.status(500).json({ error: 'Failed to scrape photos from shared album link', details: error.message });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving configured.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT} in env: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
