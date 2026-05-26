# Titanic Travel — Full Deployment Guide
## VSCode Local Setup → Vercel (Frontend) + Render (Backend)

---

## What you're deploying

| Layer | Technology | Where |
|---|---|---|
| Frontend | React + Vite | Vercel (free) |
| API Server | Express 5 | Render (free) |
| Database | PostgreSQL + Drizzle | Neon (you already have this) |
| Auth | Clerk | Clerk dashboard |
| Emails | Resend | Resend (already configured) |

---

# PART 1 — Run locally in VSCode

## Step 1 — Extract the archive

**Windows 11:** Right-click the `.tar.gz` → Extract All
**Windows 10:** Download [7-Zip](https://www.7-zip.org/) → right-click → 7-Zip → Extract Here

Then open the extracted folder in VSCode:
`File → Open Folder → select the folder`

---

## Step 2 — Install Node.js 24 and pnpm

1. Download **Node.js v24 LTS** from [nodejs.org](https://nodejs.org) → run the `.msi` installer
2. Open the VSCode terminal (`Ctrl + backtick`) and run:
```
npm install -g pnpm
```
Verify both work:
```
node -v     ← should say v24.x.x
pnpm -v     ← should say 9.x or 10.x
```

---

## Step 3 — Create your Clerk account and app

1. Go to [clerk.com](https://clerk.com) → Sign up free
2. Click **Create application** → name it "Titanic Travel"
3. Enable **Email + Password** sign-in (tick Google too if you want)
4. Click **API Keys** in the left sidebar
5. Copy your **Publishable key** (starts with `pk_test_`) and **Secret key** (starts with `sk_test_`)
6. Under **Domains** add: `http://localhost:5173`

---

## Step 4 — Create your two `.env` files

In VSCode's file explorer, go into `artifacts/api-server/` → right-click → **New File** → name it `.env`

Paste this in and fill in your values:
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_R1e8h855_Aoec8RP1pUgTVqePwmWcwe1c
FROM_EMAIL=onboarding@resend.dev
SITE_URL=http://localhost:5173
PORT=3001
BASE_PATH=/api
NODE_ENV=development
```

> **FROM_EMAIL note:** `onboarding@resend.dev` only sends to the email address registered on your Resend account — perfect for testing.
> For production you'll change this to your own domain email (e.g. `bookings@yourdomain.com`) after verifying your domain in Resend.

Now create `artifacts/titanic-travel/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
VITE_API_BASE_URL=http://localhost:3001
```

> Your Neon connection string is found in the Neon dashboard → your project → **Connection string** → toggle to show the full string.

---

## Step 5 — Install packages and push the database schema

In the VSCode terminal (make sure you're in the project root folder):
```
pnpm install
pnpm --filter @workspace/db run push
```
Type `y` when prompted to confirm. This creates all tables in your Neon database.

---

## Step 6 — Run locally (two terminals)

Click **+** to open a second terminal in VSCode.

**Terminal 1 — API server:**
```
pnpm --filter @workspace/api-server run dev
```
You'll see: `Server listening on port 3001` and `Seeded X flights`

**Terminal 2 — Frontend:**
```
pnpm --filter @workspace/titanic-travel run dev
```

Open **http://localhost:5173** in your browser. Sign up, book a flight — you'll receive a confirmation email at your Resend account email.

---

# PART 2 — Deploy frontend to Vercel

## Step 1 — Push your code to GitHub

Create a free account at [github.com](https://github.com) if you don't have one.

In the VSCode terminal:
```
git init
git add .
git commit -m "Titanic Travel initial commit"
```

Go to GitHub → click **+** (top right) → **New repository** → name it `titanic-travel` → **Create repository**

GitHub will show you commands. Run these in VSCode terminal:
```
git remote add origin https://github.com/YOUR_USERNAME/titanic-travel.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up free (use your GitHub account)
2. Click **Add New → Project**
3. Find and import your `titanic-travel` GitHub repo
4. Vercel shows configuration options. Set these **exactly**:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `artifacts/titanic-travel` |
| Build Command | `cd ../.. && pnpm --filter @workspace/titanic-travel run build` |
| Output Directory | `dist` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |

---

## Step 3 — Add environment variables in Vercel

In the Vercel project setup page, scroll to **Environment Variables** and add:

| Name | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_xxxxxx` (your Clerk publishable key) |
| `VITE_API_BASE_URL` | Leave blank for now — you'll add this after Render is set up |

Click **Deploy**. Vercel will build your frontend and give you a URL like:
`https://titanic-travel.vercel.app`

Copy this URL — you'll need it for Clerk and Render.

---

## Step 4 — Update Clerk with your Vercel domain

1. Go back to [clerk.com](https://clerk.com) → your app
2. Under **Domains** → **Add domain** → paste your Vercel URL (e.g. `https://titanic-travel.vercel.app`)
3. This allows Clerk auth to work on your deployed site

---

# PART 3 — Deploy API to Render

## Step 1 — Create a Render account

Go to [render.com](https://render.com) → **Get Started Free** → sign up with GitHub

---

## Step 2 — Create a new Web Service

1. Click **New → Web Service**
2. Connect your GitHub repo (`titanic-travel`)
3. Configure it:

| Setting | Value |
|---|---|
| Name | `titanic-travel-api` |
| Region | Pick closest to you |
| Root Directory | `artifacts/api-server` |
| Runtime | Node |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build` |
| Start Command | `node dist/index.js` |
| Instance Type | Free |

---

## Step 3 — Add environment variables in Render

In the Render service settings → **Environment** tab → add these:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your full Neon connection string |
| `CLERK_SECRET_KEY` | `sk_test_xxxxxx` (your Clerk secret key) |
| `RESEND_API_KEY` | `re_R1e8h855_Aoec8RP1pUgTVqePwmWcwe1c` |
| `FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain email) |
| `SITE_URL` | `https://titanic-travel.vercel.app` (your Vercel URL) |
| `PORT` | `10000` |
| `BASE_PATH` | `/api` |
| `NODE_ENV` | `production` |

Click **Create Web Service**. Render will deploy your API and give you a URL like:
`https://titanic-travel-api.onrender.com`

---

## Step 4 — Connect frontend to your live API

1. Go back to **Vercel → your project → Settings → Environment Variables**
2. Add:

| Name | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://titanic-travel-api.onrender.com` |

3. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

---

## Step 5 — Final Clerk update

1. Go to [clerk.com](https://clerk.com) → your app → **Domains**
2. Also add your Render API domain: `https://titanic-travel-api.onrender.com`

---

## You're live!

Your site is now fully deployed:
- **Frontend:** `https://titanic-travel.vercel.app`
- **API:** `https://titanic-travel-api.onrender.com`
- **Emails:** Sent via Resend on every booking

---

## How emails work

| When | What happens |
|---|---|
| User completes booking | Resend sends a branded HTML confirmation email |
| Email includes | Reference number, flight details, passenger names, total price, "View booking" button |
| Sender | `onboarding@resend.dev` (dev) or your own domain (after verification) |

### To use your own email domain in production

1. Go to [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Follow the DNS verification steps (add the TXT/MX records to your domain provider)
3. Once verified, change `FROM_EMAIL` to something like `bookings@yourdomain.com` in both Render and your local `.env`

---

## Troubleshooting

**Render API not starting**
- Check the Render logs — most common cause is a missing env var
- Make sure `PORT=10000` (Render uses port 10000, not 3001)

**"Unauthorized" errors after deploy**
- Your `CLERK_SECRET_KEY` may be wrong or missing on Render
- Make sure you've added your Vercel domain to Clerk's allowed domains

**Emails not arriving**
- Check your spam folder
- With `onboarding@resend.dev`, emails only go to the Resend account owner email
- Check the Render logs for any `Resend email failed` messages

**Database connection error on Render**
- Make sure your Neon connection string ends with `?sslmode=require`
- Neon free tier hibernates — the first request after inactivity may be slow (10–15s)

**Vercel build fails**
- Double-check the Root Directory is set to `artifacts/titanic-travel`
- Make sure the Install Command navigates to the workspace root: `cd ../.. && pnpm install`
