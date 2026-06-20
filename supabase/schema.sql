-- =============================================================
-- Machado Imóveis — estrutura do banco de dados (Supabase)
-- Cole TODO este conteúdo no Supabase: menu "SQL Editor" > "New query"
-- > cole > botão "Run". Pode rodar de novo sem problema (é idempotente).
-- =============================================================

-- 1) Tabela de imóveis -----------------------------------------
create table if not exists public.properties (
  id              uuid primary key default gen_random_uuid(),
  title           text        not null,
  description     text        not null default '',
  type            text        not null,
  status          text        not null,
  price           numeric     not null default 0,
  city            text        not null,
  neighborhood    text        not null default '',
  address         text        not null default '',
  bedrooms        integer     not null default 0,
  bathrooms       integer     not null default 0,
  parking_spaces  integer     not null default 0,
  area            numeric     not null default 0,
  images          jsonb       not null default '[]'::jsonb,
  featured        boolean     not null default false,
  lat             double precision,
  lng             double precision,
  whatsapp_contact text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Atualiza automaticamente o campo updated_at em cada edição
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- 2) Segurança (Row Level Security) ----------------------------
-- Visitantes podem APENAS LER. Só usuários logados podem
-- criar, editar e excluir.
alter table public.properties enable row level security;

drop policy if exists "Leitura pública dos imóveis" on public.properties;
create policy "Leitura pública dos imóveis"
  on public.properties for select
  using (true);

drop policy if exists "Admin gerencia imóveis" on public.properties;
create policy "Admin gerencia imóveis"
  on public.properties for all
  to authenticated
  using (true)
  with check (true);

-- 3) Armazenamento das fotos -----------------------------------
-- Cria um "bucket" público para as imagens dos imóveis.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Fotos: leitura pública" on storage.objects;
create policy "Fotos: leitura pública"
  on storage.objects for select
  using (bucket_id = 'property-images');

drop policy if exists "Fotos: upload do admin" on storage.objects;
create policy "Fotos: upload do admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Fotos: remoção do admin" on storage.objects;
create policy "Fotos: remoção do admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');

-- 4) Migração dos imóveis atuais -------------------------------
-- Insere os 6 imóveis que já existem no site. O "where not exists"
-- evita duplicar caso você rode este script mais de uma vez.
insert into public.properties
  (title, description, type, status, price, city, neighborhood, address,
   bedrooms, bathrooms, parking_spaces, area, images, featured, lat, lng,
   whatsapp_contact, created_at)
select * from (values
  (
    'Casa Moderna com Piscina',
    'Linda casa em condomínio fechado, com ampla área de lazer, piscina aquecida, churrasqueira e jardim paisagístico. Acabamento de alto padrão, cozinha gourmet com ilha central, sala de estar integrada com varanda. Localização privilegiada, próximo a escolas, shoppings e vias de acesso.',
    'Casa', 'Pronto', 850000::numeric, 'Curitiba', 'Champagnat', 'Rua das Araucárias, 450',
    4, 3, 3, 280::numeric,
    '["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80"]'::jsonb,
    true, -25.4284, -49.2733, '55992038731', '2024-01-10T10:00:00Z'::timestamptz
  ),
  (
    'Apartamento Alto Padrão – Vista Panorâmica',
    'Apartamento de luxo no 15º andar com vista deslumbrante para a cidade. Varanda gourmet, sala de jantar integrada, suíte master com closet e banheiro com banheira de hidromassagem. Condomínio com academia, salão de festas e segurança 24h.',
    'Apartamento', 'Pronto', 620000::numeric, 'Curitiba', 'Batel', 'Av. do Batel, 1200 – Apto 1502',
    3, 2, 2, 145::numeric,
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]'::jsonb,
    true, -25.4420, -49.2900, null, '2024-01-15T10:00:00Z'::timestamptz
  ),
  (
    'Terreno Residencial em Condomínio',
    'Ótimo terreno plano em condomínio fechado de alto padrão, com infraestrutura completa: asfalto, iluminação, rede de água e esgoto. Localizado em área de expansão, com fácil acesso à BR-116 e ao centro da cidade. Ideal para construção de casa ou sobrado.',
    'Terreno', 'Pronto', 320000::numeric, 'São José dos Pinhais', 'Afonso Pena', 'Condomínio Verde Vale – Lote 45',
    0, 0, 0, 450::numeric,
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80","https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80"]'::jsonb,
    false, -25.5360, -49.2090, null, '2024-02-01T10:00:00Z'::timestamptz
  ),
  (
    'Chácara com Lago e Casa Sede',
    'Belíssima chácara de 5 alqueires com lago para pesca, casa sede de 200m² completamente reformada, curral, galpão para maquinários e pomar variado. Nascente de água em abundância. Acesso por estrada asfaltada. Ótima para lazer ou pequena produção rural.',
    'Chácara/Sítio/Fazenda', 'Pronto', 1200000::numeric, 'Lapa', 'Zona Rural', 'Estrada da Serra, km 12',
    5, 3, 6, 24200::numeric,
    '["https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&q=80","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80","https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=800&q=80"]'::jsonb,
    true, -25.7690, -49.7180, null, '2024-02-10T10:00:00Z'::timestamptz
  ),
  (
    'Sala Comercial – Centro Empresarial',
    'Sala comercial em edifício corporativo triple A, com recepção compartilhada, copa, banheiros e estacionamento rotativo. Excelente localização para escritórios, clínicas ou consultórios. Prédio com gerador, ar-condicionado central e fibra óptica.',
    'Apartamento', 'Comercial', 280000::numeric, 'Curitiba', 'Centro', 'Rua XV de Novembro, 800 – Sala 305',
    0, 1, 1, 65::numeric,
    '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80","https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"]'::jsonb,
    false, -25.4295, -49.2719, null, '2024-02-20T10:00:00Z'::timestamptz
  ),
  (
    'Casa em Construção – Entrega em 2025',
    'Casa em fase final de construção em condomínio horizontal. Projeto moderno com 3 suítes, sala de estar e jantar integradas, lavabo, cozinha com espaço para ilha, área de lazer com pergolado e quintal. Possibilidade de personalização de acabamentos.',
    'Casa', 'Em construção', 490000::numeric, 'Colombo', 'Jardim Belo Horizonte', 'Rua das Flores, 120',
    3, 3, 2, 195::numeric,
    '["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"]'::jsonb,
    false, -25.2919, -49.2230, null, '2024-03-01T10:00:00Z'::timestamptz
  )
) as seed(title, description, type, status, price, city, neighborhood, address,
          bedrooms, bathrooms, parking_spaces, area, images, featured, lat, lng,
          whatsapp_contact, created_at)
where not exists (select 1 from public.properties);

-- Pronto! Banco criado, seguro e com os imóveis atuais migrados.
