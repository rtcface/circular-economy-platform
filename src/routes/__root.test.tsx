import { describe, it, expect } from 'vitest';
import { Route } from './__root';
import appCss from '../styles/global.css?url';

describe('Root Route', () => {
  it('injects global.css in links to prevent FOUC', () => {
    // Check if links is defined
    expect(Route.options.links).toBeDefined();
    
    // Call it to get the links array
    const links = Route.options.links!();
    
    // Find the stylesheet link
    const stylesheetLink = links.find((link) => link.rel === 'stylesheet');
    
    expect(stylesheetLink).toBeDefined();
    expect(stylesheetLink?.href).toBe(appCss);
  });
});
