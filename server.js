// server.js - Works both locally and on Render
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Check if dist folder exists (production build)
const distPath = path.join(__dirname, 'dist');
const isProduction = fs.existsSync(distPath);

if (isProduction) {
  // PRODUCTION: Serve built files from dist folder
  console.log('🟢 Production mode: Serving from dist folder');
  app.use(express.static(distPath));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // DEVELOPMENT: Show instructions to build first
  console.log('🟡 Development mode: No dist folder found');
  console.log('   Run: bun run build');
  console.log('   Then: bun run dev (for development)');
  console.log('   Or: bun run start (to test production)');
  
  app.get('*', (req, res) => {
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 40px;">
          <h1>Development Mode</h1>
          <p>To run in production mode:</p>
          <ol>
            <li>Run: <code>bun run build</code></li>
            <li>Then: <code>bun run start</code></li>
          </ol>
          <p>For development server: <code>bun run dev</code></p>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`   Mode: ${isProduction ? 'Production' : 'Development'}`);
});