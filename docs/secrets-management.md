# Secrets Management & Rotation - Goat Notes

This document outlines procedures for managing and rotating secrets, API keys, and sensitive credentials in the Goat Notes application.

---

## Table of Contents

1. [Overview](#overview)
2. [Current Secrets Inventory](#current-secrets-inventory)
3. [Secret Rotation Procedures](#secret-rotation-procedures)
4. [Environment Variable Setup](#environment-variable-setup)
5. [Security Tools](#security-tools)
6. [Incident Response](#incident-response)

---

## Overview

### Security Principles

1. **Never commit secrets to git**
2. **Rotate secrets regularly** (monthly at minimum)
3. **Use different secrets for each environment**
4. **Limit secret access** (principle of least privilege)
5. **Audit secret usage** (track who accessed what and when)

### Secret Classification

| Level | Examples | Rotation Frequency | Access Control |
|-------|----------|-------------------|----------------|
| **CRITICAL** | Database passwords, service role keys | Monthly | Ops team only |
| **HIGH** | API keys (OpenAI, Stripe), Auth secrets | Quarterly | Dev + Ops |
| **MEDIUM** | Public anon keys, client IDs | Annually | All developers |

---

## Current Secrets Inventory

### Production Secrets

#### 1. Database (Supabase)
- **Secret:** `DATABASE_URL`
- **Format:** `postgresql://postgres.<project-id>:<password>@<host>:<port>/postgres`
- **Access Level:** CRITICAL
- **Stored In:**
  - Local: `.env.local` (git ignored)
  - Production: Vercel Environment Variables
- **Rotation:** Monthly

#### 2. Supabase Auth
- **Secret:** `NEXT_PUBLIC_SUPABASE_URL`
- **Access Level:** MEDIUM (public, read-only)
- **Stored In:** `.env` and Vercel
- **Rotation:** Only if compromised

- **Secret:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Access Level:** MEDIUM (public, protected by RLS)
- **Stored In:** `.env` and Vercel
- **Rotation:** Quarterly

- **Secret:** `SUPABASE_SERVICE_ROLE_KEY` (if used)
- **Access Level:** CRITICAL
- **Stored In:** Vercel only (never in `.env`)
- **Rotation:** Monthly

#### 3. OpenAI
- **Secret:** `OPENAI_API_KEY`
- **Format:** `sk-proj-...`
- **Access Level:** HIGH
- **Stored In:**
  - Local: `.env.local`
  - Production: Vercel Environment Variables
- **Rotation:** Quarterly

#### 4. Upstash Redis (Rate Limiting)
- **Secret:** `UPSTASH_REDIS_REST_URL`
- **Access Level:** MEDIUM
- **Stored In:** `.env.local` and Vercel
- **Rotation:** Only if compromised

- **Secret:** `UPSTASH_REDIS_REST_TOKEN`
- **Access Level:** HIGH
- **Stored In:** `.env.local` and Vercel
- **Rotation:** Quarterly

#### 5. Application Secrets
- **Secret:** `NEXT_PUBLIC_BASE_URL`
- **Access Level:** LOW (public)
- **Stored In:** `.env` and Vercel
- **Rotation:** Never (configuration, not a secret)

---

## Secret Rotation Procedures

### 1. Rotating OpenAI API Key

**Frequency:** Quarterly (or immediately if compromised)

**Steps:**

1. **Generate new API key:**
   ```bash
   # Visit: https://platform.openai.com/api-keys
   # Click "Create new secret key"
   # Name it: "goat-notes-production-2025-Q1"
   # Copy the key immediately (only shown once)
   ```

2. **Update local environment:**
   ```bash
   # Update .env.local
   OPENAI_API_KEY=sk-proj-NEW_KEY_HERE
   ```

3. **Test locally:**
   ```bash
   pnpm run dev
   # Test AI functionality in the app
   ```

4. **Update Vercel:**
   ```bash
   # Option A: Via Vercel Dashboard
   # 1. Go to project settings
   # 2. Environment Variables
   # 3. Edit OPENAI_API_KEY
   # 4. Update for Production, Preview, Development

   # Option B: Via Vercel CLI
   vercel env add OPENAI_API_KEY production
   # Paste the new key when prompted
   ```

5. **Redeploy application:**
   ```bash
   vercel --prod
   # Or trigger deployment via git push
   ```

6. **Verify in production:**
   ```bash
   # Test AI features in production
   # Check logs for any errors
   ```

7. **Revoke old key:**
   ```bash
   # Visit: https://platform.openai.com/api-keys
   # Find the old key
   # Click "Revoke"
   # Confirm revocation
   ```

8. **Document rotation:**
   ```bash
   # Add entry to docs/rotations.log
   echo "$(date): Rotated OPENAI_API_KEY - Old key revoked" >> docs/rotations.log
   ```

### 2. Rotating Supabase Database Password

**Frequency:** Monthly (or immediately if compromised)

**Steps:**

1. **Generate new password:**
   ```bash
   # Visit: https://supabase.com/dashboard/project/<project-id>/settings/database
   # Click "Reset database password"
   # Choose "Generate a password" or enter a strong custom one
   # Copy the new password
   ```

2. **Update connection string locally:**
   ```bash
   # Update .env.local
   DATABASE_URL="postgresql://postgres.qvzhldafxxhoyslqwxly:NEW_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
   ```

3. **Test database connection:**
   ```bash
   pnpm dlx prisma db pull
   # Should succeed without errors
   ```

4. **Update Vercel:**
   ```bash
   vercel env add DATABASE_URL production
   # Paste the new connection string
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

6. **Verify:**
   ```bash
   # Check application logs
   # Test CRUD operations in production
   ```

7. **Document:**
   ```bash
   echo "$(date): Rotated DATABASE_URL password" >> docs/rotations.log
   ```

**IMPORTANT:** Database password rotation is immediate - old password is revoked instantly.

### 3. Rotating Supabase Anon Key

**Frequency:** Quarterly (or if compromised)

**Steps:**

1. **Generate new anon key:**
   ```bash
   # Visit: https://supabase.com/dashboard/project/<project-id>/settings/api
   # Project API keys section
   # Click "Reset" next to anon/public key
   # Copy new key
   ```

2. **Update everywhere:**
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...NEW_KEY

   # Vercel
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   ```

3. **Redeploy all environments:**
   ```bash
   vercel --prod
   # Also update preview/development if needed
   ```

4. **Verify RLS policies:**
   ```sql
   -- Ensure RLS is still active after key rotation
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```

### 4. Rotating Upstash Redis Credentials

**Frequency:** Quarterly

**Steps:**

1. **Create new database** (recommended over password rotation):
   ```bash
   # Visit: https://console.upstash.com/
   # Create new Redis database
   # Name it: goat-notes-rate-limit-v2
   # Copy REST URL and TOKEN
   ```

2. **Update configuration:**
   ```bash
   # .env.local
   UPSTASH_REDIS_REST_URL=https://new-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=new_token_here
   ```

3. **Test rate limiting:**
   ```bash
   pnpm run dev
   # Make multiple API requests to test rate limiting
   ```

4. **Deploy:**
   ```bash
   vercel env add UPSTASH_REDIS_REST_URL production
   vercel env add UPSTASH_REDIS_REST_TOKEN production
   vercel --prod
   ```

5. **Monitor for 24 hours** before deleting old database

6. **Delete old database:**
   ```bash
   # Upstash Console → Select old database → Delete
   ```

---

## Environment Variable Setup

### Local Development

**File:** `.env.local` (git ignored)

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Setup:**
```bash
cp .env.example .env.local
# Edit .env.local with real values
```

### Vercel Production

**Setup via Dashboard:**
1. Go to `https://vercel.com/<team>/goat-notes/settings/environment-variables`
2. Add each variable:
   - Select environments: Production, Preview, Development
   - Sensitive variables: Check "Sensitive" to hide values
3. Click "Save"

**Setup via CLI:**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Add variables
vercel env add DATABASE_URL production
vercel env add OPENAI_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add NEXT_PUBLIC_BASE_URL production

# Verify
vercel env ls
```

### Environment Variable Security

**Best Practices:**
1. ✅ Use `NEXT_PUBLIC_` prefix only for client-safe values
2. ✅ Mark sensitive variables as "Sensitive" in Vercel
3. ✅ Use different values for each environment
4. ✅ Never log sensitive variables
5. ✅ Regularly audit who has access

**Anti-Patterns:**
1. ❌ Committing `.env` files to git
2. ❌ Sharing secrets via Slack/email
3. ❌ Using same secrets across environments
4. ❌ Hardcoding secrets in code
5. ❌ Storing secrets in screenshots/documentation

---

## Security Tools

### 1. Pre-commit Hook

**Purpose:** Prevent accidental `.env` commits

**Setup:** (Automated via husky)
```bash
# .husky/pre-commit
#!/bin/sh

# Check for .env files in staging
if git diff --cached --name-only | grep -E "^\.env(\.|$)"; then
  echo "❌ ERROR: Attempting to commit .env file!"
  echo "   Files detected:"
  git diff --cached --name-only | grep -E "^\.env(\.|$)"
  echo ""
  echo "   To fix: git reset HEAD .env"
  exit 1
fi

# Check for potential secrets in staged files
if git diff --cached | grep -E "(api[_-]?key|password|secret|token|credential)" -i; then
  echo "⚠️  WARNING: Potential secret detected in commit"
  echo "   Please review before committing"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "✅ Pre-commit checks passed"
```

### 2. TruffleHog

**Purpose:** Scan for secrets in git history

**Installation:**
```bash
pnpm add -D @trufflesecurity/trufflehog
```

**Usage:**
```bash
# Scan entire repository
pnpm dlx trufflehog filesystem . --json --fail

# Scan specific commit
pnpm dlx trufflehog git file://. --since-commit HEAD~1

# Scan with exclusions
pnpm dlx trufflehog filesystem . \
  --exclude-paths=.trufflehog-exclude.txt \
  --json
```

**Configuration:** `.trufflehog-exclude.txt`
```
# Exclude patterns
node_modules/
.next/
*.md
*.test.ts
package-lock.json
pnpm-lock.yaml
```

**CI Integration:** (already added to `.github/workflows/ci.yml`)
```yaml
- name: Scan for secrets
  run: |
    pnpm dlx @trufflesecurity/trufflehog filesystem . \
      --exclude-paths=.trufflehog-exclude.txt \
      --fail \
      --json
```

### 3. Git-secrets (Alternative)

**Installation:**
```bash
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux
```

**Setup:**
```bash
# Initialize
git secrets --install

# Add patterns
git secrets --add 'sk-proj-[A-Za-z0-9]{48}'  # OpenAI keys
git secrets --add 'postgres://[^@]+:[^@]+@'    # Database URLs
git secrets --add --allowed 'example.com'      # Whitelist
```

---

## Incident Response

### If a Secret is Compromised

**Immediate Actions (within 1 hour):**

1. **Revoke the compromised secret**
   - OpenAI: Revoke key at https://platform.openai.com/api-keys
   - Supabase: Reset password immediately
   - Upstash: Delete Redis database

2. **Rotate to new secret**
   - Follow rotation procedures above
   - Deploy immediately

3. **Assess impact**
   - Check usage logs for unauthorized access
   - Review Stripe/OpenAI billing for unexpected charges
   - Check Supabase logs for suspicious queries

4. **Notify stakeholders**
   - Inform team via secure channel
   - Document incident in `docs/incidents/`

**Follow-up Actions (within 24 hours):**

5. **Root cause analysis**
   - How was the secret compromised?
   - Was it committed to git?
   - Was it logged somewhere?
   - Was it shared insecurely?

6. **Implement preventions**
   - Add pre-commit hooks
   - Enable secret scanning
   - Update documentation
   - Train team

7. **Post-mortem**
   - Document lessons learned
   - Update incident response procedures
   - Share with team

### Incident Template

```markdown
# Security Incident: [SECRET_NAME] Compromise

**Date:** YYYY-MM-DD
**Severity:** CRITICAL/HIGH/MEDIUM
**Secret:** [Name of compromised secret]

## Timeline
- HH:MM: Compromise discovered
- HH:MM: Secret revoked
- HH:MM: New secret deployed
- HH:MM: Incident resolved

## Impact
- [Describe what was affected]
- [Estimated cost/damage]

## Root Cause
[How did this happen?]

## Resolution
[What was done to fix it?]

## Prevention
[What will prevent this in the future?]

## Action Items
- [ ] Update documentation
- [ ] Implement new controls
- [ ] Train team
```

---

## Regular Maintenance

### Weekly
- [ ] Review access logs for anomalies
- [ ] Check for any new secrets in code

### Monthly
- [ ] Rotate CRITICAL secrets
- [ ] Review secret access permissions
- [ ] Update rotation logs

### Quarterly
- [ ] Rotate HIGH secrets
- [ ] Full security audit
- [ ] Review and update procedures
- [ ] Test incident response

### Annually
- [ ] Rotate all secrets
- [ ] Review secret classification
- [ ] Update documentation
- [ ] Security training for team

---

## Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App: Config](https://12factor.net/config)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [TruffleHog Documentation](https://github.com/trufflesecurity/trufflehog)

---

**Last Updated:** 2025-10-24
**Next Review:** 2025-11-24
