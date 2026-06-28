import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Route } from './index';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: any) => {
    // For Route.useLoaderData
    config.component.useLoaderData = () => ({
      pendingDonations: [
        {
          id: '123',
          donorId: '456',
          status: 'pending_validation',
          hardwareDetails: { type: 'laptop' },
          photos: ['http://example.com/img.jpg'],
          location: [-58.3816, -34.6037]
        }
      ]
    });
    return config.component;
  },
  useRouter: () => ({ invalidate: vi.fn() }),
  redirect: vi.fn(),
}));

const { mockApproveFn } = vi.hoisted(() => {
  return { mockApproveFn: vi.fn().mockResolvedValue({ success: true }) };
});

vi.mock('@tanstack/start', () => {
  const mockFn = () => {
    const fn = mockApproveFn;
    const chain: any = {
      validator: () => chain,
      handler: () => fn,
    };
    return chain;
  };
  return {
    createServerFn: mockFn,
    useServerFn: () => vi.fn(),
  };
});

describe('Admin Dashboard Approval', () => {
  it('renders pending donations correctly', () => {
    const Component = Route as any;
    render(<Component />);

    expect(screen.getByText('Admin Dashboard')).toBeDefined();
    expect(screen.getByText('Pending Hardware Validations')).toBeDefined();

    expect(screen.getByText(/123/)).toBeDefined(); // ID
    expect(screen.getByText(/456/)).toBeDefined(); // Donor ID
  });

  it('handles approve click', async () => {
    const Component = Route as any;
    render(<Component />);

    const approveBtn = screen.getByRole('button', { name: 'Approve (Mark as Accepted)' });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(mockApproveFn).toHaveBeenCalled();
    });
  });
});
