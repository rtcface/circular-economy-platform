import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route } from './index';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: any) => config.component,
  redirect: vi.fn(),
}));

vi.mock('@tanstack/start', () => {
  const mockFn = () => {
    const fn = vi.fn().mockResolvedValue({ id: 1, status: 'pending_validation' });
    const chain: any = {
      validator: () => chain,
      handler: () => fn,
    };
    return chain;
  };
  return { createServerFn: mockFn };
});

describe('Donor Dashboard Intake Form', () => {
  it('renders the form correctly', () => {
    const Component = Route as any;
    render(<Component />);

    expect(screen.getByText('Donor Dashboard')).toBeDefined();
    expect(screen.getByText('Submit a new hardware donation.')).toBeDefined();
    expect(screen.getByText('Hardware Details (JSON)')).toBeDefined();
    expect(screen.getByText('Photos (comma separated URLs)')).toBeDefined();
  });

  it('shows error if photos are missing', async () => {
    const Component = Route as any;
    render(<Component />);

    // Clear photos input
    const photosInput = screen.getByDisplayValue('https://example.com/photo1.jpg');
    fireEvent.change(photosInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: 'Submit Donation' });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Error: Missing required baseline information (photos are mandatory).')).toBeDefined();
  });

  it('submits form successfully when data is valid', async () => {
    const Component = Route as any;
    render(<Component />);

    // Ensure photos are present (default is there)
    const submitButton = screen.getByRole('button', { name: 'Submit Donation' });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Donation submitted successfully!/)).toBeDefined();
  });
});
