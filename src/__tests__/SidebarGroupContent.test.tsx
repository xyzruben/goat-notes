import React from 'react';
import { render } from '@testing-library/react';
import SidebarGroupContent from '@/components/ui/SidebarGroupContent';
import NoteProvider from '@/providers/NoteProvider';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(''),
  }),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock notes data with fixed dates for consistent snapshots
const mockNotes = [
  {
    id: '1',
    text: 'Test note 1',
    authorId: 'user1',
    createdAt: new Date('2025-06-20T10:00:00Z'),
    updatedAt: new Date('2025-06-20T10:00:00Z'),
  },
  {
    id: '2',
    text: 'Test note 2',
    authorId: 'user1',
    createdAt: new Date('2025-06-20T10:00:00Z'),
    updatedAt: new Date('2025-06-20T10:00:00Z'),
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <NoteProvider>{children}</NoteProvider>
  </SidebarProvider>
);

describe('SidebarGroupContent', () => {
  it('renders without crashing', () => {
    const { container } = render(<SidebarGroupContent notes={mockNotes} />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<SidebarGroupContent notes={mockNotes} />, { wrapper });
    expect(container).toMatchSnapshot();
  });
}); 