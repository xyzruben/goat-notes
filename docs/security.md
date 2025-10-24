# Security Documentation - Goat Notes

## Overview

This document outlines the security measures implemented in the Goat Notes application, including Row-Level Security (RLS) policies, authorization checks, and security best practices.

## Table of Contents

1. [Row-Level Security (RLS)](#row-level-security-rls)
2. [Application-Level Authorization](#application-level-authorization)
3. [API Security](#api-security)
4. [Authentication Flow](#authentication-flow)
5. [Security Testing](#security-testing)

---

## Row-Level Security (RLS)

### What is RLS?

Row-Level Security (RLS) is a Supabase/PostgreSQL feature that provides database-level security by restricting which rows users can access based on policies. This serves as a critical defense-in-depth layer alongside application-level authorization.

### Why RLS is Critical

1. **Defense in Depth**: Even if application-level auth is bypassed, RLS prevents unauthorized data access
2. **Direct Database Access Protection**: Prevents abuse of Supabase anon key for direct database queries
3. **Multi-Tenant Isolation**: Ensures users can only access their own data at the database layer
4. **Compliance**: Helps meet security compliance requirements for data isolation

### Implementation

RLS has been enabled on all tables with the following policies:

#### User Table Policies

| Policy Name | Operation | Rule |
|------------|-----------|------|
| `Users can read own record` | SELECT | `auth.uid() = id` |
| `Users can update own record` | UPDATE | `auth.uid() = id` |

**Note**: User creation (INSERT) is handled by the application using the service role, not by individual users.

#### Note Table Policies

| Policy Name | Operation | Rule |
|------------|-----------|------|
| `Users can read own notes` | SELECT | `auth.uid() = authorId` |
| `Users can insert own notes` | INSERT | `auth.uid() = authorId` |
| `Users can update own notes` | UPDATE | `auth.uid() = authorId` |
| `Users can delete own notes` | DELETE | `auth.uid() = authorId` |

### Applying RLS Policies

To apply these policies to your Supabase database:

1. Navigate to your Supabase project dashboard
2. Open the SQL Editor
3. Run the SQL script located at: `/supabase-rls-policies.sql`
4. Verify policies are active:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('User', 'Note');
```

Expected result: `rowsecurity` should be `true` for both tables.

### Testing RLS Policies

To test that RLS is working correctly:

```sql
-- Test as authenticated user (will only see their own notes)
SELECT * FROM "Note";

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename IN ('User', 'Note');
```

---

## Application-Level Authorization

### Server Actions Security

All server actions in `src/actions/notes.ts` implement proper authorization:

#### 1. Authentication Check

Every action starts with:
```typescript
const user = await getUser();
if (!user) throw new Error("You must be logged in...");
```

#### 2. Ownership Validation

All Prisma queries include `authorId` filtering:

```typescript
// CREATE - Uses authenticated user's ID
await prisma.note.create({
    data: {
        authorId: user.id,  // ✅ Enforces ownership
        text: ""
    }
})

// UPDATE - Checks ownership in WHERE clause
await prisma.note.update({
    where: {
        id: noteId,
        authorId: user.id  // ✅ Prevents unauthorized updates
    },
    data: { text }
})

// DELETE - Checks ownership in WHERE clause
await prisma.note.delete({
    where: {
        id: noteId,
        authorId: user.id  // ✅ Prevents unauthorized deletions
    }
})

// READ - Filters by authorId
await prisma.note.findMany({
    where: {
        authorId: user.id  // ✅ Only returns user's notes
    }
})
```

### API Routes Security

All API routes in `src/app/api/` implement authentication:

#### src/app/api/create-new-note/route.ts:5-13
```typescript
export async function POST() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const {id} = await prisma.note.create({
        data: { authorId: user.id, text: "" }
    })

    return NextResponse.json({ noteId: id });
}
```

#### src/app/api/fetch-newest-note/route.ts:5-14
```typescript
export async function GET() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const newestNoteId = await prisma.note.findFirst({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ newestNoteId: newestNoteId?.id });
}
```

---

## API Security

### Rate Limiting

Rate limiting will be implemented using Upstash Redis to prevent:
- API abuse
- Brute force attacks
- Cost explosion from OpenAI API calls
- Denial of Service (DoS) attacks

See `src/lib/ratelimit.ts` for implementation details.

### CORS Policy

CORS validation will be added to all API routes to ensure only authorized origins can make requests.

### Input Validation

Input validation will be implemented to:
- Limit note text length (max 50,000 characters)
- Sanitize user input before storage
- Prevent XSS attacks via stored data

---

## Authentication Flow

### Supabase SSR Authentication

The application uses Supabase Server-Side Rendering (SSR) authentication:

1. **Cookie-Based Sessions**: HTTP-only cookies managed by `@supabase/ssr`
2. **Server-Side Token Validation**: `getUser()` validates sessions server-side
3. **Protected Routes**: Middleware enforces authentication on protected routes

### Session Management

Location: `src/auth/server.ts:4-28`

```typescript
export const getUser = async () => {
    const supabase = (await createClient()).supabase;
    const userObject = await supabase.auth.getUser();

    if (userObject.error) {
        return null;
    }

    return userObject.data.user;
}
```

### Middleware Protection

Location: `src/middleware.ts:49-58`

The middleware:
- Redirects unauthenticated users from protected routes to `/login`
- Redirects authenticated users away from `/login` and `/signup` pages
- Validates sessions on every request

---

## Security Testing

### Unit Tests

Authorization tests are located in `src/actions/__tests__/notes.test.ts`:

```typescript
describe("updateNoteAction", () => {
    it("should update an existing note with authorId check", async () => {
        await updateNoteAction("note-id-123", "Updated text");
        expect(prisma.note.update).toHaveBeenCalledWith({
            where: { id: "note-id-123", authorId: mockUser.id },
            data: { text: "Updated text" },
        });
    });

    it("should return an error if user is not logged in", async () => {
        (getUser as jest.Mock).mockResolvedValue(null);
        const result = await updateNoteAction("note-id-123", "Updated text");
        expect(result.errorMessage).toBe("You must be logged in to update a note.");
    });
});
```

### Running Security Tests

```bash
# Run all tests
pnpm test

# Run specific security tests
pnpm test src/actions/__tests__/notes.test.ts
```

### Manual Security Testing

Test RLS policies manually:

1. **Test unauthorized access**:
   - Log in as User A
   - Try to access User B's note by ID
   - Should fail at both application and database level

2. **Test direct database access**:
   - Use Supabase anon key to query database directly
   - Should only return authenticated user's data

3. **Test API endpoints**:
   - Call API routes without authentication
   - Should return 401 Unauthorized

---

## Security Checklist

### Implemented ✅

- [x] Row-Level Security enabled on all tables
- [x] RLS policies created for SELECT, INSERT, UPDATE, DELETE
- [x] Application-level authorization in all server actions
- [x] API routes require authentication
- [x] Ownership validation in all Prisma queries
- [x] Unit tests for authorization checks
- [x] Cookie-based session management with HTTP-only cookies
- [x] CSRF protection via Next.js Server Actions
- [x] TypeScript strict mode for type safety
- [x] Prisma ORM prevents SQL injection

### Pending 🚧

- [ ] Rate limiting on API endpoints
- [ ] CORS policy implementation
- [ ] Input validation and sanitization
- [ ] Prompt injection protection for AI features
- [ ] Security headers in next.config.ts
- [ ] Dependency vulnerability scanning in CI/CD
- [ ] Penetration testing

---

## Incident Response

### Suspected Security Breach

If you suspect a security breach:

1. **Immediate Actions**:
   - Rotate all API keys (OpenAI, Supabase)
   - Revoke all user sessions: `DELETE FROM auth.sessions;` in Supabase SQL Editor
   - Review Supabase logs for suspicious activity

2. **Investigation**:
   - Check application logs for unusual patterns
   - Review recent database queries in Supabase Dashboard
   - Verify RLS policies are active

3. **Notification**:
   - Notify affected users if PII was compromised
   - Document the incident in `docs/incidents/`

### Regular Security Maintenance

- **Weekly**: Review Dependabot PRs
- **Monthly**: Rotate API keys
- **Quarterly**: Run penetration tests
- **Annually**: Full security audit

---

## Additional Resources

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Prisma Security Best Practices](https://www.prisma.io/docs/concepts/components/prisma-client/security)

---

## Contact

For security concerns or to report vulnerabilities, contact: security@yourdomain.com

**Last Updated**: 2025-10-24
