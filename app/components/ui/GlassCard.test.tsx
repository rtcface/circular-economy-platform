import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('renders children and applies base styles', () => {
    render(<GlassCard>Test Content</GlassCard>);
    
    const element = screen.getByText('Test Content');
    
    expect(element.className).toContain('bg-sumi-ink/90');
    expect(element.className).toContain('backdrop-blur');
  });

  it('applies custom className', () => {
    render(<GlassCard className="custom-test-class">Content</GlassCard>);
    const element = screen.getByText('Content');
    expect(element.className).toContain('custom-test-class');
  });
});
