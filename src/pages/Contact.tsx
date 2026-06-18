import { MessageCircle, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Olá! Meu nome é ${name}.\n\n${message}`);
    window.open(`https://wa.me/55992038731?text=${msg}`, '_blank');
  };

  return (
    <main className="pt-28 md:pt-36">
      {/* Header */}
      <section className="bg-brand-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Fale <span className="text-brand-orange">Conosco</span>
          </h1>
          <p className="text-xl text-brand-gray">
            Estamos prontos para atender você. Escolha a forma mais cômoda.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* WhatsApp CTA */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <a
                href="https://wa.me/55992038731"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 bg-green-50 hover:bg-green-500 border-2 border-green-200 hover:border-green-500 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-green-500 group-hover:bg-white rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <MessageCircle className="w-7 h-7 text-white group-hover:text-green-500" />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-green-700 group-hover:text-white">WhatsApp</div>
                  <div className="text-green-600 group-hover:text-green-100 text-sm">(55) 99203-8731</div>
                  <div className="text-xs text-green-500 group-hover:text-green-200 mt-1">Clique para conversar →</div>
                </div>
              </a>

              <div className="flex items-center gap-5 bg-brand-gray rounded-2xl p-6">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-brand-black">Telefone</div>
                  <div className="text-gray-500 text-sm">(55) 99203-8731</div>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-brand-gray rounded-2xl p-6">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-brand-black">E-mail</div>
                  <div className="text-gray-500 text-sm break-all">brunomaximilliano@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-brand-gray rounded-2xl p-6">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-brand-black">Endereço</div>
                  <div className="text-gray-500 text-sm">Rua Antônio Fernandes da Cunha, 557<br />Santana do Livramento – RS</div>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-brand-gray rounded-2xl p-6">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-heading font-bold text-lg text-brand-black">Horário</div>
                  <div className="text-gray-500 text-sm">Sempre aberto</div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="bg-brand-gray rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-black mb-6">
                  Envie uma mensagem
                </h2>
                <form onSubmit={handleWhatsApp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seu nome *</label>
                    <input
                      type="text"
                      required
                      placeholder="Como podemos te chamar?"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem *</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Em que podemos ajudar? Fale sobre o imóvel que procura ou qualquer dúvida..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="input-field resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base bg-green-500 hover:bg-green-600">
                    <Send className="w-4 h-4" />
                    Enviar pelo WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden shadow-md bg-brand-gray h-72 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-brand-orange mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Santana do Livramento – RS</p>
              <p className="text-gray-400 text-sm mt-1">Rua Antônio Fernandes da Cunha, 557</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
