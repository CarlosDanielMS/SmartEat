// src/data/quizData.js
// Extraímos os dados estáticos dos seus arquivos PHP para um único local.

export const infoSteps = [
  // Etapa 1 (info-1.php)
  {
    step: 1,
    progress: 10,
    title: 'Adeus, dietas intermináveis!',
    texts: [
      'Nosso método é projetado para ser sustentável a longo prazo, tornando-se a última dieta que você precisará adotar.',
      'Emagreça com simplicidade, gastando pouco $',
    ],
  },
  // Etapa 2 (info-2.php)
  {
    step: 2,
    progress: 20,
    title: 'Por que as dietas da moda sempre vão falhar com você',
    list: [
      { text: 'Muito restritivas, altos índices de sistência', type: 'bad' },
      { text: 'Ignore seu estilo de vida e logística', type: 'bad' },
      { text: 'Refeições caras e complexas', type: 'bad' },
      { text: 'Rastreamento demorado e complicado de alimentos', type: 'bad' },
      { text: 'Apenas resultados temporários', type: 'bad' },
      { text: 'Efeito Sanfona', type: 'bad' },
    ],
    title2: 'Por que o assistente de perda de peso da OmniDiet funciona',
    list2: [
      { text: 'Você come o que ama todos os dias', type: 'good' },
      { text: 'Emagrecimento Econômico $', type: 'good' },
      { text: 'Adapta-se ao seu estilo de vida e horário', type: 'good' },
      { text: 'Você pode alterar, incluir, excluir alimentos', type: 'good' },
      { text: 'Autonomia total, assuma o controle da sua jornada de perda de peso', type: 'good' },
      { text: 'Taxa de Desistência Mínima', type: 'good' },
    ],
  },
  // Etapa 3 (info-3.php)
  {
    step: 3,
    progress: 40, // O PHP pulou de 20 para 40
    title: 'Estamos muito felizes que você compartilhou.',
    texts: [
      'A perda de peso é um objetivo importante, mas a missão do OmniDiet é ajudar as pessoas a ficarem mais saudáveis, seja lá o que isso for para elas.',
    ],
    legal: 'AVISO LEGAL: O site, aplicativo, serviços e produtos da Perfect Body destinam-se a apoiar a saúde geral. Nossos produtos e serviços não se destinam a diagnosticar, tratar, curar ou prevenir qualquer doença. Eles não devem ser substituídos por aconselhamento médico ou intervenção médica. Consulte um profissional de saúde qualificado ao tomar decisões médicas.',
  },
  // Etapa 4 (info-4.php)
  {
    step: 4,
    progress: 50,
    title: '"Se você não arrumar tempo para cuidar de sua saúde um dia terá que arrumar tempo para cuidar de sua doença."',
    title2: 'A recompensa de investir em você:',
    list: [
      { text: 'Aumento na Qualidade de Vida', type: 'good' },
      { text: 'Menos doenças', type: 'good' },
      { text: 'Melhor Cognição', type: 'good' },
      { text: 'Imunidade aumentada', type: 'good' },
      { text: 'Longevidade', type: 'good' },
      { text: 'Melhorar Libido e Vida Sexual', type: 'good' },
    ],
  },
  // Etapa 5 (info-5.php)
  {
    step: 5,
    progress: 60,
    title: 'O impacto das Doenças Crônicas nos EUA:',
    texts: [
      'Uma doença é considerada crônica quando persiste por pelo menos um ano e requer atenção médica contínua ou limita as atividades diárias.',
      'Aproximadamente 47% da população dos EUA, 150 milhões de americanos, sofriam de pelo menos uma doença crônica, em 2014. Quase 30 milhões de americanos vivem com cinco ou mais doenças crônicas.',
      'Estima-se que 84% dos custos com saúde sejam atribuídos ao tratamento de doenças crônicas.',
    ],
  },
  // Etapa 6 (info-6.php)
  {
    step: 6,
    progress: 65,
    title: 'Maiores condições crônicas:',
    list: [
      { text: 'Doenças Cardiovasculares', type: 'neutral' },
      { text: 'Diabetes', type: 'neutral' },
      { text: 'Alzheimer', type: 'neutral' },
      { text: 'Artrite e dor nas costas', type: 'neutral' },
    ],
  },
  // Etapa 7 (info-7.php)
  {
    step: 7,
    progress: 70,
    title: 'OBESIDADE',
    texts: [
      'É apontada como o maior fator de risco individual para doenças crônicas.',
      'Ela é responsável por quase 44% dos custos diretos com cuidados de saúde nos EUA.',
    ],
  },
  // Etapa 8 (info-8.php)
  {
    step: 8,
    progress: 75,
    title: 'Custos Indiretos',
    texts: [
      'Pessoas com doenças crônicas tem suas vidas impactadas de maneiras difíceis de medir objetivamente, mas potencialmente devastadoras. Um estudo feito nos EUA estima que os custos indiretos de algumas doenças superam em muitas vezes o custo direto.',
    ],
    list: [
      { text: 'Trabalho e produtividade', type: 'neutral' },
      { text: 'Educação e cognição', type: 'neutral' },
      { text: 'Melhor Cognição', type: 'neutral' },
      { text: 'Meios de subsistência', type: 'neutral' },
      { text: 'Suas interações sociais', type: 'neutral' },
    ],
  },
  // Etapa 9 (info-9.php)
  {
    step: 9,
    progress: 80,
    title: 'Impacto Social e Financeiro',
    texts: [
      'Obesidade e doenças crônicas tem um impacto direto e significativo na vida social, financeira e um impacto no futuro e nas pessoas ao nosso redor.',
      'Despesas médicas, medicamentos, perda de produtividade, redução da qualidade de vida, isolamento social, redução da autoestim, entre outros.',
    ],
  },
  // Etapa 10 (info-10.php)
  {
    step: 10,
    progress: 85, // O PHP indica 85%
    title: 'Prevenção e Qualidade de Vida',
    texts: [
      'Emagrecer e controlar a obesidade reduz o risco de desenvolver doenças crônicas e melhorar a qualidade de vida.',
      'Emagrecer e controlar a obesidade pode prevenir doenças e salvar vidas.',
      'Emagrecer e controlar a obesidade melhora a saúde e aumenta a longevidade.',
    ],
  },
];