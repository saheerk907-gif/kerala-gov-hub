# 🏛️ Kerala Gov Employee Hub

കേരള സർക്കാർ ജീവനക്കാർക്കായുള്ള സമഗ്ര വിവര പോർട്ടൽ

**Tech Stack:** Next.js 14 + Supabase + Tailwind CSS → Deploy on Vercel (Free)

---

## 📋 Features

- ✅ Malayalam UI with Apple-style animations
- ✅ Kerala Government emblem and branding
- ✅ Dynamic content from Supabase database
- ✅ **Admin Panel** — Add/Edit/Delete Government Orders, Schemes, Links
- ✅ PDF upload for GO documents
- ✅ Category filtering for orders (DA, Bonus, Leave, MEDISEP, etc.)
- ✅ Real GO data pre-seeded (G.O. numbers & dates from finance.kerala.gov.in)
- ✅ Auto-refresh (ISR — updates every 60 seconds)
- ✅ Fully responsive (mobile + desktop)

---

## 🚀 Setup Guide (Step-by-Step)

### Step 1: Create Supabase Project (FREE)

1. Go to **[supabase.com](https://supabase.com)** → Sign up (free)
2. Click **"New Project"**
3. Give it a name like `kerala-gov-hub`
4. Choose a strong **database password** (save it!)
5. Select **region**: Mumbai (ap-south-1) for best latency
6. Click **Create project** — wait 2 minutes

### Step 2: Setup Database

1. In Supabase dashboard → Click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the ENTIRE contents of **`supabase/schema.sql`** file
4. Paste into the SQL editor
5. Click **"Run"** — this creates all tables + seed data
6. ✅ You should see "Success" message

### Step 3: Create Admin User

1. In Supabase → **Authentication** → **Users** tab
2. Click **"Add user"** → **"Create new user"**
3. Enter your email & password (this will be your admin login)
4. ✅ Note down the email and password

### Step 4: Get Supabase Keys

1. Go to **Settings** → **API** (in Supabase dashboard)
2. Copy these values:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon/public key** → `eyJhbG...`
   - **service_role key** → `eyJhbG...` (under "Service role" section)

### Step 5: Setup Local Project

```bash
# Clone/download this project
cd kerala-gov-hub

# Install dependencies
npm install

# Create env file
cp .env.local.example .env.local

# Edit .env.local with your Supabase keys:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run dev server
npm run dev
```

Open **http://localhost:3000** → Public site
Open **http://localhost:3000/admin** → Admin panel

### Step 6: Deploy to Vercel (FREE)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Kerala Gov Hub"
git remote add origin https://github.com/YOUR_USERNAME/kerala-gov-hub.git
git push -u origin main
```

2. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
3. Click **"Import Project"** → Select your repo
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
5. Click **"Deploy"** → Wait 2 minutes
6. ✅ Your site is live at `https://your-project.vercel.app`

### Step 7: Custom Domain (Optional)

1. Buy a `.in` domain (~₹500/year) from GoDaddy/Hostinger
2. In Vercel → **Settings** → **Domains** → Add your domain
3. Update DNS as instructed by Vercel
4. ✅ Site live at `https://yoursite.in`

---

## 🔧 Project Structure

```
kerala-gov-hub/
├── supabase/
│   └── schema.sql          # Database schema + seed data
├── src/
│   ├── lib/
│   │   └── supabase.js     # Supabase client + data functions
│   ├── components/
│   │   ├── Navbar.js        # Navigation bar
│   │   ├── Hero.js          # Hero section
│   │   ├── Particles.js     # Animated background
│   │   ├── StatsBar.js      # Animated stats counter
│   │   ├── SchemesSection.js # KSR, MEDISEP, GPF, NPS, SLI, GIS cards
│   │   ├── HighlightsSection.js # Benefits section
│   │   ├── OrdersSection.js # Government orders list
│   │   ├── QuickLinksSection.js # Quick links grid
│   │   └── Footer.js
│   └── app/
│       ├── layout.js        # Root layout
│       ├── globals.css      # Global styles
│       ├── page.js          # Public homepage (fetches from DB)
│       └── admin/
│           ├── layout.js    # Admin sidebar layout
│           ├── page.js      # Dashboard
│           ├── login/page.js # Login page
│           ├── orders/page.js # CRUD for Government Orders
│           ├── schemes/page.js # Manage schemes
│           └── links/page.js # Manage quick links
├── package.json
├── next.config.js
├── tailwind.config.js
└── .env.local.example
```

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `government_orders` | All GOs with GO number, date, category, PDF link |
| `schemes` | MEDISEP, GPF, NPS, SLI, GIS, KSR |
| `scheme_details` | Expandable bullet points for each scheme |
| `scheme_tags` | Tags shown on scheme cards |
| `quick_links` | Portal links (SPARK, Treasury, etc.) |
| `site_stats` | Homepage animated counter stats |
| `highlights` | Benefits section cards |
| `highlight_tags` | Tags for highlight cards |
| `uploaded_files` | Uploaded PDF tracking |

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid (if needed) |
|---------|-----------|-------------------|
| **Vercel** | 100GB bandwidth, unlimited deploys | $20/mo |
| **Supabase** | 500MB DB, 1GB storage, 50K requests | $25/mo |
| **Domain (.in)** | — | ~₹500/year |
| **Total** | **₹0/month** | ₹500/year for domain |

---

## 🔄 How to Add New GO

1. Go to `/admin` → Login
2. Click **"ഉത്തരവുകൾ"** in sidebar
3. Click **"+ പുതിയ ഉത്തരവ്"**
4. Fill in Malayalam title, GO number, date, category
5. Upload PDF if available
6. Click **"ചേർക്കുക"**
7. ✅ Appears on public site within 60 seconds

---

## 📝 Notes

- Data pre-seeded with real Kerala GO numbers from finance.kerala.gov.in
- Kerala Coat of Arms loaded from Wikimedia Commons
- All text in Malayalam (Noto Sans Malayalam font)
- Admin authentication via Supabase Auth
- ISR (Incremental Static Regeneration) for performance
