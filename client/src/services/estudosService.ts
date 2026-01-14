// ServiÃ§o para gerenciar estudos bÃ­blicos diÃ¡rios
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

// SimulaÃ§Ã£o de banco de dados de estudos
const estudosDatabase: Estudo[] = [
  {
    id: 1,
    titulo: "A ForÃ§a da OraÃ§Ã£o",
    versiculo: "Mateus 21:22",
    texto: "E tudo o que pedirdes na oraÃ§Ã£o, crendo, recebereis.",
    reflexao: "A oraÃ§Ã£o Ã© uma das ferramentas mais poderosas que Deus nos deu. Quando oramos com fÃ©, estamos exercitando nossa confianÃ§a no Senhor e abrindo nossos coraÃ§Ãµes para Sua vontade. A oraÃ§Ã£o nÃ£o Ã© apenas pedir, mas tambÃ©m agradecer, adorar e buscar orientaÃ§Ã£o. Em momentos de dificuldade, a oraÃ§Ã£o nos conecta diretamente com o Pai celestial, que conhece nossas necessidades antes mesmo de as expressarmos.",
    oracao: "Senhor, ensina-me a orar com fÃ© verdadeira. Ajuda-me a confiar em Ti em todas as situaÃ§Ãµes e a buscar sempre a Tua vontade. Que minha vida seja uma oraÃ§Ã£o constante de gratidÃ£o e adoraÃ§Ã£o. Fortalece minha fÃ© para que eu possa ver os Teus milagres em minha vida. AmÃ©m.",
    data: new Date().toISOString().split('T')[0],
    autor: "ApÃ³stolo Isac",
    categoria: "OraÃ§Ã£o",
    tags: ["oraÃ§Ã£o", "fÃ©", "confianÃ§a"]
  },
  {
    id: 2,
    titulo: "O Amor Incondicional",
    versiculo: "JoÃ£o 3:16",
    texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigÃªnito, para que todo aquele que nele crÃª nÃ£o pereÃ§a, mas tenha a vida eterna.",
    reflexao: "O amor de Deus Ã© incomparÃ¡vel e incondicional. Ele nos amou tanto que enviou Seu Ãºnico Filho para morrer por nÃ³s. Este amor nÃ£o depende de nossos mÃ©ritos ou aÃ§Ãµes, mas Ã© puro e eterno. Devemos refletir este amor em nossas vidas, amando uns aos outros como Cristo nos amou. O amor de Deus transforma vidas e quebra barreiras.",
    oracao: "Pai celestial, obrigado pelo Teu amor incondicional. Ajuda-me a compreender a profundidade deste amor e a compartilhÃ¡-lo com outros. Que eu seja um instrumento do Teu amor neste mundo, mostrando compaixÃ£o e misericÃ³rdia a todos que encontro. AmÃ©m.",
    data: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    autor: "ApÃ³stola Elaine",
    categoria: "Amor",
    tags: ["amor", "salvaÃ§Ã£o", "sacrifÃ­cio"]
  },
  {
    id: 3,
    titulo: "A FÃ© que Move Montanhas",
    versiculo: "Marcos 11:23",
    texto: "Porque em verdade vos digo que qualquer que disser a este monte: Ergue-te e lanÃ§a-te no mar, e nÃ£o duvidar no seu coraÃ§Ã£o, mas crer que se farÃ¡ aquilo que diz, tudo o que disser lhe serÃ¡ feito.",
    reflexao: "A fÃ© verdadeira nÃ£o Ã© apenas acreditar que Deus pode fazer algo, mas confiar completamente nEle. Quando nossa fÃ© estÃ¡ alinhada com a vontade de Deus, milagres acontecem. A fÃ© remove obstÃ¡culos e abre caminhos impossÃ­veis. Ã‰ atravÃ©s da fÃ© que vemos o invisÃ­vel e alcanÃ§amos o impossÃ­vel.",
    oracao: "Senhor, fortalece minha fÃ©. Ajuda-me a confiar completamente em Ti, mesmo quando nÃ£o entendo os Teus caminhos. Que minha fÃ© seja genuÃ­na e transformadora, capaz de mover montanhas e realizar milagres em Tua glÃ³ria. AmÃ©m.",
    data: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    autor: "Pastor Jadney",
    categoria: "FÃ©",
    tags: ["fÃ©", "milagres", "confianÃ§a"]
  },
  {
    id: 4,
    titulo: "A Paz que Excede Todo Entendimento",
    versiculo: "Filipenses 4:7",
    texto: "E a paz de Deus, que excede todo o entendimento, guardarÃ¡ os vossos coraÃ§Ãµes e os vossos sentimentos em Cristo Jesus.",
    reflexao: "A paz de Deus Ã© diferente da paz do mundo. Enquanto a paz do mundo depende das circunstÃ¢ncias, a paz de Deus Ã© independente delas. Ã‰ uma paz que guarda nossos coraÃ§Ãµes e mentes, mesmo em meio Ã s tempestades da vida. Esta paz sÃ³ pode ser encontrada em Cristo Jesus.",
    oracao: "Senhor, concede-me a Tua paz que excede todo entendimento. Que mesmo em meio Ã s dificuldades, eu possa experimentar a Tua tranquilidade e confianÃ§a. Guarda meu coraÃ§Ã£o e minha mente em Cristo Jesus. AmÃ©m.",
    data: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    autor: "Pastora Fran",
    categoria: "Paz",
    tags: ["paz", "tranquilidade", "confianÃ§a"]
  },
  {
    id: 5,
    titulo: "A EsperanÃ§a em Cristo",
    versiculo: "Romanos 15:13",
    texto: "Ora, o Deus de esperanÃ§a vos encha de todo o gozo e paz na vossa fÃ©, para que abundeis na esperanÃ§a pela virtude do EspÃ­rito Santo.",
    reflexao: "A esperanÃ§a cristÃ£ nÃ£o Ã© uma ilusÃ£o ou um desejo vago, mas uma certeza baseada nas promessas de Deus. Ã‰ uma esperanÃ§a que nos enche de gozo e paz, mesmo quando as circunstÃ¢ncias sÃ£o difÃ­ceis. Esta esperanÃ§a vem do EspÃ­rito Santo e nos sustenta em todos os momentos.",
    oracao: "Deus de esperanÃ§a, enche-me de todo gozo e paz na minha fÃ©. Que eu possa abundar na esperanÃ§a pela virtude do Teu EspÃ­rito Santo. Ajuda-me a confiar nas Tuas promessas e a viver com expectativa do que Tu farÃ¡s. AmÃ©m.",
    data: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    autor: "Pastora Kele",
    categoria: "EsperanÃ§a",
    tags: ["esperanÃ§a", "gozo", "paz"]
  },
  {
    id: 6,
    titulo: "A ComunhÃ£o dos Santos",
    versiculo: "Hebreus 10:24-25",
    texto: "E consideremo-nos uns aos outros para nos estimularmos ao amor e Ã s boas obras. NÃ£o deixando a nossa congregaÃ§Ã£o, como Ã© costume de alguns, antes admoestando-nos uns aos outros; e tanto mais, quanto vedes que se vai aproximando aquele dia.",
    reflexao: "A comunhÃ£o cristÃ£ Ã© essencial para nosso crescimento espiritual. Quando nos reunimos como irmÃ£os e irmÃ£s em Cristo, somos fortalecidos, encorajados e edificados. A igreja nÃ£o Ã© apenas um prÃ©dio, mas o corpo de Cristo, onde cada membro tem um papel importante.",
    oracao: "Senhor, ajuda-me a valorizar a comunhÃ£o com meus irmÃ£os na fÃ©. Que eu possa ser um encorajamento para outros e receber encorajamento deles. Fortalece nossa igreja para que sejamos um testemunho do Teu amor. AmÃ©m.",
    data: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    autor: "Pastor Leomar",
    categoria: "ComunhÃ£o",
    tags: ["comunhÃ£o", "igreja", "encorajamento"]
  },
  {
    id: 7,
    titulo: "Servindo com ExcelÃªncia",
    versiculo: "Colossenses 3:23-24",
    texto: "E tudo quanto fizerdes, fazei-o de todo o coraÃ§Ã£o, como ao Senhor, e nÃ£o aos homens, sabendo que recebereis do Senhor o galardÃ£o da heranÃ§a, porque a Cristo, o Senhor, servis.",
    reflexao: "Servir a Deus nÃ£o Ã© apenas um dever, Ã© um privilÃ©gio. Quando servimos com excelÃªncia, refletimos o carÃ¡ter de Cristo e glorificamos o nome do Senhor. Cada ato de serviÃ§o, por menor que seja, tem valor eterno no reino de Deus.",
    oracao: "Senhor, ensina-me a servir com excelÃªncia e de todo coraÃ§Ã£o. Que eu possa fazer tudo para a Tua glÃ³ria, nÃ£o para agradar aos homens, mas para honrar o Teu nome. Usa-me como instrumento do Teu amor. AmÃ©m.",
    data: new Date(Date.now() - 518400000).toISOString().split('T')[0],
    autor: "Pastor Elcio",
    categoria: "ServiÃ§o",
    tags: ["serviÃ§o", "excelÃªncia", "dedicaÃ§Ã£o"]
  },
  {
    id: 8,
    titulo: "A TransformaÃ§Ã£o pelo EspÃ­rito",
    versiculo: "2 CorÃ­ntios 3:18",
    texto: "Mas todos nÃ³s, com rosto descoberto, refletindo como um espelho a glÃ³ria do Senhor, somos transformados de glÃ³ria em glÃ³ria na mesma imagem, como pelo EspÃ­rito do Senhor.",
    reflexao: "A transformaÃ§Ã£o cristÃ£ Ã© um processo contÃ­nuo que acontece atravÃ©s do EspÃ­rito Santo. Ã€ medida que contemplamos a glÃ³ria do Senhor, somos transformados Ã  Sua imagem. Esta transformaÃ§Ã£o nÃ£o Ã© apenas externa, mas principalmente interna, moldando nosso carÃ¡ter e nosso coraÃ§Ã£o.",
    oracao: "EspÃ­rito Santo, transforma-me Ã  imagem de Cristo. Remove tudo que nÃ£o agrada ao Senhor e molda meu carÃ¡ter segundo a Sua vontade. Que eu possa refletir a glÃ³ria de Deus em minha vida. AmÃ©m.",
    data: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    autor: "Pastora Eneize",
    categoria: "TransformaÃ§Ã£o",
    tags: ["transformaÃ§Ã£o", "EspÃ­rito Santo", "crescimento"]
  },
  {
    id: 9,
    titulo: "A Sabedoria que Vem do Alto",
    versiculo: "Tiago 3:17",
    texto: "Mas a sabedoria que vem do alto Ã© primeiramente pura, depois pacÃ­fica, moderada, tratÃ¡vel, cheia de misericÃ³rdia e de bons frutos, sem parcialidade, e sem hipocrisia.",
    reflexao: "A sabedoria divina Ã© diferente da sabedoria humana. Ela Ã© pura, pacÃ­fica e cheia de misericÃ³rdia. Quando buscamos esta sabedoria, nossas decisÃµes sÃ£o guiadas pelo EspÃ­rito Santo e refletem o carÃ¡ter de Cristo. Esta sabedoria nos ajuda a viver em harmonia com outros e a fazer escolhas que glorificam a Deus.",
    oracao: "Senhor, concede-me a sabedoria que vem do alto. Que eu possa tomar decisÃµes guiadas pelo Teu EspÃ­rito e viver de forma que glorifique o Teu nome. Ajuda-me a ser puro, pacÃ­fico e misericordioso em todas as minhas aÃ§Ãµes. AmÃ©m.",
    data: new Date(Date.now() - 691200000).toISOString().split('T')[0],
    autor: "Pastor Thiago",
    categoria: "Sabedoria",
    tags: ["sabedoria", "decisÃµes", "carÃ¡ter"]
  },
  {
    id: 10,
    titulo: "O Amor que NÃ£o Falha",
    versiculo: "1 CorÃ­ntios 13:8",
    texto: "O amor nunca falha; mas havendo profecias, serÃ£o aniquiladas; havendo lÃ­nguas, cessarÃ£o; havendo ciÃªncia, desaparecerÃ¡.",
    reflexao: "O amor de Deus Ã© eterno e nunca falha. Enquanto outras coisas podem passar, o amor permanece para sempre. Este amor nos capacita a amar outros de forma incondicional, mesmo quando Ã© difÃ­cil. Ã‰ atravÃ©s do amor que demonstramos o carÃ¡ter de Cristo ao mundo.",
    oracao: "Pai celestial, ensina-me a amar como Tu amas. Que meu amor seja genuÃ­no, incondicional e transformador. Ajuda-me a demonstrar Teu amor atravÃ©s de minhas aÃ§Ãµes e palavras. Que eu seja um instrumento do Teu amor neste mundo. AmÃ©m.",
    data: new Date(Date.now() - 777600000).toISOString().split('T')[0],
    autor: "Pastora Rany",
    categoria: "Amor",
    tags: ["amor", "eternidade", "transformaÃ§Ã£o"]
  },
  // Novos estudos de FÃ©
  {
    id: 11,
    titulo: "ConfianÃ§a InabalÃ¡vel",
    versiculo: "IsaÃ­as 26:3",
    texto: "Tu conservarÃ¡s em paz aquele cuja mente estÃ¡ firme em ti; porque ele confia em ti.",
    reflexao: "A confianÃ§a em Deus Ã© a base de uma vida estÃ¡vel e pacÃ­fica. Quando nossa mente estÃ¡ firmemente focada em Deus, Ele nos conserva em paz, independentemente das circunstÃ¢ncias externas. Esta confianÃ§a nÃ£o Ã© passiva, mas ativa - Ã© uma escolha diÃ¡ria de depositar nossa fÃ© no Senhor.",
    oracao: "Senhor, fortalece minha confianÃ§a em Ti. Ajuda-me a manter minha mente firme em Ti, mesmo quando as circunstÃ¢ncias sÃ£o desafiadoras. Que eu possa experimentar a Tua paz que vem da confianÃ§a genuÃ­na. AmÃ©m.",
    data: new Date(Date.now() - 864000000).toISOString().split('T')[0],
    autor: "Pastor Jadney",
    categoria: "FÃ©",
    tags: ["confianÃ§a", "paz", "estabilidade"]
  },
  {
    id: 12,
    titulo: "A FÃ© dos Gigantes",
    versiculo: "Hebreus 11:1",
    texto: "Ora, a fÃ© Ã© o firme fundamento das coisas que se esperam, e a prova das coisas que se nÃ£o veem.",
    reflexao: "A fÃ© Ã© o fundamento sÃ³lido que sustenta nossas esperanÃ§as e a evidÃªncia das realidades invisÃ­veis. Os herÃ³is da fÃ© mencionados em Hebreus 11 nÃ£o eram perfeitos, mas tinham uma caracterÃ­stica em comum: confiavam completamente em Deus. Sua fÃ© os capacitou a fazer coisas extraordinÃ¡rias e a perseverar em meio Ã s dificuldades.",
    oracao: "Senhor, desenvolve em mim a fÃ© dos gigantes. Ajuda-me a ver alÃ©m das circunstÃ¢ncias visÃ­veis e a confiar nas Tuas promessas invisÃ­veis. Que minha fÃ© seja um firme fundamento que sustente todas as minhas esperanÃ§as. AmÃ©m.",
    data: new Date(Date.now() - 950400000).toISOString().split('T')[0],
    autor: "Pastora Fran",
    categoria: "FÃ©",
    tags: ["fÃ©", "fundamento", "herÃ³is"]
  },
  // Novos estudos de EsperanÃ§a
  {
    id: 13,
    titulo: "EsperanÃ§a Renovada",
    versiculo: "LamentaÃ§Ãµes 3:22-23",
    texto: "As misericÃ³rdias do Senhor sÃ£o a causa de nÃ£o sermos consumidos, porque as suas misericÃ³rdias nÃ£o tÃªm fim; renovam-se cada manhÃ£. Grande Ã© a tua fidelidade.",
    reflexao: "Mesmo nos momentos mais sombrios da vida, as misericÃ³rdias de Deus se renovam a cada manhÃ£. Sua fidelidade Ã© grande e constante. Esta verdade nos dÃ¡ esperanÃ§a renovada para cada novo dia, sabendo que Deus estÃ¡ sempre presente e ativo em nossa vida.",
    oracao: "Senhor, obrigado pelas Tuas misericÃ³rdias que se renovam a cada manhÃ£. Ajuda-me a confiar na Tua grande fidelidade, mesmo quando nÃ£o vejo o caminho Ã  frente. Renova minha esperanÃ§a e fortalece minha confianÃ§a em Ti. AmÃ©m.",
    data: new Date(Date.now() - 1036800000).toISOString().split('T')[0],
    autor: "ApÃ³stola Elaine",
    categoria: "EsperanÃ§a",
    tags: ["esperanÃ§a", "misericÃ³rdia", "fidelidade"]
  },
  {
    id: 14,
    titulo: "O AmanhÃ£ Pertence a Deus",
    versiculo: "Jeremias 29:11",
    texto: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e nÃ£o de mal, para vos dar o fim que esperais.",
    reflexao: "Deus tem planos especÃ­ficos para cada um de nÃ³s - planos de paz e prosperidade, nÃ£o de mal. Quando entregamos nosso futuro nas mÃ£os de Deus, podemos descansar na certeza de que Ele estÃ¡ trabalhando para o nosso bem. O amanhÃ£ pertence a Ele, e podemos confiar nisso.",
    oracao: "Senhor, entrego meu futuro em Tuas mÃ£os. Ajuda-me a confiar nos Teus pensamentos de paz para minha vida. Que eu possa descansar na certeza de que Tu tens o melhor planejado para mim. AmÃ©m.",
    data: new Date(Date.now() - 1123200000).toISOString().split('T')[0],
    autor: "Pastor Jadney",
    categoria: "EsperanÃ§a",
    tags: ["futuro", "planos", "paz"]
  },
  // Palavras de Coach
  {
    id: 15,
    titulo: "Desperte o Gigante Interior",
    versiculo: "Filipenses 4:13",
    texto: "Posso todas as coisas naquele que me fortalece.",
    reflexao: "Dentro de cada um de nÃ³s existe um potencial ilimitado que sÃ³ pode ser despertado atravÃ©s da forÃ§a que vem de Cristo. NÃ£o somos limitados por nossas prÃ³prias capacidades, mas sim fortalecidos pelo poder de Deus. Quando reconhecemos nossa dependÃªncia dEle, descobrimos que podemos fazer muito mais do que imaginÃ¡vamos.",
    oracao: "Senhor, desperta o gigante interior que hÃ¡ em mim. Ajuda-me a reconhecer que posso todas as coisas atravÃ©s da Tua forÃ§a. Remove as limitaÃ§Ãµes que coloquei sobre mim mesmo e capacita-me para cumprir o propÃ³sito que tens para minha vida. AmÃ©m.",
    data: new Date(Date.now() - 1209600000).toISOString().split('T')[0],
    autor: "Coach CristÃ£o",
    categoria: "Palavras de Coach",
    tags: ["potencial", "forÃ§a", "capacitaÃ§Ã£o"]
  },
  {
    id: 16,
    titulo: "Mindset Vencedor",
    versiculo: "Romanos 12:2",
    texto: "E nÃ£o vos conformeis com este mundo, mas transformai-vos pela renovaÃ§Ã£o do vosso entendimento, para que experimenteis qual seja a boa, agradÃ¡vel e perfeita vontade de Deus.",
    reflexao: "Um mindset vencedor comeÃ§a com a renovaÃ§Ã£o da mente. Precisamos transformar nossa forma de pensar, deixando de lado os padrÃµes do mundo e abraÃ§ando a perspectiva de Deus. Esta transformaÃ§Ã£o nos capacita a discernir e viver a vontade perfeita de Deus.",
    oracao: "Senhor, renova minha mente e transforma meu entendimento. Ajuda-me a nÃ£o me conformar com os padrÃµes do mundo, mas a pensar como Tu pensas. Que eu possa experimentar e viver a Tua vontade perfeita. AmÃ©m.",
    data: new Date(Date.now() - 1296000000).toISOString().split('T')[0],
    autor: "Coach CristÃ£o",
    categoria: "Palavras de Coach",
    tags: ["mindset", "transformaÃ§Ã£o", "renovaÃ§Ã£o"]
  },
  // Palavras de EsperanÃ§a
  {
    id: 17,
    titulo: "Consolo para o CoraÃ§Ã£o Ferido",
    versiculo: "Salmo 34:18",
    texto: "Perto estÃ¡ o Senhor dos que tÃªm o coraÃ§Ã£o quebrantado, e salva os contritos de espÃ­rito.",
    reflexao: "Deus nÃ£o estÃ¡ distante quando nosso coraÃ§Ã£o estÃ¡ ferido. Ele se aproxima especialmente dos quebrantados e contritos. Sua presenÃ§a Ã© um bÃ¡lsamo para nossa dor, e Sua salvaÃ§Ã£o Ã© nossa esperanÃ§a. Em meio ao sofrimento, podemos encontrar consolo na certeza de que Ele estÃ¡ prÃ³ximo.",
    oracao: "Senhor, obrigado por estares prÃ³ximo quando meu coraÃ§Ã£o estÃ¡ ferido. Ajuda-me a sentir a Tua presenÃ§a consoladora e a encontrar esperanÃ§a em Ti. Cura minhas feridas e restaura minha alegria. AmÃ©m.",
    data: new Date(Date.now() - 1382400000).toISOString().split('T')[0],
    autor: "MinistÃ©rio de ConsolaÃ§Ã£o",
    categoria: "Palavras de EsperanÃ§a",
    tags: ["consolo", "cura", "presenÃ§a"]
  },
  {
    id: 18,
    titulo: "Novos Caminhos, Novas Possibilidades",
    versiculo: "IsaÃ­as 43:19",
    texto: "Eis que farei uma coisa nova, agora sairÃ¡ Ã  luz; porventura nÃ£o a percebeis? Eis que porei um caminho no deserto, e rios no ermo.",
    reflexao: "Deus estÃ¡ sempre fazendo coisas novas em nossa vida. Mesmo quando parece que estamos no deserto, Ele pode abrir caminhos onde nÃ£o existiam e fazer brotar rios em lugares secos. Sua criatividade e poder nÃ£o tÃªm limites, e Ele pode transformar qualquer situaÃ§Ã£o em uma nova possibilidade.",
    oracao: "Senhor, abre meus olhos para ver as coisas novas que estÃ¡s fazendo. Ajuda-me a perceber os novos caminhos e possibilidades que tens para minha vida. Que eu possa confiar em Ti mesmo quando estou no deserto. AmÃ©m.",
    data: new Date(Date.now() - 1468800000).toISOString().split('T')[0],
    autor: "MinistÃ©rio de ConsolaÃ§Ã£o",
    categoria: "Palavras de EsperanÃ§a",
    tags: ["novos caminhos", "possibilidades", "renovaÃ§Ã£o"]
  }
];

// FunÃ§Ã£o para obter o estudo do dia
export const getEstudoDoDia = (): Promise<Estudo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hoje = new Date().toISOString().split('T')[0];
      const estudo = estudosDatabase.find(e => e.data === hoje) || estudosDatabase[0];
      resolve(estudo);
    }, 500);
  });
};

// FunÃ§Ã£o para obter todos os estudos
export const getAllEstudos = (): Promise<Estudo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(estudosDatabase.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    }, 300);
  });
};

// FunÃ§Ã£o para obter estudos por categoria
export const getEstudosPorCategoria = (categoria: string): Promise<Estudo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estudos = estudosDatabase.filter(e => e.categoria === categoria);
      resolve(estudos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    }, 300);
  });
};

// FunÃ§Ã£o para adicionar novo estudo (simulaÃ§Ã£o)
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

// FunÃ§Ã£o para obter categorias disponÃ­veis
export const getCategorias = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categorias = Array.from(new Set(estudosDatabase.map(e => e.categoria).filter(Boolean) as string[]));
      resolve(categorias);
    }, 200);
  });
};

// FunÃ§Ã£o para obter estudos por data
export const getEstudoPorData = (data: string): Promise<Estudo | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estudo = estudosDatabase.find(e => e.data === data) || null;
      resolve(estudo);
    }, 300);
  });
};
