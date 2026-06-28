import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NeonButton } from './NeonButton';

describe('NeonButton', () => {
  it('renders children correctly', () => {
    render(<NeonButton>Click Me</NeonButton>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('applies primary styles by default', () => {
    render(<NeonButton>Primary</NeonButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-spring-green');
  });

  it('applies secondary styles when variant is secondary', () => {
    render(<NeonButton variant="secondary">Secondary</NeonButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-dragon-blue');
  });

  it('shows loading state and disables button', () => {
    render(<NeonButton isLoading>Loading</NeonButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('opacity-75');
    expect(button.className).toContain('cursor-not-allowed');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<NeonButton onClick={handleClick}>Click</NeonButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
