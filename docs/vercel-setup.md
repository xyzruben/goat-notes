# Vercel Deployment Setup - Goat Notes

This document provides complete instructions for deploying Goat Notes to Vercel with proper security configuration.

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Environment Variables](#environment-variables)
3. [Deployment Configuration](#deployment-configuration)
4. [Security Headers](#security-headers)
5. [Monitoring & Logs](#monitoring--logs)

---

## Initial Setup

### 1. Install Vercel CLI

```bash
pnpm add -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
# From project root
vercel link

# Select or create a new project
# Choose your team/account
# Confirm project settings
```

---

## Environment Variables

### Required Variables

| Variable | Type | Description | Where to Get |
|----------|------|-------------|--------------|
| `DATABASE_URL` | Secret | PostgreSQL connection string | Supabase Dashboard → Settings → Database |
| `OPENAI_API_KEY` | Secret | OpenAI API key | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_BASE_URL` | Public | Production URL | `https://goat-notes.vercel.app` |

### Optional Variables (for Rate Limiting)

| Variable | Type | Description |
|----------|------|-------------|
| `UPSTASH_REDIS_REST_URL` | Secret | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Secret | Upstash Redis token |
| `LOG_LEVEL` | Config | Logging level (default: info) |

### Adding Variables via Dashboard

1. Go to `https://vercel.com/<team>/goat-notes/settings/environment-variables`

2. For each variable:
   - **Key**: Enter variable name
   - **Value**: Enter the value
   - **Environments**: Select Production, Preview, and Development
   - **Sensitive**: Check this for secrets (DATABASE_URL, OPENAI_API_KEY, etc.)

3. Click "Save"

### Adding Variables via CLI

```bash
# Add production variable
vercel env add DATABASE_URL production
# Paste the value when prompted

# Add for all environments
vercel env add NEXT_PUBLIC_BASE_URL
# Select: Production, Preview, Development

# Pull variables to local .env
vercel env pull .env.local
```

### Environment Variable Template

Create a `.env.example` file for documentation:

```bash
# Database
DATABASE_URL="postgresql://postgres.<project-id>:<password>@<host>:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# Upstash Redis (Optional)
UPSTASH_REDIS_REST_URL="https://...-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."

# Application
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"

# Logging (Optional)
LOG_LEVEL="info"
```

---

## Deployment Configuration

### vercel.json

The `vercel.json` file configures deployment behavior:

```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Deployment Process

#### Automatic Deployment (Recommended)

1. **Push to main branch:**
   ```bash
   git push origin main
   ```

2. **Vercel automatically:**
   - Detects the push
   - Runs build
   - Deploys to production
   - Provides deployment URL

#### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Deploy with specific environment
vercel --env CUSTOM_VAR=value --prod
```

### Deployment Environments

| Environment | Trigger | URL Pattern | Use Case |
|-------------|---------|-------------|----------|
| **Production** | Push to `main` | `goat-notes.vercel.app` | Live site |
| **Preview** | Pull request | `goat-notes-<pr>.vercel.app` | PR reviews |
| **Development** | Branch push | `goat-notes-<branch>.vercel.app` | Testing |

---

## Security Headers

### Headers Configuration

Security headers are configured in both `next.config.ts` and `vercel.json`:

#### Additional Security Headers (next.config.ts)

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.openai.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};
```

### Verifying Security Headers

```bash
# Check headers in production
curl -I https://goat-notes.vercel.app

# Or use online tool
# https://securityheaders.com/
```

Expected headers:
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Content-Security-Policy: ...`
- ✅ `Strict-Transport-Security: max-age=63072000`

---

## Monitoring & Logs

### 1. Deployment Logs

**Via Dashboard:**
1. Go to `https://vercel.com/<team>/goat-notes/deployments`
2. Click on a deployment
3. View build logs, runtime logs, and errors

**Via CLI:**
```bash
# View recent deployments
vercel ls

# View logs for specific deployment
vercel logs <deployment-url>

# Follow logs in real-time
vercel logs --follow
```

### 2. Runtime Logs

**Accessing Logs:**
1. Dashboard → Deployments → Select deployment → Runtime Logs
2. Filter by severity: All, Errors, Warnings
3. Search by keyword or timestamp

**Log Levels:**
- **Info**: General application logs
- **Warn**: Warnings (slow queries, rate limits)
- **Error**: Errors and exceptions

### 3. Analytics

**Setup Vercel Analytics:**
1. Dashboard → Analytics → Enable
2. Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Metrics Tracked:**
- Page views
- Unique visitors
- Web Vitals (LCP, FID, CLS)
- API response times

### 4. Performance Monitoring

**Key Metrics:**
- **Build Time**: Should be < 3 minutes
- **Cold Start**: < 1 second
- **API Response Time**: < 500ms (p95)
- **Page Load Time**: < 2 seconds

**Monitoring Tools:**
- Vercel Analytics (built-in)
- Sentry (errors & performance)
- LogRocket (session replay)
- Datadog (full-stack monitoring)

---

## Troubleshooting

### Build Failures

**Common Issues:**

1. **Missing environment variables:**
   ```
   Error: DATABASE_URL is not defined
   ```
   **Fix:** Add missing variables in Vercel dashboard

2. **TypeScript errors:**
   ```
   Error: Type 'string | undefined' is not assignable to type 'string'
   ```
   **Fix:** Run `pnpm run type-check` locally and fix errors

3. **Prisma generation fails:**
   ```
   Error: Prisma schema not found
   ```
   **Fix:** Ensure `prisma.schema` field is correct in package.json

### Runtime Errors

1. **Database connection fails:**
   ```
   Error: Can't reach database server
   ```
   **Fix:**
   - Verify DATABASE_URL is correct
   - Check Supabase is accessible
   - Verify SSL settings

2. **OpenAI API errors:**
   ```
   Error: Incorrect API key provided
   ```
   **Fix:**
   - Rotate OPENAI_API_KEY
   - Redeploy application

3. **Rate limiting not working:**
   ```
   Warning: Rate limiting unavailable
   ```
   **Fix:**
   - Add UPSTASH_REDIS_REST_URL and TOKEN
   - Falls back to in-memory (works but not ideal)

### Rollback Procedure

If deployment causes issues:

```bash
# Via Dashboard
1. Deployments → Select previous working deployment
2. Click "Promote to Production"

# Via CLI
vercel rollback <deployment-url> --prod
```

---

## Best Practices

### Security

1. ✅ Always use HTTPS (Vercel provides free SSL)
2. ✅ Enable Vercel Authentication for sensitive previews
3. ✅ Use different API keys for production/preview/development
4. ✅ Enable IP whitelisting if possible
5. ✅ Regularly rotate secrets

### Performance

1. ✅ Enable Edge Functions for global performance
2. ✅ Use `next/image` for optimized images
3. ✅ Implement caching strategies
4. ✅ Monitor Core Web Vitals
5. ✅ Use Vercel's Analytics to identify bottlenecks

### Deployment

1. ✅ Test in preview before promoting to production
2. ✅ Use pull requests for code review
3. ✅ Run tests in CI before merging
4. ✅ Monitor deployments for errors
5. ✅ Have rollback plan ready

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull .env.local

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Get deployment URL
vercel --prod --yes | grep "https://"

# Rollback
vercel rollback <deployment-url> --prod
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)

---

**Last Updated:** 2025-10-24
**Next Review:** When deploying major changes
