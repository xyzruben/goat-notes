export const supabase = {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({ data: { session: { user: { id: 'mock-user-id' } } }, error: null })
      ),
      signOut: jest.fn(() =>
        Promise.resolve({ error: null })
      ),
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ data: { session: { user: { id: 'mock-user-id' } } }, error: null })
      ),
      signUp: jest.fn(() =>
        Promise.resolve({ data: { user: { id: 'mock-user-id' } }, error: null })
      )
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: {}, error: null }))
    }))
  }
  