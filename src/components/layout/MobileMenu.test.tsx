import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileMenu } from './MobileMenu';

describe('MobileMenu', () => {
  it('renders closed state by default', () => {
    const onToggle = vi.fn();
    const onClose = vi.fn();
    
    render(<MobileMenu isOpen={false} onToggle={onToggle} onClose={onClose} />);
    
    const button = screen.getByRole('button', { name: /toggle menu/i });
    expect(button).toBeDefined();
    expect(screen.queryByText('Home')).toBeNull(); // Menu is closed
  });

  it('renders open state and links', () => {
    const onToggle = vi.fn();
    const onClose = vi.fn();
    
    render(<MobileMenu isOpen={true} onToggle={onToggle} onClose={onClose} />);
    
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
  });

  it('calls onToggle when button is clicked', () => {
    const onToggle = vi.fn();
    const onClose = vi.fn();
    
    render(<MobileMenu isOpen={false} onToggle={onToggle} onClose={onClose} />);
    
    const button = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
