import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route } from './register';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (config: any) => config.component,
  useNavigate: () => vi.fn(),
}));

vi.mock('@tanstack/start', () => {
  const mockFn = () => {
    const chain: any = {
      validator: () => chain,
      handler: vi.fn(),
    };
    return chain;
  };
  return { createServerFn: mockFn };
});

vi.mock('../../components/MapPicker', () => ({
  MapPicker: ({ onLocationSelect }: any) => (
    <div data-testid="map-picker">
      <button type="button" onClick={() => onLocationSelect(-34.6037, -58.3816)}>
        Simulate Map Click
      </button>
    </div>
  )
}));

describe('Register Component', () => {
  it('renders the registration form', () => {
    const Component = Route as any;
    render(<Component />);
    
    expect(screen.getAllByText('Register')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Password')).toBeDefined();
    expect(screen.getByText('Role')).toBeDefined();
    expect(screen.getByText('Location')).toBeDefined();
  });

  it('shows error if location is not selected', async () => {
    const Component = Route as any;
    render(<Component />);
    
    // Fill required fields
    const emailInput = document.querySelector('input[type="email"]')!;
    const passwordInput = document.querySelector('input[type="password"]')!;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Please select a location on the map')).toBeDefined();
  });

  it('allows selecting location and removes location error', () => {
    const Component = Route as any;
    render(<Component />);
    
    const mapButton = screen.getByText('Simulate Map Click');
    fireEvent.click(mapButton);
    
    expect(screen.getByText(/Location selected: -34.6037, -58.3816/)).toBeDefined();
  });
});
