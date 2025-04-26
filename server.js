
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();
  
  // Serve static files from the dist directory
  app.use(express.static(join(__dirname, 'dist')));
  
  // Define specific API routes first
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
  });
  
  // Simple string path for the catch-all route to avoid path-to-regexp errors
  app.get('/*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
  
  // Get port from environment variable or use default 3000
  const PORT = process.env.PORT || 3000;
  
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
