import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Machado Imóveis" className="h-12 w-auto" />
              <div>
                <div className="text-white font-heading font-bold text-lg leading-tight">MACHADO</div>
                <div className="text-brand-orange font-heading font-bold text-sm leading-tight tracking-widest">IMÓVEIS</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              O nome certo para grandes negócios.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.instagram.com/machadoimoveisrs?igsh=dG03ZHF1bnRqNjFi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors font-bold text-xs" aria-label="Instagram">
                IG
              </a>
              <a href="https://www.facebook.com/profile.php?id=61576622632552" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors font-bold text-xs" aria-label="Facebook">
                FB
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-orange mb-4">Navegação</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Início' },
                { to: '/sobre', label: 'Sobre Nós' },
                { to: '/vendas', label: 'Imóveis à Venda' },
                { to: '/anuncie', label: 'Anuncie seu Imóvel' },
                { to: '/contato', label: 'Fale Conosco' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tipos */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-orange mb-4">Tipos de Imóvel</h3>
            <ul className="space-y-2">
              {['Casas', 'Apartamentos', 'Terrenos', 'Chácaras / Sítios', 'Imóveis Comerciais'].map(tipo => (
                <li key={tipo}>
                  <Link to="/vendas" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {tipo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-orange mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Rua Antônio Fernandes da Cunha, 557<br />Santana do Livramento – RS</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="https://wa.me/55992038731" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                  (55) 99203-8731
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:brunomaximilliano@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">
                  brunomaximilliano@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Machado Imóveis. Todos os direitos reservados.
          </p>
          <Link to="/admin" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
