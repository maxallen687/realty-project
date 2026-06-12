import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/sobre', label: 'Sobre Nós' },
  { to: '/vendas', label: 'Vendas' },
  { to: '/anuncie', label: 'Anuncie seu Imóvel' },
  { to: '/contato', label: 'Fale Conosco' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-brand-black shadow-2xl' : 'bg-brand-black/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo only — no text beside it */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="Machado Imóveis" className="h-14 md:h-16 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-brand-orange bg-brand-orange/10'
                    : 'text-brand-gray hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5541999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-brand-black border-t border-white/10 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-brand-orange bg-brand-orange/10'
                    : 'text-brand-gray hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5541999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold py-3 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
