import { useState } from "react"
import { Produto } from "../../types"
import { NumericFormat } from 'react-number-format';
import { api } from '../../axios'
import Swal from 'sweetalert2'

type EditarProdutoProps = {
    sair: () => void
    produtoSelecionado: Produto
    atualizarLista: (p: Produto) => void
}

export default function EditarProduto({ sair, produtoSelecionado, atualizarLista }: EditarProdutoProps) {

    const [produto, setProduto] = useState<Produto>({
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        preco_custo: produtoSelecionado.preco_custo,
        preco_venda: produtoSelecionado.preco_venda
    })

    const alterar = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            const alterarProBack = {
                id: produtoSelecionado.id,
                nome: produtoSelecionado.nome,
                valor: produtoSelecionado.preco_venda,
                custo: produtoSelecionado.preco_custo
            }

            const res = await api.put(`/produtos`, alterarProBack)

            if (res.data) {
                atualizarLista(res.data.data)

                Swal.fire('Sucesso!', 'Produto atualizado!', 'success')
                sair()
            }
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Erro ao alterar produto'
            Swal.fire('Erro', msg, 'error')
        }
    }

    return <div className="Cortina" onClick={sair}>
        <div className="Container" onClick={(e) => e.stopPropagation()}>
            <button onClick={sair} className="sair">X</button>
            <h3 className="TituloModal">Alterar o produto ''{produtoSelecionado.nome}''</h3>

            <form onSubmit={alterar} className="FormModal">

                <label>Nome
                    <input
                        value={produto.nome}
                        onChange={(e) => setProduto((prev) => ({
                            ...prev,
                            nome: e.target.value
                        }))}
                        type="text" />
                </label>

                <label>Custo
                    <NumericFormat
                        value={produto.preco_custo}
                        onValueChange={(values) => setProduto((prev) => ({
                            ...prev,
                            preco_custo: values.floatValue ?? 0
                        }))}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                    />
                </label>

                <label>Venda
                    <NumericFormat
                        value={produto.preco_venda}
                        onValueChange={(values) => setProduto((prev) => ({
                            ...prev,
                            preco_venda: values.floatValue ?? 0
                        }))}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                    />
                </label>

                <button type="submit">Alterar!!</button>
            </form>


        </div>
    </div>
}