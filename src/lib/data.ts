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

// Arrays vazios - dados agora vêm da API
export const categorias: Categoria[] = [];
export const produtos: Produto[] = [];
export const depoimentos: Depoimento[] = [];
export const inspiracoes: Inspiracao[] = [];
export const posts: Post[] = [];