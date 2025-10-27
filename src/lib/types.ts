export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  imagem: string;
  descricao: string;
  cor?: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: string; // ID da categoria
  descricao: string;
  imagem: string;
  preco_fabrica: number;
  preco_pronta_entrega: number;
  disponivel_fabrica: boolean;
  disponivel_pronta_entrega: boolean;
  destaque: boolean;
}

export interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  estrelas: number;
  foto?: string;
}

export interface Inspiracao {
  id: string;
  titulo: string;
  imagem: string;
  descricao: string;
}

export interface Post {
  id: string;
  titulo: string;
  imagem: string;
  resumo: string;
  conteudo: string;
  autor: string;
  data: string;
}

export interface ItemOrcamento {
  produto: Produto;
  modalidade: 'fabrica' | 'pronta_entrega';
  quantidade: number;
  preco_unitario: number;
}

export interface Config {
  whatsapp: string;
  empresa: {
    nome: string;
    email: string;
    endereco: string;
    horario: string;
  };
}