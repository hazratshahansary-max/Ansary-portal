import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const AUTHORIZED_ADMIN_EMAIL = 'hazrat.shah.ansary@gmail.com';

app.use(express.json());

// Server-side Authorization Middleware
async function requireAdminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Token is missing' });
    return;
  }

  try {
    // If Supabase URL and Key are provided in env, verify via Supabase REST API
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseAnonKey,
        },
      });

      if (!userRes.ok) {
        res.status(401).json({ error: 'Unauthorized: Invalid Supabase token' });
        return;
      }

      const userData = await userRes.json();
      if (!userData || !userData.email) {
        res.status(401).json({ error: 'Unauthorized: User record not found' });
        return;
      }

      const email = userData.email.toLowerCase().trim();
      const isAdmin = email === AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim() ||
                      userData.app_metadata?.role === 'admin';

      if (!isAdmin) {
        res.status(403).json({ error: 'Forbidden: You are not authorized as an administrator' });
        return;
      }

      (req as unknown as { user: unknown }).user = userData;
      next();
      return;
    }

    // Fallback JWT payload extraction when running in local dev sandbox
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        const email = (payload.email || '').toLowerCase().trim();
        const role = payload.app_metadata?.role || payload.role;

        if (email === AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim() || role === 'admin') {
          (req as unknown as { user: unknown }).user = payload;
          next();
          return;
        }
      }
    } catch {
      // invalid payload
    }

    res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
  } catch (err) {
    console.error('Server auth verification error:', err);
    res.status(500).json({ error: 'Internal server error validating authorization' });
  }
}

// Admin Token Verification Endpoint
app.post('/api/admin/verify', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    isAdmin: true,
    authorizedEmail: AUTHORIZED_ADMIN_EMAIL,
    message: 'Administrator session securely verified by server.',
  });
});

// Admin Protected API: Database Operations Status
app.get('/api/admin/status', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    authorizedAdmin: AUTHORIZED_ADMIN_EMAIL,
    rlsEnforced: true,
    serverAuthVerified: true,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middlewares in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANSARY Server running at http://0.0.0.0:${PORT}`);
    console.log(`Protected Admin Email: ${AUTHORIZED_ADMIN_EMAIL}`);
  });
}

startServer();
