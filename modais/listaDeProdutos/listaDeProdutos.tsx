// @ts-ignorez
import './listaDeProdutos.css'
import { useState } from "react"
import type { Produto } from "../../types"
import EditarProduto from '../editarProduto/editarProduto'

type ListaProdProps = {
    sair: () => void
    produtos: Produto[]
    atualizarLista: (p: Produto) => void
}

export default function ListaDeProdutos({ sair, produtos, atualizarLista }: ListaProdProps) {

    const [modalAlterarProduto, setModalAlterarProduto] = useState(false)
    const [produtoSelect, setProdutoSelect] = useState<Produto | null>(null)

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    const [filtro, setFiltro] = useState('')

    const produtosFiltrados = produtos.filter((p) => {
        return p.nome.toLowerCase().includes(filtro.toLowerCase())
    })

    return <div className="Cortina" onClick={sair}>

        <div className="Container" onClick={(e) => e.stopPropagation()}>
            <button onClick={sair} className="sair">X</button>
            <h3 className="TituloModal">Listagem de produtos</h3>

            {/* Filtro */}
            <label className="filtro">Filtre por nome
                <input
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    type="text" />
            </label>

            {/* Tabela */}
            <div className="tabelaLista">

                {produtosFiltrados.length === 0 ? (
                    <p className="vazio">Nenhum produto encontrado...</p>
                ) : (
                    produtosFiltrados.map((p) => (
                        <div className="linha" key={p.id} onClick={() => {
                            setProdutoSelect(p)
                            setModalAlterarProduto(true)
                        }}>
                            <p>{p.id}</p>
                            <p>{p.nome}</p>
                            <p>{formatarValor(p.preco_venda)}</p>
                        </div>
                    ))
                )}


            </div>


        </div>

        {modalAlterarProduto &&
            produtoSelect &&
            <EditarProduto
                sair={() => {
                    setModalAlterarProduto(false)
                    setProdutoSelect(null)
                }}
                produtoSelecionado={produtoSelect}
                atualizarLista={(p: Produto) => atualizarLista(p)}
            />}
    </div>
}