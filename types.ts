export type Produto = {
    id?: string;
    nome: string;
    preco_venda: number;
    preco_custo: number;
}


export type Venda = {
    id: number;
    status?: string;
    valor_total: number; // Decimal vira number no front
    data_entrega?: string | Date;
    pago?: boolean;
    created_at?: string | Date;
    cliente: string;
    total_itens: number;
    taxa_entrega?: number;
    desconto_valor?: number;
    desconto_porcento?: number;
    contato?: string; // BigInt chega como string para não quebrar o JS
    endereco?: string;
    obs?: string;
    orcamento?: boolean;
    validade?: string | Date;
    venda_itens: Produto[]; // O tipo dos itens da venda
}

export type Tema = {
    id: number
    nome: string
}