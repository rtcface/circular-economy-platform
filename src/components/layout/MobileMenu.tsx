import * as React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onToggle }) => {
  return (
    <div className="md:hidden">
      <button 
        onClick={onToggle}
        className="p-2 text-fuji-white focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-sumi-ink/80 backdrop-blur-sm mt-16" onClick={onClose}>
          <nav className="flex flex-col p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <a href="/" className="text-fuji-white hover:text-spring-green text-lg font-bold">Home</a>
            <a href="/about" className="text-fuji-white hover:text-spring-green text-lg font-bold">About</a>
          </nav>
        </div>
      )}
    </div>
  );
};
