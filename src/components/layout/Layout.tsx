import * as React from 'react';
import { MobileMenu } from './MobileMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-sumi-ink text-fuji-white font-sans flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-sumi-ink/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-spring-green">
              CE Platform
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-spring-green transition-colors">Inicio</a>
            <a href="/about" className="hover:text-spring-green transition-colors">Sobre Nosotros</a>
          </nav>

          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-fuji-white/60">
        © {new Date().getFullYear()} Plataforma de Economía Circular
      </footer>
    </div>
  );
};
