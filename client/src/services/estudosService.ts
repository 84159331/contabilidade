// Serviço para gerenciar estudos bíblicos diários
export interface Estudo {
  id: number;
  titulo: string;
  versiculo: string;
  texto: string;
  reflexao: string;
  oracao: string;
  data: string;
  autor?: string;
  categoria?: string;
  tags?: string[];
}

// Simulação de banco de dados de estudos
const estudosDatabase: Estudo[] = [
  {
    id: 1,
    titulo: "A Força da Oração",
    versiculo: "Mateus 21:22",
    texto: "E tudo o que pedirdes na oração, crendo, recebereis.",
    reflexao: "A oração é uma das ferramentas mais poderosas que Deus nos deu. Quando oramos com fé, estamos exercitando nossa confiança no Senhor e abrindo nossos corações para Sua vontade. A oração não é apenas pedir, mas também agradecer, adorar e buscar orientação. Em momentos de dificuldade, a oração nos conecta diretamente com o Pai celestial, que conhece nossas necessidades antes mesmo de as expressarmos.",
    oracao: "Senhor, ensina-me a orar com fé verdadeira. Ajuda-me a confiar em Ti em todas as situações e a buscar sempre a Tua vontade. Que minha vida seja uma oração constante de gratidão e adoração. Fortalece minha fé para que eu possa ver os Teus milagres em minha vida. Amém.",
    data: new Date().toISOString().split('T')[0],
    autor: "Pastor João",
    categoria: "Oração",
    tags: ["oração", "fé", "confiança"]
  },
  {
    id: 2,
    titulo: "O Amor Incondicional",
    versiculo: "João 3:16",
    texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reflexao: "O amor de Deus é incomparável e incondicional. Ele nos amou tanto que enviou Seu único Filho para morrer por nós. Este amor não depende de nossos méritos ou ações, mas é puro e eterno. Devemos refletir este amor em nossas vidas, amando uns aos outros como Cristo nos amou. O amor de Deus transforma vidas e quebra barreiras.",
    oracao: "Pai celestial, obrigado pelo Teu amor incondicional. Ajuda-me a compreender a profundidade deste amor e a compartilhá-lo com outros. Que eu seja um instrumento do Teu amor neste mundo, mostrando compaixão e misericórdia a todos que encontro. Amém.",
    data: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    autor: "Pastora Maria",
    categoria: "Amor",
    tags: ["amor", "salvação", "sacrifício"]
  },
  {
    id: 3,
    titulo: "A Fé que Move Montanhas",
    versiculo: "Marcos 11:23",
    texto: "Porque em verdade vos digo que qualquer que disser a este monte: Ergue-te e lança-te no mar, e não duvidar no seu coração, mas crer que se fará aquilo que diz, tudo o que disser lhe será feito.",
    reflexao: "A fé verdadeira não é apenas acreditar que Deus pode fazer algo, mas confiar completamente nEle. Quando nossa fé está alinhada com a vontade de Deus, milagres acontecem. A fé remove obstáculos e abre caminhos impossíveis. É através da fé que vemos o invisível e alcançamos o impossível.",
    oracao: "Senhor, fortalece minha fé. Ajuda-me a confiar completamente em Ti, mesmo quando não entendo os Teus caminhos. Que minha fé seja genuína e transformadora, capaz de mover montanhas e realizar milagres em Tua glória. Amém.",
    data: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    autor: "Pastor Pedro",
    categoria: "Fé",
    tags: ["fé", "milagres", "confiança"]
  },
  {
    id: 4,
    titulo: "A Paz que Excede Todo Entendimento",
    versiculo: "Filipenses 4:7",
    texto: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
    reflexao: "A paz de Deus é diferente da paz do mundo. Enquanto a paz do mundo depende das circunstâncias, a paz de Deus é independente delas. É uma paz que guarda nossos corações e mentes, mesmo em meio às tempestades da vida. Esta paz só pode ser encontrada em Cristo Jesus.",
    oracao: "Senhor, concede-me a Tua paz que excede todo entendimento. Que mesmo em meio às dificuldades, eu possa experimentar a Tua tranquilidade e confiança. Guarda meu coração e minha mente em Cristo Jesus. Amém.",
    data: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    autor: "Pastora Ana",
    categoria: "Paz",
    tags: ["paz", "tranquilidade", "confiança"]
  },
  {
    id: 5,
    titulo: "A Esperança em Cristo",
    versiculo: "Romanos 15:13",
    texto: "Ora, o Deus de esperança vos encha de todo o gozo e paz na vossa fé, para que abundeis na esperança pela virtude do Espírito Santo.",
    reflexao: "A esperança cristã não é uma ilusão ou um desejo vago, mas uma certeza baseada nas promessas de Deus. É uma esperança que nos enche de gozo e paz, mesmo quando as circunstâncias são difíceis. Esta esperança vem do Espírito Santo e nos sustenta em todos os momentos.",
    oracao: "Deus de esperança, enche-me de todo gozo e paz na minha fé. Que eu possa abundar na esperança pela virtude do Teu Espírito Santo. Ajuda-me a confiar nas Tuas promessas e a viver com expectativa do que Tu farás. Amém.",
    data: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    autor: "Pastor Carlos",
    categoria: "Esperança",
    tags: ["esperança", "gozo", "paz"]
  }
];

// Função para obter o estudo do dia
export const getEstudoDoDia = (): Promise<Estudo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hoje = new Date().toISOString().split('T')[0];
      const estudo = estudosDatabase.find(e => e.data === hoje) || estudosDatabase[0];
      resolve(estudo);
    }, 500);
  });
};

// Função para obter todos os estudos
export const getAllEstudos = (): Promise<Estudo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(estudosDatabase.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    }, 300);
  });
};

// Função para obter estudos por categoria
export const getEstudosPorCategoria = (categoria: string): Promise<Estudo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estudos = estudosDatabase.filter(e => e.categoria === categoria);
      resolve(estudos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    }, 300);
  });
};

// Função para adicionar novo estudo (simulação)
export const adicionarEstudo = (estudo: Omit<Estudo, 'id'>): Promise<Estudo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const novoEstudo: Estudo = {
        ...estudo,
        id: estudosDatabase.length + 1
      };
      estudosDatabase.unshift(novoEstudo);
      resolve(novoEstudo);
    }, 500);
  });
};

// Função para obter categorias disponíveis
export const getCategorias = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categorias = Array.from(new Set(estudosDatabase.map(e => e.categoria).filter(Boolean) as string[]));
      resolve(categorias);
    }, 200);
  });
};

// Função para obter estudos por data
export const getEstudoPorData = (data: string): Promise<Estudo | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estudo = estudosDatabase.find(e => e.data === data) || null;
      resolve(estudo);
    }, 300);
  });
};
