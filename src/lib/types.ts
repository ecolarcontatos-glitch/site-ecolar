export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  imagem: string;
  descricao: string;
}

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  categoria_id: string[];
  descricao_curta: string;
  descricao_completa: string;
  imagens: string[];
  preco_fabrica: number;
  preco_pronta_entrega?: number;
  pronta_entrega_disponivel: boolean;
  estoque_pronta_entrega?: number;
  lead_time_fabrica: string;
  destaque: boolean;
  observacoes_logistica?: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  texto: string;
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