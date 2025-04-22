
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  
  // Serve static files from the dist directory
  app.use(express.static(join(__dirname, 'dist')));
  
  // Define specific routes first (if needed)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // All other routes should serve the index.html file (for SPA)
  // Make sure to use a simple string pattern without regex or parameters
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
  
  // Get port from environment variable or use default 3000
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
