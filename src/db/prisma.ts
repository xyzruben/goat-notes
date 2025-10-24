import { PrismaClient } from "@prisma/client";
import { dbLogger } from "@/lib/logger";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Enhanced Prisma client with query logging and monitoring
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now();
        try {
          const result = await query(args);
          const end = performance.now();
          const duration = end - start;

          // Log slow queries (> 1000ms)
          if (duration > 1000) {
            dbLogger.warn({
              model,
              operation,
              duration: `${duration.toFixed(2)}ms`,
              slow: true,
            }, 'Slow database query detected');
          } else if (process.env.NODE_ENV !== 'production') {
            // Log all queries in development
            dbLogger.debug({
              model,
              operation,
              duration: `${duration.toFixed(2)}ms`,
            }, 'Database query');
          }

          return result;
        } catch (error) {
          const end = performance.now();
          const duration = end - start;

          dbLogger.error({
            model,
            operation,
            duration: `${duration.toFixed(2)}ms`,
            error,
          }, 'Database query failed');

          throw error;
        }
      },
    },
  });

// Setup event listeners for Prisma logs (only if $on is available, not in tests)
if (typeof prisma.$on === 'function') {
  prisma.$on('query' as never, (e: any) => {
    if (process.env.NODE_ENV !== 'production') {
      dbLogger.debug({
        query: e.query,
        params: e.params,
        duration: e.duration,
      }, 'Prisma query event');
    }
  });

  prisma.$on('error' as never, (e: any) => {
    dbLogger.error({
      message: e.message,
      target: e.target,
    }, 'Prisma error event');
  });

  prisma.$on('warn' as never, (e: any) => {
    dbLogger.warn({
      message: e.message,
    }, 'Prisma warning event');
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;