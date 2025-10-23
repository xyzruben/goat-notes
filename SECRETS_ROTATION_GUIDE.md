# 🔑 Secrets Rotation Guide

## IMMEDIATE ACTION REQUIRED

The following secrets were exposed in the `.env` file and must be rotated immediately:

### 1. OpenAI API Key Rotation

**Current Key (COMPROMISED):**
```
OPENAI_API_KEY=sk-proj-[REDACTED]
```
**Note:** The actual key was found in your `.env` file and must be rotated.

**Steps to Rotate:**
1. Go to https://platform.openai.com/api-keys
2. Click "Revoke" on the compromised key
3. Click "Create new secret key"
4. Copy the new key
5. Update `.env.local` (NOT `.env`) with the new key
6. Update Vercel environment variables (if deployed)
7. Verify old key is revoked

### 2. Supabase Database Password Rotation

**Current Connection (COMPROMISED):**
```
DATABASE_URL=postgresql://postgres.qvzhldafxxhoyslqwxly:[REDACTED]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
Password: [REDACTED]
```
**Note:** The actual password was found in your `.env` file and must be rotated.

**Steps to Rotate:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Click "Reset database password"
4. Generate a strong password (use password manager)
5. Update `DATABASE_URL` in `.env.local` with new password
6. Update Vercel environment variables
7. Restart all running instances

### 3. Environment Variable Best Practices

**DO:**
- ✅ Use `.env.local` for local development (automatically gitignored by Next.js)
- ✅ Store production secrets in Vercel Environment Variables
- ✅ Use strong, randomly generated passwords
- ✅ Rotate secrets quarterly

**DON'T:**
- ❌ Commit `.env` files to git
- ❌ Share secrets via Slack/Discord/Email
- ❌ Use weak passwords (band names, dictionary words)
- ❌ Store secrets in screenshots or documentation

### 4. Post-Rotation Checklist

- [ ] Old OpenAI key revoked
- [ ] New OpenAI key stored in `.env.local`
- [ ] Old database password rotated
- [ ] New database password stored in `.env.local`
- [ ] `.env` file deleted (use `.env.local` instead)
- [ ] Vercel environment variables updated
- [ ] Application tested with new credentials
- [ ] Team notified of rotation

### 5. Future Secret Management

Consider using a secrets management service:
- **Vercel**: Built-in environment variables (recommended for this project)
- **Doppler**: Secret management platform
- **AWS Secrets Manager**: For AWS deployments
- **1Password**: For team secret sharing

---

**Action Required:** Complete these steps within 24 hours to minimize security risk.
