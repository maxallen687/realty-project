import { useState } from 'react';
import { Send, CheckCircle, ChevronDown } from 'lucide-react';
import type { LeadForm, PropertyType } from '../types';

const PROPERTY_TYPES: PropertyType[] = ['Casa', 'Apartamento', 'Terreno', 'Chácara/Sítio/Fazenda'];

export default function ListProperty() {
  const [form, setForm] = useState<LeadForm>({ name: '', whatsapp: '', propertyType: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Olá! Gostaria de anunciar meu imóvel na Machado Imóveis.\n\n` +
      `*Nome:* ${form.name}\n` +
      `*Tipo:* ${form.propertyType}\n` +
      (form.message ? `*Detalhes:* ${form.message}` : '')
    );
    window.open(`https://wa.me/55992038731?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const set = (key: keyof LeadForm, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <main className="pt-28 md:pt-36">
      {/* Header */}
      <section className="bg-brand-black py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Anuncie seu <span className="text-brand-orange">Imóvel</span>
          </h1>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">
            Alcance compradores qualificados e venda com segurança. Preencha o formulário e entraremos em contato.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Benefits */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-heading font-bold text-brand-black">Por que anunciar conosco?</h2>
              {[
                { title: 'Avaliação gratuita', desc: 'Avaliamos seu imóvel sem custo algum para você.' },
                { title: 'Divulgação ampla', desc: 'Seu imóvel aparece no nosso site, redes sociais e portais.' },
                { title: 'Atendimento pessoal', desc: 'Um corretor dedicado cuida do seu imóvel do início ao fim.' },
                { title: 'Documentação segura', desc: 'Cuidamos de toda a parte burocrática da negociação.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-brand-black">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}

              <div className="bg-brand-orange rounded-2xl p-6 text-white">
                <p className="font-heading font-bold text-lg mb-3">Prefere ligar?</p>
                <a href="https://wa.me/5555992038731" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-orange font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand-gray transition-colors inline-block">
                  (55) 99203-8731
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-brand-black mb-2">Mensagem enviada!</h3>
                  <p className="text-gray-500 mb-6">
                    Você foi redirecionado para o WhatsApp. Aguarde o retorno do nosso corretor em breve.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">Enviar outro imóvel</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
                  <h2 className="text-2xl font-heading font-bold text-brand-black mb-1">Fale com a gente</h2>
                  <p className="text-gray-500 text-sm">Preencha os dados abaixo e entraremos em contato rapidamente.</p>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seu nome completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(55) 99203-8731"
                      value={form.whatsapp}
                      onChange={e => set('whatsapp', formatPhone(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de imóvel *</label>
                    <div className="relative">
                      <select
                        required
                        value={form.propertyType}
                        onChange={e => set('propertyType', e.target.value)}
                        className="select-field pr-10"
                      >
                        <option value="">Selecione o tipo</option>
                        {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descreva seu imóvel (opcional)</label>
                    <textarea
                      rows={4}
                      placeholder="Localização, metragem, características principais..."
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                    <Send className="w-4 h-4" />
                    Enviar via WhatsApp
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Ao enviar, você será redirecionado ao WhatsApp para continuar a conversa.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
