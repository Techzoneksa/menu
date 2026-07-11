# Deploy to Hostinger Cloud Hosting

## Before You Start

You need:
1. ✅ Hostinger Cloud Hosting account
2. ✅ Supabase project with `.env.local` values ready
3. ✅ Git installed locally

---

## Step 1: Push to GitHub

```bash
cd "D:\MENU MAHER\maher-kaif"
git init
git add .
git commit -m "Initial commit"
```

Create a **private** GitHub repo, then:

```bash
git remote add origin https://github.com/YOUR-USER/maher-kaif.git
git push -u origin main
```

---

## Step 2: Connect to Hostinger

1. Login to **hPanel** → **Websites** → your site → **Dashboard**
2. Go to **Advanced** → **Terminal** (or use SSH)
3. Or go to **Advanced** → **Git** → **Deploy from Repository**

### Option A: Git Deploy (Recommended)

1. In hPanel → **Advanced** → **Git**
2. Click **Deploy from Repository**
3. Enter your GitHub repo URL
4. Set **Branch**: `main`
5. Set **Run commands after pull**:
```bash
npm install && npm run build
```

### Option B: Terminal Deploy

SSH into your server and run:

```bash
cd ~/maher-kaif
git pull origin main
npm install
npm run build
```

---

## Step 3: Setup Node.js App

1. In hPanel → **Advanced** → **Setup Node.js App**
2. Click **Create Application**
3. Settings:
   - **Node.js Version**: `18` or `20`
   - **Application Mode**: `Production`
   - **Application Root**: `maher-kaif` (or your folder name)
   - **Application Startup File**: `server.js`
4. Click **Create**

### Create `server.js`

Create this file in your project root:

```js
const { createServer } = require('http');
const next = require('next');

const dev = false;
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

---

## Step 4: Environment Variables

1. In hPanel → **Setup Node.js App** → your app → **⋮** → **Settings** → **Environment Variables**
2. Add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Or create `.env.local` via File Manager/SSH:

```bash
cd ~/maher-kaif
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF
```

---

## Step 5: Database Setup

Make sure all 3 migrations are run in Supabase SQL Editor:

```bash
# In Supabase Dashboard → SQL Editor
# Run these in order:
# 1. src/supabase/migrations/001_initial_schema.sql
# 2. src/supabase/migrations/002_storage_buckets.sql
# 3. src/supabase/migrations/003_admin_rbac.sql
# 4. src/supabase/seed.sql
```

Create admin user:
```sql
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'admin@maherkaif.com';
```

---

## Step 6: Start the App

In hPanel → **Setup Node.js App** → your app → **⋮** → **Start**

Or via terminal:
```bash
cd ~/maher-kaif
pm2 start npm --name "maher-kaif" -- start
```

---

## Step 7: Verify

1. Visit your domain
2. Go to `/menu` — should show menu
3. Go to `/admin/login` — should show login page
4. Login with admin credentials

---

## Troubleshooting

### App won't start
```bash
cd ~/maher-kaif
cat .next/server/app/index.html  # Check if build exists
npm run build                    # Rebuild if needed
```

### Port issues
Hostinger usually auto-assigns a port. Check:
```bash
pm2 logs maher-kaif
```

### Memory issues
If build fails with OOM, try:
```bash
NODE_OPTIONS="--max-old-space-size=1024" npm run build
```

### Environment variables not loading
Restart the app after changing env vars:
```bash
pm2 restart maher-kaif
```
