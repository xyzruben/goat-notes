export const supabase = {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({ 
          data: { 
            session: { 
              user: { 
                id: 'mock-user-id',
                email: 'test@example.com',
                created_at: '2024-01-01T00:00:00Z'
              } 
            } 
          }, 
          error: null 
        })
      ),
      signOut: jest.fn(() =>
        Promise.resolve({ error: null })
      ),
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ 
          data: { 
            session: { 
              user: { 
                id: 'mock-user-id',
                email: 'test@example.com'
              } 
            } 
          }, 
          error: null 
        })
      ),
      signUp: jest.fn(() =>
        Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id',
              email: 'test@example.com'
            } 
          }, 
          error: null 
        })
      ),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ 
        data: { 
          id: 'mock-note-id',
          title: 'Mock Note',
          content: 'Mock content',
          user_id: 'mock-user-id',
          created_at: '2024-01-01T00:00:00Z'
        }, 
        error: null 
      })),
      then: jest.fn((callback) => Promise.resolve(callback({ 
        data: [
          {
            id: 'mock-note-1',
            title: 'Mock Note 1',
            content: 'Mock content 1',
            user_id: 'mock-user-id',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 'mock-note-2', 
            title: 'Mock Note 2',
            content: 'Mock content 2',
            user_id: 'mock-user-id',
            created_at: '2024-01-02T00:00:00Z'
          }
        ], 
        error: null 
      })))
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: 'mock-path' }, error: null })),
        download: jest.fn(() => Promise.resolve({ data: null, error: null })),
        remove: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }
  }
  