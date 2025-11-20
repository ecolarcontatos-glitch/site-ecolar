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
  preco: number; // Preço base único
  desconto?: number; // Desconto em porcentagem (0-100), opcional
  destaque: boolean;
  unidade?: string;
  disponivel: number | boolean;
}

export interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  estrelas: number;
  foto?: string;
  imagem?: string; // Alias para compatibilidade
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
  descricao: string;        // era conteudo
  resumo: string;
  imagem: string;
  autor: string;
  data_publicacao: string;  // era data
  status: string;           // publicado / rascunho
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