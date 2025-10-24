# Database Monitoring & Security - Goat Notes

This document outlines database monitoring, security hardening, and best practices for the Goat Notes application using Supabase and Prisma.

---

## Table of Contents

1. [Prisma Query Logging](#prisma-query-logging)
2. [Supabase Monitoring Setup](#supabase-monitoring-setup)
3. [Slow Query Alerts](#slow-query-alerts)
4. [Performance Monitoring](#performance-monitoring)
5. [Security Best Practices](#security-best-practices)

---

## Prisma Query Logging

### Current Implementation

Query logging has been enabled in `src/db/prisma.ts` with the following features:

#### 1. Query Performance Monitoring
- **Slow Query Detection**: Queries taking > 1000ms are automatically logged as warnings
- **Development Logging**: All queries are logged in development mode for debugging
- **Production Logging**: Only errors and slow queries are logged in production

#### 2. Error Tracking
- All database errors are logged with full context
- Includes model, operation, duration, and error details
- Helps identify and debug database issues quickly

#### 3. Event Listeners
- `query`: Logs all query events with SQL and parameters (dev only)
- `error`: Logs all database errors
- `warn`: Logs all warnings from Prisma

### Example Log Output

**Development:**
```json
{
  "level": "debug",
  "time": "2025-10-24T10:30:45.123Z",
  "module": "database",
  "model": "Note",
  "operation": "findMany",
  "duration": "45.23ms",
  "msg": "Database query"
}
```

**Slow Query Warning:**
```json
{
  "level": "warn",
  "time": "2025-10-24T10:30:45.123Z",
  "module": "database",
  "model": "Note",
  "operation": "findMany",
  "duration": "1234.56ms",
  "slow": true,
  "msg": "Slow database query detected"
}
```

### Configuration

Logging levels can be adjusted via environment variables:
```bash
# .env or .env.local
LOG_LEVEL=info  # Options: debug, info, warn, error, silent
```

---

## Supabase Monitoring Setup

### 1. Accessing Supabase Dashboard

1. Navigate to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `qvzhldafxxhoyslqwxly`
3. Access monitoring tools from the left sidebar

### 2. Database Reports

**Location:** Dashboard → Database → Reports

#### Available Reports:
- **Slow Queries**: Queries taking longer than configured threshold
- **Most Frequent Queries**: Identify hotspots and optimization opportunities
- **Cache Hit Rate**: Monitor query cache performance
- **Index Usage**: Ensure proper indexes are being used
- **Table Sizes**: Track database growth

#### Recommended Actions:
```sql
-- View slow queries
SELECT * FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Check unused indexes
SELECT *
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexrelname NOT LIKE 'pg_toast%';

-- Monitor table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3. Logging & Realtime

**Location:** Dashboard → Logs

#### Log Types:
- **Postgres Logs**: Database-level logs
- **API Logs**: Supabase API request logs
- **Auth Logs**: Authentication events
- **Realtime Logs**: Websocket connections (if used)

#### Filtering:
```sql
-- Filter by severity
SELECT * FROM postgres_logs
WHERE severity = 'ERROR'
AND timestamp > NOW() - INTERVAL '24 hours';

-- Filter by user/connection
SELECT * FROM postgres_logs
WHERE user_name = 'postgres.qvzhldafxxhoyslqwxly'
ORDER BY timestamp DESC
LIMIT 100;
```

### 4. Performance Monitoring

**Location:** Dashboard → Database → Performance

#### Metrics to Monitor:
- **Active Connections**: Current database connections
- **CPU Usage**: Database server CPU utilization
- **Memory Usage**: RAM consumption
- **Disk I/O**: Read/write operations per second
- **Network I/O**: Bandwidth usage

#### Recommended Thresholds:
- Active Connections: < 80% of max (default: 25)
- CPU Usage: < 70% sustained
- Memory Usage: < 80%
- Disk I/O: Monitor for sudden spikes

---

## Slow Query Alerts

### 1. Supabase Built-in Alerts

**Setup:**
1. Navigate to Dashboard → Database → Reports
2. Enable "Slow Query Alerts"
3. Configure threshold (recommended: 1000ms)
4. Add email notifications

### 2. Application-Level Monitoring

Our Prisma configuration automatically logs slow queries:

```typescript
// src/db/prisma.ts
if (duration > 1000) {
  dbLogger.warn({
    model,
    operation,
    duration: `${duration.toFixed(2)}ms`,
    slow: true,
  }, 'Slow database query detected');
}
```

### 3. Setting Up External Monitoring (Optional)

**Recommended Tools:**
- **Sentry**: Error tracking and performance monitoring
- **Datadog**: Full-stack monitoring
- **New Relic**: APM and database monitoring

**Example Sentry Setup:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],
});
```

---

## Performance Monitoring

### 1. Query Performance Best Practices

#### Use Proper Indexes
```sql
-- Create index on frequently queried fields
CREATE INDEX idx_note_author_created
ON "Note" ("authorId", "createdAt" DESC);

-- Check existing indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public';
```

#### Optimize Queries
```typescript
// ✅ Good: Select only needed fields
const notes = await prisma.note.findMany({
  select: {
    id: true,
    text: true,
    createdAt: true,
  },
  where: { authorId: user.id },
});

// ❌ Bad: Select all fields
const notes = await prisma.note.findMany({
  where: { authorId: user.id },
});
```

#### Use Pagination
```typescript
// ✅ Good: Paginate large datasets
const notes = await prisma.note.findMany({
  where: { authorId: user.id },
  take: 50,
  skip: page * 50,
  orderBy: { createdAt: 'desc' },
});
```

### 2. Connection Pooling

Prisma automatically manages connection pooling, but you can configure it:

```env
# .env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=30"
```

### 3. Monitoring Queries in Development

Enable Prisma query logging in development:
```typescript
// Already configured in src/db/prisma.ts
// All queries are logged with duration and parameters
```

---

## Security Best Practices

### 1. Row-Level Security (RLS)

**Status:** ✅ Policies created (see `supabase-rls-policies.sql`)

**Verify RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('User', 'Note');
-- Both should return rowsecurity = true
```

### 2. Connection Security

#### SSL/TLS Encryption
Supabase enforces SSL for all connections:
```
postgresql://postgres.qvzhldafxxhoyslqwxly:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

#### IP Whitelisting (Optional)
For production, consider IP whitelisting:
1. Dashboard → Settings → Database
2. Add allowed IP ranges
3. Block all other connections

### 3. Monitoring Suspicious Activity

#### Unusual Query Patterns
```sql
-- Monitor for rapid-fire queries (potential attack)
SELECT
  usename,
  COUNT(*) as query_count,
  MAX(query_start) as last_query
FROM pg_stat_activity
WHERE state = 'active'
GROUP BY usename
HAVING COUNT(*) > 100;
```

#### Failed Authentication Attempts
```sql
-- Check auth logs for failed logins
SELECT *
FROM auth.audit_log_entries
WHERE event_type = 'user_signedup'
OR event_type = 'user_login_failed'
ORDER BY created_at DESC
LIMIT 100;
```

### 4. Database Backup & Recovery

**Supabase Automatic Backups:**
- Daily backups (retained for 7 days on free tier)
- Point-in-time recovery available on paid plans

**Manual Backup:**
```bash
# Export database schema
pg_dump -h aws-0-us-west-1.pooler.supabase.com \
        -U postgres.qvzhldafxxhoyslqwxly \
        -d postgres \
        --schema-only \
        > schema-backup.sql

# Export data
pg_dump -h aws-0-us-west-1.pooler.supabase.com \
        -U postgres.qvzhldafxxhoyslqwxly \
        -d postgres \
        --data-only \
        > data-backup.sql
```

---

## Alerting & Incident Response

### 1. Set Up Monitoring Alerts

**Critical Alerts (Immediate Action Required):**
- Database connection failures
- Slow queries > 5 seconds
- Error rate > 1% of requests
- CPU usage > 90%
- Disk usage > 85%

**Warning Alerts (Monitor Closely):**
- Slow queries > 1 second
- Active connections > 80% of max
- CPU usage > 70%
- Memory usage > 75%

### 2. Incident Response Checklist

When an alert fires:

1. **Assess Impact:**
   - Check if users are affected
   - Review error logs
   - Check Supabase dashboard metrics

2. **Identify Root Cause:**
   - Review slow query logs
   - Check recent deployments
   - Verify database migrations

3. **Mitigate:**
   - Roll back problematic changes if needed
   - Scale up database resources (if Supabase paid plan)
   - Implement query caching

4. **Document:**
   - Log incident in `docs/incidents/YYYY-MM-DD-incident.md`
   - Update runbooks
   - Create post-mortem

### 3. Regular Maintenance Tasks

**Daily:**
- [ ] Review error logs
- [ ] Check slow query reports

**Weekly:**
- [ ] Analyze query performance trends
- [ ] Review database growth
- [ ] Check unused indexes

**Monthly:**
- [ ] Optimize slow queries
- [ ] Review and update indexes
- [ ] Test backup restoration
- [ ] Rotate database credentials

**Quarterly:**
- [ ] Full security audit
- [ ] Load testing
- [ ] Review monitoring thresholds
- [ ] Update documentation

---

## Troubleshooting

### Common Issues

#### 1. Connection Pool Exhausted
```
Error: Can't reach database server
```

**Solution:**
```typescript
// Increase connection limit
DATABASE_URL="postgresql://...?connection_limit=20"

// Or close idle connections
await prisma.$disconnect();
```

#### 2. Slow Queries
```
Slow database query detected: 2345.67ms
```

**Solution:**
```sql
-- Add missing index
CREATE INDEX idx_note_lookup
ON "Note" ("authorId", "createdAt" DESC);

-- Or rewrite query
-- Before: findMany() then filter in code
-- After: Use where clause
```

#### 3. High CPU Usage

**Solution:**
- Optimize N+1 queries
- Use `include` instead of multiple queries
- Implement caching (Redis)
- Scale database (Supabase paid plan)

---

## Additional Resources

- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Supabase Monitoring](https://supabase.com/docs/guides/platform/metrics)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Database Security Checklist](https://supabase.com/docs/guides/database/database-security)

---

**Last Updated:** 2025-10-24
**Maintained By:** DevOps Team
