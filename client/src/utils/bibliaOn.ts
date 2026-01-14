// UtilitÃ¡rios para integraÃ§Ã£o simples com o site BÃ­bliaon
// Base: https://www.bibliaon.com/

export const BIBLIAON_BASE_URL = 'https://www.bibliaon.com';

// Link geral da seÃ§Ã£o de EsboÃ§os de PregaÃ§Ã£o
export const getBibliaOnEsbocosIndexUrl = () =>
  `${BIBLIAON_BASE_URL}/esbocos_de_pregacao/`;

// Busca genÃ©rica no site (texto livre: tema, palavra, referÃªncia)
export const getBibliaOnSearchUrl = (query: string) => {
  const q = encodeURIComponent(query.trim());
  return `${BIBLIAON_BASE_URL}/?q=${q}`;
};

// Futuro: se vocÃª quiser mapear diretamente livros/capÃ­tulos, dÃ¡ para criar
// helpers especÃ­ficos aqui para ir alÃ©m da busca genÃ©rica.


