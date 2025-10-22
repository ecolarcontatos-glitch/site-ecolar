import { Categoria, Produto, Depoimento, Inspiracao, Post, Config } from './types';

export const config: Config = {
  whatsapp: '5511999999999',
  empresa: {
    nome: 'ECOLAR Construção & Decoração',
    email: 'contato@ecolar.com.br',
    endereco: 'Rua das Construções, 123 - Centro, São Paulo - SP',
    horario: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  }
};

export const categorias: Categoria[] = [
  {
    id: '1',
    nome: 'Telhas',
    slug: 'telhas',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    descricao: 'Telhas coloniais, francesas e especiais para todos os tipos de cobertura'
  },
  {
    id: '2',
    nome: 'Tijolos',
    slug: 'tijolos',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    descricao: 'Tijolos estruturais, de vedação e especiais para construção'
  },
  {
    id: '3',
    nome: 'Pisos',
    slug: 'pisos',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    descricao: 'Pisos cerâmicos, porcelanatos e revestimentos especiais'
  },
  {
    id: '4',
    nome: 'Decoração',
    slug: 'decoracao',
    imagem: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    descricao: 'Vasos, jardineiras e elementos decorativos para sua obra'
  }
];

export const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Telha Colonial Cerâmica',
    slug: 'telha-colonial-ceramica',
    categoria_id: ['1'],
    descricao_curta: 'Telha colonial tradicional em cerâmica vermelha',
    descricao_completa: 'Telha colonial em cerâmica de alta qualidade, ideal para coberturas residenciais e comerciais. Resistente às intempéries e com excelente durabilidade.',
    imagens: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 2.10,
    preco_pronta_entrega: 2.80,
    pronta_entrega_disponivel: true,
    estoque_pronta_entrega: 5000,
    lead_time_fabrica: '3-7 dias úteis',
    destaque: true,
    observacoes_logistica: 'Entrega por carrada completa'
  },
  {
    id: '2',
    nome: 'Tijolo Estrutural 14x19x29',
    slug: 'tijolo-estrutural-14x19x29',
    categoria_id: ['2'],
    descricao_curta: 'Tijolo estrutural para alvenaria de vedação',
    descricao_completa: 'Tijolo estrutural de alta resistência, ideal para construções que exigem qualidade e durabilidade. Dimensões padronizadas para facilitar a construção.',
    imagens: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 1.80,
    preco_pronta_entrega: 2.40,
    pronta_entrega_disponivel: false,
    lead_time_fabrica: '5-10 dias úteis',
    destaque: true
  },
  {
    id: '3',
    nome: 'Vaso de Barro Médio',
    slug: 'vaso-barro-medio',
    categoria_id: ['4'],
    descricao_curta: 'Vaso decorativo em barro natural',
    descricao_completa: 'Vaso decorativo em barro natural, perfeito para jardins e áreas externas. Produzido artesanalmente com materiais de primeira qualidade.',
    imagens: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 35.00,
    preco_pronta_entrega: 49.00,
    pronta_entrega_disponivel: true,
    estoque_pronta_entrega: 150,
    lead_time_fabrica: '3-7 dias úteis',
    destaque: true
  },
  {
    id: '4',
    nome: 'Piso Cerâmico 45x45',
    slug: 'piso-ceramico-45x45',
    categoria_id: ['3'],
    descricao_curta: 'Piso cerâmico resistente para áreas internas',
    descricao_completa: 'Piso cerâmico de alta qualidade, ideal para áreas internas residenciais e comerciais. Fácil limpeza e manutenção.',
    imagens: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 28.90,
    preco_pronta_entrega: 35.90,
    pronta_entrega_disponivel: true,
    estoque_pronta_entrega: 800,
    lead_time_fabrica: '7-14 dias úteis',
    destaque: false
  },
  {
    id: '5',
    nome: 'Telha Francesa Esmaltada',
    slug: 'telha-francesa-esmaltada',
    categoria_id: ['1'],
    descricao_curta: 'Telha francesa com acabamento esmaltado',
    descricao_completa: 'Telha francesa com acabamento esmaltado, oferece maior durabilidade e resistência. Ideal para projetos que exigem qualidade superior.',
    imagens: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 3.50,
    preco_pronta_entrega: 4.20,
    pronta_entrega_disponivel: true,
    estoque_pronta_entrega: 2000,
    lead_time_fabrica: '5-10 dias úteis',
    destaque: false
  },
  {
    id: '6',
    nome: 'Tijolo Aparente Rústico',
    slug: 'tijolo-aparente-rustico',
    categoria_id: ['2'],
    descricao_curta: 'Tijolo aparente com acabamento rústico',
    descricao_completa: 'Tijolo aparente com textura rústica, perfeito para projetos que valorizam o aspecto natural e tradicional da construção.',
    imagens: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop'
    ],
    preco_fabrica: 2.80,
    preco_pronta_entrega: 3.60,
    pronta_entrega_disponivel: true,
    estoque_pronta_entrega: 1500,
    lead_time_fabrica: '7-12 dias úteis',
    destaque: false
  }
];

export const depoimentos: Depoimento[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    texto: 'Excelente qualidade dos materiais e entrega sempre no prazo. A ECOLAR é nossa parceira há mais de 5 anos.'
  },
  {
    id: '2',
    nome: 'Ana Rodrigues',
    texto: 'Atendimento excepcional e preços justos. Recomendo para todos os colegas arquitetos.'
  },
  {
    id: '3',
    nome: 'João Santos',
    texto: 'A dupla opção de preços (fábrica e pronta entrega) facilita muito o planejamento das obras.'
  }
];

export const inspiracoes: Inspiracao[] = [
  {
    id: '1',
    titulo: 'Casa Colonial Moderna',
    imagem: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    descricao: 'Projeto que combina telhas coloniais com design contemporâneo'
  },
  {
    id: '2',
    titulo: 'Jardim com Vasos de Barro',
    imagem: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    descricao: 'Decoração externa com vasos artesanais'
  },
  {
    id: '3',
    titulo: 'Parede de Tijolo Aparente',
    imagem: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    descricao: 'Ambiente aconchegante com tijolo rústico'
  },
  {
    id: '4',
    titulo: 'Piso Cerâmico Moderno',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    descricao: 'Ambiente clean com piso cerâmico de qualidade'
  },
  {
    id: '5',
    titulo: 'Cobertura com Telhas Francesas',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    descricao: 'Elegância e durabilidade em telhas esmaltadas'
  },
  {
    id: '6',
    titulo: 'Área Externa Decorada',
    imagem: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    descricao: 'Combinação perfeita de materiais naturais'
  }
];

export const posts: Post[] = [
  {
    id: '1',
    titulo: 'Como escolher a telha ideal para sua obra',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    resumo: 'Guia completo para escolher entre telhas coloniais, francesas e especiais.',
    conteudo: 'A escolha da telha é fundamental para o sucesso de qualquer projeto de cobertura. Neste artigo, vamos abordar os principais tipos de telhas disponíveis no mercado e suas características específicas...',
    autor: 'Equipe ECOLAR',
    data: '2024-01-15'
  },
  {
    id: '2',
    titulo: 'Tijolo estrutural vs tijolo de vedação',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    resumo: 'Entenda as diferenças e quando usar cada tipo de tijolo.',
    conteudo: 'A escolha correta do tipo de tijolo é essencial para a segurança e durabilidade da construção. Vamos explicar as principais diferenças entre tijolos estruturais e de vedação...',
    autor: 'Eng. Maria Santos',
    data: '2024-01-10'
  },
  {
    id: '3',
    titulo: 'Tendências em pisos cerâmicos para 2024',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    resumo: 'Descubra as principais tendências em revestimentos cerâmicos.',
    conteudo: 'O mercado de pisos cerâmicos está em constante evolução. Confira as principais tendências para 2024 e como incorporá-las em seus projetos...',
    autor: 'Arq. João Silva',
    data: '2024-01-05'
  }
];