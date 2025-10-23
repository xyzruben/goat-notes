/**
 * Security Tests for Phase 1 API Authentication Fixes
 * Tests CRITICAL-1: Unauthenticated API Endpoints
 */

import 'whatwg-fetch';

const mockGetUser = jest.fn();
const mockPrismaCreate = jest.fn();
const mockPrismaFindFirst = jest.fn();

jest.mock('@/auth/server', () => ({
  getUser: () => mockGetUser(),
}));

jest.mock('@/db/prisma', () => ({
  prisma: {
    note: {
      create: (data: any) => mockPrismaCreate(data),
      findFirst: (query: any) => mockPrismaFindFirst(query),
    },
  },
}));

describe('API Authentication Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaCreate.mockResolvedValue({ id: 'test-note-id' });
    mockPrismaFindFirst.mockResolvedValue({ id: 'newest-note-id' });
  });

  describe('POST /api/create-new-note', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue(null);

      const { POST } = await import('@/app/api/create-new-note/route');
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should create note when user is authenticated', async () => {
      mockGetUser.mockResolvedValue({
        id: 'authenticated-user-id',
        email: 'test@example.com',
      });

      const { POST } = await import('@/app/api/create-new-note/route');
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('noteId');
    });

    it('should use authenticated user ID, not query parameters', async () => {
      const userId = 'authenticated-user-id';
      mockGetUser.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
      });

      const { POST } = await import('@/app/api/create-new-note/route');
      await POST();

      expect(mockPrismaCreate).toHaveBeenCalledWith({
        data: {
          authorId: userId,
          text: '',
        },
      });
    });
  });

  describe('GET /api/fetch-newest-note', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue(null);

      const { GET } = await import('@/app/api/fetch-newest-note/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should fetch note when user is authenticated', async () => {
      mockGetUser.mockResolvedValue({
        id: 'authenticated-user-id',
        email: 'test@example.com',
      });

      const { GET } = await import('@/app/api/fetch-newest-note/route');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('newestNoteId');
    });

    it('should use authenticated user ID, not query parameters', async () => {
      const userId = 'authenticated-user-id';
      mockGetUser.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
      });

      const { GET } = await import('@/app/api/fetch-newest-note/route');
      await GET();

      expect(mockPrismaFindFirst).toHaveBeenCalledWith({
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
        },
      });
    });
  });
});
