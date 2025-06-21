import React from 'react';
import { render } from '@testing-library/react';
import AppSidebar from '@/components/ui/AppSidebar';

describe('AppSidebar', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppSidebar />);
    expect(container).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<AppSidebar />);
    expect(container).toMatchSnapshot();
  });
}); 