import type { Property } from '../types';

/**
 * As opções de Cidade/Bairro dos filtros são derivadas dos imóveis cadastrados —
 * não existe lista fixa. Assim, toda cidade ou bairro novo informado no cadastro
 * aparece automaticamente na busca do site.
 */

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

/** Remove espaços duplicados/nas pontas, preservando acentos e maiúsculas. */
const clean = (value: string) => value.trim().replace(/\s+/g, ' ');

/** Chave de comparação: ignora caixa e acentos, para "Sao Paulo" == "São Paulo". */
const key = (value: string) =>
  clean(value)
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/**
 * Compara cidade/bairro ignorando caixa, acentos e espaços extras, para que
 * "Sant'Ana do Livramento" cadastrado como "santana do livramento" continue
 * batendo com a opção exibida no filtro.
 */
export const sameLocation = (a: string, b: string) => key(a ?? '') === key(b ?? '');

export interface LocationIndex {
  /** Todas as cidades cadastradas, em ordem alfabética. */
  cities: string[];
  /** Todos os bairros cadastrados, em ordem alfabética (todas as cidades). */
  neighborhoods: string[];
  /** Bairros por cidade, indexados pela chave normalizada da cidade. */
  neighborhoodsByCity: Record<string, string[]>;
}

/**
 * Junta valores deduplicando por chave normalizada, mantendo a primeira grafia
 * encontrada como forma de exibição.
 */
function collect(values: Iterable<string>): string[] {
  const seen = new Map<string, string>();
  for (const raw of values) {
    if (typeof raw !== 'string') continue;
    const display = clean(raw);
    if (!display) continue;
    const k = key(display);
    if (!seen.has(k)) seen.set(k, display);
  }
  return [...seen.values()].sort(collator.compare);
}

export function buildLocationIndex(properties: Property[]): LocationIndex {
  const neighborhoodsRaw = new Map<string, string[]>();

  for (const property of properties) {
    const city = clean(property.city ?? '');
    const neighborhood = clean(property.neighborhood ?? '');
    if (!city || !neighborhood) continue;
    const k = key(city);
    const list = neighborhoodsRaw.get(k);
    if (list) list.push(neighborhood);
    else neighborhoodsRaw.set(k, [neighborhood]);
  }

  const neighborhoodsByCity: Record<string, string[]> = {};
  for (const [k, list] of neighborhoodsRaw) {
    neighborhoodsByCity[k] = collect(list);
  }

  return {
    cities: collect(properties.map(p => p.city ?? '')),
    neighborhoods: collect(properties.map(p => p.neighborhood ?? '')),
    neighborhoodsByCity,
  };
}

/**
 * Bairros disponíveis para a cidade informada. Sem cidade selecionada,
 * devolve os bairros de todas as cidades.
 */
export function neighborhoodsFor(index: LocationIndex, city: string): string[] {
  const c = clean(city);
  if (!c) return index.neighborhoods;
  return index.neighborhoodsByCity[key(c)] ?? [];
}

/**
 * Garante que o valor atualmente selecionado continue na lista mesmo que o
 * último imóvel daquela cidade/bairro tenha sido removido — evita um select
 * exibindo um filtro ativo em branco.
 */
export function withSelected(options: string[], selected: string): string[] {
  const s = clean(selected);
  if (!s || options.some(o => key(o) === key(s))) return options;
  return [...options, s].sort(collator.compare);
}
