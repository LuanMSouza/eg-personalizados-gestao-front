import { useState } from "react"
import { NumericFormat } from 'react-number-format';
import Swal from "sweetalert2";
import { api } from "../../axios";
import type { Produto } from "../../types";

type CadastrarProdutosProps = {
    sair: () => void
    atualizarProduto: (p: Produto) => void;
}

export default function CadastrarProduto({ sair, atualizarProduto }: CadastrarProdutosProps) {

    const [nomeProduto, setNomeProduto] = useState('')
    const [custoProduto, setCustoProduto] = useState<number | undefined>()
    const [valorProduto, setValorProduto] = useState<number | undefined>()

    const cadastrar = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nomeProduto || !custoProduto || !valorProduto) {
            Swal.fire('Opa...', 'Todos os campos são obrigatórios!!', 'warning')
            return
        }

        try {
            const res = await api.post('/produtos', {
                nome: nomeProduto,
                valor: valorProduto,
                custo: custoProduto
            })

            Swal.fire('Boa!', 'Produto cadastrado com sucesso!', 'success')

            atualizarProduto(res.data.data)


            setNomeProduto('')
            setCustoProduto(undefined)
            setValorProduto(undefined)

            sair()

        } catch (error: any) {
            const mensagem = error.response?.data?.error || 'Erro ao salvar produto.'
            Swal.fire('Erro!', mensagem, 'error')
        }
    }

    return (
        <div className="Cortina" onClick={sair}>
            <div className="Container" onClick={(e) => e.stopPropagation()}>
                <button onClick={sair} className="sair">X</button>
                <h3 className="TituloModal">Cadastrar produto</h3>

                <form className="FormModal" onSubmit={cadastrar}>
                    <label>Nome do produto
                        <input
                            value={nomeProduto}
                            onChange={(e) => setNomeProduto(e.target.value)}
                            type="text" />
                    </label>

                    <label>Custo aprox.
                        <NumericFormat
                            value={custoProduto}
                            onValueChange={(values) => setCustoProduto(values.floatValue)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </label>

                    <label>Preço de venda
                        <NumericFormat
                            value={valorProduto}
                            onValueChange={(values) => setValorProduto(values.floatValue)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </label>

                    <button type="submit">Cadastrar!</button>
                </form>
            </div>
        </div>
    )
}