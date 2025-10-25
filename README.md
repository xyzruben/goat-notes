# 🐐 GOAT Notes

A production-ready, AI-powered note-taking application built with Next.js 15, TypeScript, and Supabase. Features real-time AI assistance, comprehensive security measures, and enterprise-grade architecture.

## ✨ Features

- **🤖 AI-Powered Notes**: Ask AI questions about your notes with multi-turn conversation support
- **📝 Real-time Editing**: Debounced auto-save functionality (1-second delay) with instant updates
- **🔍 Smart Search**: Fuzzy search in sidebar using Fuse.js for intelligent note discovery
- **🌙 Dark/Light Mode**: Seamless theme switching with system preference detection
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔐 Secure Authentication**: Supabase-powered user authentication with session management
- **⚡ Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS 4
- **🛡️ Production-Grade Security**: Multi-layered input sanitization, rate limiting, and comprehensive logging

## 🔒 Security Features

### Input Validation & Sanitization
- **Multi-layered XSS protection** with server-side and client-side sanitization
- **Prompt injection prevention** for AI queries with delimiter-based protection
- **HTML sanitization** using DOMPurify with allowlist-based safe tags
- **Character limits** (50,000 characters per note) and input validation
- **Sensitive data redaction** in logs (passwords, tokens, cookies)

### Rate Limiting
- **AI endpoint**: 5 requests per 30 seconds per user (prevents API cost explosion)
- **General API**: 10 requests per 10 seconds per IP
- **Auth endpoint**: 5 attempts per 15 minutes per IP (brute force protection)
- **Distributed rate limiting** with Upstash Redis and automatic fallback to in-memory

### Logging & Monitoring
- **Structured logging** with Pino for JSON-formatted logs
- **Request ID tracking** for distributed tracing across requests
- **Slow query detection** (alerts for queries >1000ms)
- **Module-specific loggers** (auth, database, API, AI, security)
- **Query performance monitoring** with enhanced Prisma client

### Other Security Measures
- **CORS validation** with strict origin checking
- **Security headers** configured at Vercel level
- **Server-side session management** with middleware
- **Authentication middleware** for protected routes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management system
- **Sonner** - Toast notification system
- **DOMPurify** - HTML sanitization

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Prisma** - Type-safe database client with enhanced query monitoring
- **OpenAI API** - GPT-4 Mini for AI-powered note analysis
- **Upstash Redis** - Distributed rate limiting

### Logging & Monitoring
- **Pino** - High-performance structured logging
- **Request ID tracking** - Distributed tracing support
- **Performance monitoring** - Slow query detection and alerts

### Search & UI
- **Fuse.js** - Fuzzy search for sidebar note filtering
- **React Hook Form** - Form validation and handling
- **Vaul** - Drawer component for mobile

### Testing & Quality
- **Jest** - Testing framework with 40+ comprehensive tests
- **React Testing Library** - Component testing
- **Testing Library Jest DOM** - DOM matchers
- **ESLint** - Code linting
- **Prettier** - Code formatting

### DevOps
- **GitHub Actions** - CI/CD pipeline with automated testing
- **Vercel** - Deployment platform (SFO1 region)
- **Codecov** - Test coverage tracking
- **pnpm** - Fast, strict package manager

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20.x recommended)
- pnpm
- Supabase account
- OpenAI API key
- Upstash Redis account (optional for development, required for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/goat-notes.git
   cd goat-notes
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Database (Prisma)
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_database_url  # For migrations

   # Upstash Redis (optional for dev, required for production)
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Set up the database**
   ```bash
   pnpm run migrate
   ```

5. **Run the development server**
   ```bash
   pnpm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run all tests
```bash
pnpm run test
```

### Run tests with coverage
```bash
pnpm run test:coverage
```

### Run tests in watch mode
```bash
pnpm run test:watch
```

### Current Test Coverage
- **40+ comprehensive test cases** covering all major components
- **7+ test suites** including components, actions, and hooks
- **40%+ coverage** across statements, branches, functions, and lines
- **API mocking** with Supabase and OpenAI mocks for isolated testing
- **Component testing** with React Testing Library
- **Snapshot testing** for UI consistency

## 🏗️ Production Build

### Build the application
```bash
pnpm run build
```

### Start production server
```bash
pnpm start
```

### Lint and format
```bash
pnpm run lint
pnpm run format
```

## 🔧 Development

### Code Quality
- **TypeScript strict mode** enabled with 100% type coverage
- **ESLint** for code linting
- **Prettier** for code formatting
- **Pre-commit hooks** with Husky for quality assurance
- **Path aliases** for clean imports (@/components, @/lib, etc.)

### Project Structure
```
src/
├── actions/          # Server actions (users, notes)
├── app/             # Next.js app router pages
│   ├── api/        # API routes
│   └── styles/     # Global styles
├── auth/            # Authentication utilities
├── components/      # React components
│   └── ui/         # Reusable UI components (Radix primitives)
├── db/             # Database configuration and Prisma schema
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
│   ├── logger.ts   # Pino logging setup
│   ├── ratelimit.ts # Rate limiting configuration
│   ├── sanitize.ts  # Input sanitization
│   └── openai.ts   # OpenAI client
├── openai/         # OpenAI client instance
├── providers/      # React context providers
└── __tests__/      # Test files (mirrors src structure)
```

### Implementation Highlights

#### Smart Middleware
- **Auto-navigation**: Redirects logged-in users to their latest note
- **Auto-creation**: Creates a new note if user has none
- **Session management**: Updates Supabase session on every request
- **Request ID injection**: Adds unique ID to every request for tracing

#### Debounced Auto-save
- **1-second delay** after typing stops before saving
- **Reduces database writes** while maintaining seamless UX
- **Optimistic updates** with React Context for instant feedback

#### Enhanced Prisma Client
- **Query performance monitoring** with timing logs
- **Slow query alerts** for queries exceeding 1000ms
- **Error tracking** with detailed context
- **Development query logging** for debugging

#### AI Safety Guardrails
- **Prompt injection prevention** with delimiter protection
- **Response sanitization** before displaying to users
- **Rate limiting** to prevent API cost explosion
- **Multi-turn conversation** support with history management

#### Fuzzy Search
- **Fuse.js integration** for intelligent note discovery
- **Client-side search** for instant results
- **Searches note titles and content** with relevance scoring

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure security headers in `vercel.json`
4. Deploy automatically on every push to main branch

**Vercel Configuration:**
```json
{
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
        }
      ]
    }
  ]
}
```

### Manual Deployment
```bash
pnpm run build
# Deploy the .next folder to your hosting provider
```

### Environment Setup Checklist
- [ ] Supabase project created with authentication enabled
- [ ] Prisma migrations applied to database
- [ ] OpenAI API key with sufficient credits
- [ ] Upstash Redis instance configured (production)
- [ ] Environment variables set in deployment platform
- [ ] Security headers configured
- [ ] CORS origins validated

## 🏛️ Architectural Decisions

### Why Next.js Server Actions?
- Simplified data mutations without separate API routes
- Automatic request deduplication
- Progressive enhancement support
- Type-safe end-to-end with TypeScript

### Why Supabase for Auth?
- Built-in authentication with email confirmation
- Row-level security for database access
- Real-time subscriptions ready for future features
- Serverless architecture aligns with Vercel

### Why React Context over Zustand/Redux?
- Lightweight state requirements (only note text state)
- No need for middleware or dev tools
- Simpler mental model for note editing flow
- Avoids unnecessary bundle size increase

### Why Upstash Redis?
- Serverless Redis with edge support
- Pay-per-request pricing model
- Global distribution for low latency
- Perfect for rate limiting in serverless environments

### Why GPT-4 Mini?
- Cost-effective for note analysis use case
- Faster response times than GPT-4
- Sufficient capabilities for Q&A about notes
- Better rate limit allowances

### Why Prisma over Supabase Client?
- Type-safe database queries with codegen
- Better TypeScript integration
- Migration management built-in
- Query performance monitoring capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript strict mode conventions
- Write tests for new features (maintain 40%+ coverage)
- Run `pnpm run lint` and `pnpm run format` before committing
- Update documentation for user-facing changes
- Ensure all tests pass (`pnpm run test`)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Key Technical Achievements

### ✅ Production-Ready Features
- **Comprehensive Security**: Multi-layered sanitization, rate limiting, logging
- **Distributed Systems**: Request ID tracking, slow query detection
- **Testing Infrastructure**: 40+ tests with API mocking and component testing
- **Type Safety**: 100% TypeScript strict mode compliance
- **CI/CD Pipeline**: GitHub Actions with automated testing and deployment
- **Performance Optimized**: Next.js 15 with Turbopack and App Router
- **Accessibility**: ARIA-compliant components with Radix UI

### ✅ Modern Development Practices
- **Server Actions**: Next.js 15 server-side functionality
- **Component Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier with pre-commit hooks
- **Database Management**: Prisma with type-safe queries and migrations
- **State Management**: React Context with custom hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **Structured Logging**: Pino with sensitive data redaction

### ✅ Enterprise-Grade Architecture
- **Modular Components**: Reusable UI primitives with Radix
- **Enhanced ORM**: Prisma client with performance monitoring
- **Smart Middleware**: Auto-navigation and session management
- **Security-First**: Input sanitization, CORS validation, rate limiting
- **Error Handling**: Comprehensive error boundaries and validation
- **API Design**: RESTful endpoints with server actions
- **Monitoring**: Request tracing, query performance, error tracking

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Build Time**: < 30 seconds with Turbopack
- **Bundle Size**: Optimized with Next.js tree shaking and code splitting
- **Test Coverage**: 40%+ with comprehensive scenarios
- **Type Coverage**: 100% TypeScript strict mode compliance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🐛 Troubleshooting

### Common Issues

**Rate limiting in development:**
- Upstash Redis is optional in development
- Automatically falls back to in-memory rate limiter
- Set `UPSTASH_REDIS_REST_URL` for production-like testing

**Database connection errors:**
- Ensure `DATABASE_URL` is correctly formatted
- Run `pnpm run migrate` to apply migrations
- Check Supabase project is active and accessible

**OpenAI API errors:**
- Verify `OPENAI_API_KEY` has sufficient credits
- Check rate limits on OpenAI dashboard
- Review API usage logs for quota issues

**Authentication issues:**
- Confirm email confirmation in Supabase settings
- Check Supabase URL and anon key are correct
- Verify service role key for server-side operations

**Build failures:**
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm run type-check`

## 🗺️ Roadmap

### Planned Features
- [ ] Real-time collaboration with WebSockets
- [ ] Note sharing and permissions
- [ ] Rich text editor with markdown support
- [ ] Note tags and categories
- [ ] Export notes (PDF, Markdown, HTML)
- [ ] Offline support with service workers
- [ ] Mobile app (React Native)
- [ ] Voice-to-text note creation
- [ ] Advanced AI features (summarization, auto-tagging)
- [ ] Note version history

### Performance Improvements
- [ ] Implement note pagination
- [ ] Add virtual scrolling for large note lists
- [ ] Optimize AI response streaming
- [ ] Implement CDN for static assets

### Developer Experience
- [ ] Add Storybook for component documentation
- [ ] Increase test coverage to 80%+
- [ ] Add E2E tests with Playwright
- [ ] Create developer documentation site

---

Built with ❤️ using modern web technologies. Perfect for showcasing production-ready, full-stack development skills with enterprise-grade security practices!

## 📧 Contact & Support

For questions, feedback, or issues:
- Open an issue on GitHub
- Review existing issues before creating new ones
- Include reproduction steps for bugs
- Provide environment details (OS, Node version, browser)

---

**Note**: This is a portfolio project demonstrating production-ready development practices, comprehensive security measures, and modern full-stack architecture. It showcases skills in React, Next.js, TypeScript, database design, API integration, testing, and DevOps.
