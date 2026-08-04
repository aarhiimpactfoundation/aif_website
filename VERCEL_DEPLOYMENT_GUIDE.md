# Aarhi Impact Foundation - Vercel Deployment Guide

This guide explains how to deploy the complete Aarhi Impact Foundation website to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **MongoDB Atlas Account** - For the database (free tier available)

---

## Step 1: Set Up MongoDB Atlas

If you haven't already set up MongoDB Atlas:

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account and sign in
3. Create a new cluster (free M0 tier is sufficient)
4. In "Database Access", create a database user:
   - Username: `aarhiadmin` (or your choice)
   - Password: Generate a secure password
5. In "Network Access", add IP address: `0.0.0.0/0` (allows all IPs for Vercel)
6. Click "Connect" on your cluster, choose "Connect your application"
7. Copy the connection string, it looks like:
   ```
   mongodb+srv://aarhiadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password

---

## Step 2: Push Code to GitHub

1. In Emergent, click "Save to GitHub" to push your code
2. Note your repository URL (e.g., `https://github.com/yourusername/aarhi-impact-foundation`)

---

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings from `vercel.json`

### Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `DB_NAME` | `aarhi_foundation_db` |
| `JWT_SECRET` | A strong random string (e.g., `your-super-secret-jwt-key-2026`) |
| `RESEND_API_KEY` | `re_Z6WL5vcz_LS5ZM8weRKdgYcZqs7Q5uz5f` |
| `SENDER_EMAIL` | `notifications@aarhiimpactfoundation.org` |
| `NOTIFICATION_EMAIL` | `info@aarhiimpactfoundation.org` |
| `ENVIRONMENT` | `production` |

5. Click "Deploy"

---

## Step 4: Verify Deployment

After deployment completes:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the website navigation
3. Test the API: visit `https://your-project.vercel.app/api/health`
4. Test admin login at `/admin/login`

---

## Step 5: Configure Custom Domain (Optional)

To use your own domain (e.g., `aarhiimpactfoundation.org`):

1. In Vercel Dashboard, go to your project → Settings → Domains
2. Add your domain
3. Update your domain's DNS settings:
   - Add an A record pointing to Vercel's IP
   - Or add a CNAME record pointing to `cname.vercel-dns.com`
4. Vercel will automatically provision SSL certificates

---

## Admin Access

- **URL**: `/admin/login`
- **Email**: `admin@aarhiimpactfoundation.org`
- **Password**: `AIF@2026`

**Important**: Change the admin password after first login!

---

## Project Structure (for reference)

```
/
├── api/
│   └── index.py          # FastAPI serverless function
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── .vercelignore        # Files to exclude from deployment
```

---

## Troubleshooting

### API returns 500 error
- Check Vercel Function logs in dashboard
- Verify `MONGO_URL` is correct
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`

### Frontend shows blank page
- Check browser console for errors
- Verify the build completed successfully in Vercel logs

### Can't login to admin
- Create the admin account first by registering at `/admin/login`
- Check `JWT_SECRET` is set in environment variables

---

## Support

For questions about the website, contact:
- **Email**: info@aarhiimpactfoundation.org

For technical deployment issues:
- Check Vercel documentation at [vercel.com/docs](https://vercel.com/docs)
