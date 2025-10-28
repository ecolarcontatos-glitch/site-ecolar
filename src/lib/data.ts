import { Categoria, Produto, Depoimento, Inspiracao, Post, Config } from './types';

export const config: Config = {
  whatsapp: '558393661690',
  empresa: {
    nome: 'ECOLAR Construção & Decoração',
    email: 'ecolar.contatos@gmail.com',
    endereco: 'R. Pres. Washington Luís, 592 - Bessa, João Pessoa - PB, 58035-340',
    horario: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  }
};

export const categorias: Categoria[] = [
  {
    id: '1',
    nome: 'Telhas',
    slug: 'telhas',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    descricao: 'Telhas coloniais, francesas e especiais para todos os tipos de cobertura',
    cor: '#C05A2B'
  },
  {
    id: '2',
    nome: 'Tijolos',
    slug: 'tijolos',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    descricao: 'Tijolos estruturais, de vedação e especiais para construção',
    cor: '#7FBA3D'
  },
  {
    id: '3',
    nome: 'Pisos',
    slug: 'pisos',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    descricao: 'Pisos cerâmicos, porcelanatos e revestimentos especiais',
    cor: '#3B82F6'
  },
  {
    id: '4',
    nome: 'Decoração',
    slug: 'decoracao',
    imagem: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    descricao: 'Vasos, jardineiras e elementos decorativos para sua obra',
    cor: '#8B5CF6'
  }
];

export const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Telha Colonial Cerâmica',
    categoria: '1',
    descricao: 'Telha colonial em cerâmica de alta qualidade, ideal para coberturas residenciais e comerciais. Resistente às intempéries e com excelente durabilidade.',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    preco_fabrica: 2.10,
    preco_pronta_entrega: 2.80,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true,
    destaque: true
  },
  {
    id: '2',
    nome: 'Tijolo Estrutural 14x19x29',
    categoria: '2',
    descricao: 'Tijolo estrutural de alta resistência, ideal para construções que exigem qualidade e durabilidade. Dimensões padronizadas para facilitar a construção.',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    preco_fabrica: 1.80,
    preco_pronta_entrega: 2.40,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: false,
    destaque: true
  },
  {
    id: '3',
    nome: 'Vaso de Barro Médio',
    categoria: '4',
    descricao: 'Vaso decorativo em barro natural, perfeito para jardins e áreas externas. Produzido artesanalmente com materiais de primeira qualidade.',
    imagem: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    preco_fabrica: 35.00,
    preco_pronta_entrega: 49.00,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true,
    destaque: true
  },
  {
    id: '4',
    nome: 'Piso Cerâmico 45x45',
    categoria: '3',
    descricao: 'Piso cerâmico de alta qualidade, ideal para áreas internas residenciais e comerciais. Fácil limpeza e manutenção.',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    preco_fabrica: 28.90,
    preco_pronta_entrega: 35.90,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true,
    destaque: false
  },
  {
    id: '5',
    nome: 'Telha Francesa Esmaltada',
    categoria: '1',
    descricao: 'Telha francesa com acabamento esmaltado, oferece maior durabilidade e resistência. Ideal para projetos que exigem qualidade superior.',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    preco_fabrica: 3.50,
    preco_pronta_entrega: 4.20,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true,
    destaque: false
  },
  {
    id: '6',
    nome: 'Tijolo Aparente Rústico',
    categoria: '2',
    descricao: 'Tijolo aparente com textura rústica, perfeito para projetos que valorizam o aspecto natural e tradicional da construção.',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    preco_fabrica: 2.80,
    preco_pronta_entrega: 3.60,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true,
    destaque: false
  }
];

export const depoimentos: Depoimento[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    texto: 'Excelente qualidade dos materiais e entrega sempre no prazo. A ECOLAR é nossa parceira há mais de 5 anos.',
    estrelas: 5,
    foto: ''
  },
  {
    id: '2',
    nome: 'Ana Rodrigues',
    texto: 'Atendimento excepcional e preços justos. Recomendo para todos os colegas arquitetos.',
    estrelas: 5,
    foto: ''
  },
  {
    id: '3',
    nome: 'João Santos',
    texto: 'A dupla opção de preços (fábrica e pronta entrega) facilita muito o planejamento das obras.',
    estrelas: 5,
    foto: ''
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
    conteudo: 'A escolha da telha é fundamental para o sucesso de qualquer projeto de cobertura. Neste artigo, vamos abordar os principais tipos de telhas disponíveis no mercado e suas características específicas.\\n\\nAs telhas coloniais são ideais para projetos que buscam um visual tradicional e aconchegante. Já as telhas francesas oferecem maior resistência e durabilidade, sendo perfeitas para regiões com clima mais severo.\\n\\nPara projetos modernos, as telhas especiais com acabamento esmaltado proporcionam um visual diferenciado e maior proteção contra intempéries.',
    autor: 'Equipe ECOLAR',
    data: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    titulo: 'Tijolo estrutural vs tijolo de vedação',
    imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    resumo: 'Entenda as diferenças e quando usar cada tipo de tijolo.',
    conteudo: 'A escolha correta do tipo de tijolo é essencial para a segurança e durabilidade da construção. Vamos explicar as principais diferenças entre tijolos estruturais e de vedação.\\n\\nOs tijolos estruturais são projetados para suportar cargas e fazer parte da estrutura do edifício. Possuem maior resistência à compressão e são fundamentais em construções de alvenaria estrutural.\\n\\nJá os tijolos de vedação são utilizados para fechamento de vãos e divisórias internas, não tendo função estrutural. São mais leves e econômicos.',
    autor: 'Eng. Maria Santos',
    data: '2024-01-10T14:30:00.000Z'
  },
  {
    id: '3',
    titulo: 'Tendências em pisos cerâmicos para 2024',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    resumo: 'Descubra as principais tendências em revestimentos cerâmicos.',
    conteudo: 'O mercado de pisos cerâmicos está em constante evolução. Confira as principais tendências para 2024 e como incorporá-las em seus projetos.\\n\\nFormatos grandes e retangulares continuam em alta, proporcionando ambientes mais amplos e modernos. As texturas que imitam materiais naturais como madeira e pedra também são muito procuradas.\\n\\nCores neutras e tons terrosos dominam as preferências, criando ambientes aconchegantes e atemporais.',
    autor: 'Arq. João Silva',
    data: '2024-01-05T09:15:00.000Z'
  }
];