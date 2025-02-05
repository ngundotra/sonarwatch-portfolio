import { startServer } from '../src/utils/fetcher-server';

// Start with NX configuration
const port = process.env['NX_PORT'] || 3000;
const cacheEnabled = process.env['NX_CACHE'] === 'true';

startServer({
  port: Number(port),
  cache: cacheEnabled
}); 
