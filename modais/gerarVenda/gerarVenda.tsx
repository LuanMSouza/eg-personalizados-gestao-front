// @ts-ignore
import './gerarVenda.css'
import { Produto } from "../../types"
import { useState } from 'react'
import Swal from 'sweetalert2'
import { api } from '../../axios'

type GerarVendaProps = {
    sair: () => void
    produtos: Produto[]
}

export default function GerarVenda({ sair, produtos }: GerarVendaProps) {

    // Dados clientes
    const [nome, setNome] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [endereco, setEndereco] = useState('')
    const [entrega, setEntrega] = useState(false)
    const [estaPago, setEstaPago] = useState(false)

    // Produtos
    const [produtoEmCadastro, setProdutoEmCadastro] = useState<string | number>('')
    const [quantidade, setQuantidade] = useState<number | string>('')
    const [valorUnt, setValorUnt] = useState<number | string>('')

    const [produtosAdicionados, setProdutosAdicionados] = useState<any[]>([])

    // Dados adcionais
    const totalItens = produtosAdicionados.reduce((acc, p) => acc + p.valorTotal, 0)
    const [desconto, setDesconto] = useState(0)
    const [txEntrega, setTxEntrega] = useState(0)
    const [observacao, setObservacao] = useState('')

    const adicionarProduto = () => {
        if (!produtoEmCadastro || !quantidade || !valorUnt) {
            Swal.fire('Opa...', 'Insira todos os campos antes de adicionar', 'warning')
            return
        }

        const produto = {
            nome: produtoEmCadastro,
            quantidade: quantidade,
            valor_unitario: valorUnt,
            valorTotal: Number(valorUnt) * Number(quantidade),
        }

        setProdutosAdicionados((prev) => [...prev, produto])

        setProdutoEmCadastro('')
        setQuantidade('')
        setValorUnt('')
    }

    const removerProduto = (nome: string) => {
        const novosProdutos = produtosAdicionados.filter((p) => p.nome !== nome)
        setProdutosAdicionados(novosProdutos)
    }

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    const enviar = async () => {

        if (!nome || produtosAdicionados.length == 0 || entrega && !endereco) {
            Swal.fire('Opa...', 'Estão faltando informações importantes!!', 'warning')
            return
        }

        const dadosParaOBack = {
            nome,
            whatsapp,
            itens: produtosAdicionados,
            total: totalItens,
            pago: estaPago,
            txEntrega,
            descontoValor: (totalItens / 100) * desconto,
            descontoPorcento: desconto,
            totalFinal: totalItens - ((totalItens / 100) * desconto) + txEntrega,
            obs: observacao,
            endereco
        }

        const res = await api.post('/gerar/venda', dadosParaOBack)

        const base64Image = res.data.image; // A string que você viu no log

        const link = document.createElement('a');

        link.href = base64Image;
        link.download = `orcamento_${Date.now()}.png`; // Nome que terá o arquivo

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    return <div className="Cortina" onClick={sair}>

        <div className="Container" onClick={(e) => e.stopPropagation()}>
            <button onClick={sair} className="sair">X</button>
            <h3 className="TituloModal">Gerar Venda!!</h3>

            <div className="orcamentoContainer">

                <h4>Dados dos clientes</h4>
                <div className='tabela'>
                    <label>Nome do cliente *
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </label>

                    <label>Whatsapp
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </label>

                    <label>
                        Entrega?
                        <div className='entrega'>
                            {entrega && (
                                <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            )}

                            <input
                                type="checkbox"
                                checked={entrega}
                                onChange={(e) => setEntrega(e.target.checked)}
                            />
                        </div>
                    </label>

                    <label>Está pago?
                        <div className='entrega'>

                            <input
                                type="checkbox"
                                checked={estaPago}
                                onChange={(e) => setEstaPago(e.target.checked)}
                            />
                        </div>
                    </label>

                </div>

                <br />

                <h4>Adicionar itens</h4>
                <div className="tabela">
                    <label>Produtos
                        <select onChange={(e) => setProdutoEmCadastro(e.target.value)} value={produtoEmCadastro}>
                            <option disabled value="">Selecione um produto...</option>

                            {produtos.map((p) => {
                                return <option key={p.id} value={p.nome}>
                                    {p.nome}
                                </option>

                            })}
                        </select>

                    </label>

                    <div className='qvt'>

                        <label>Quantidade
                            <input value={quantidade ? quantidade : ''} type="number" onChange={(e) => setQuantidade(e.target.value)} />
                        </label>
                        <label>Valor-unt
                            <input type="number" value={valorUnt ? valorUnt : ''} onChange={(e) => setValorUnt(e.target.value)} />
                        </label>

                    </div>

                    <button onClick={adicionarProduto} className='adc-produto'>Adicionar Produto!!</button>

                    {/* Mostrando produtos */}
                    <div className='ProdutoExibir'>
                        {produtosAdicionados.length > 0 ?
                            produtosAdicionados.map((p) => {

                                return <div className='produto-adicionado'>
                                    <p>{p.nome}</p>
                                    <p>{Number(p.quantidade)} und</p>
                                    <p>X</p>
                                    <p>{formatarValor(p.valor_unitario)}</p>
                                    <p>=</p>
                                    <p>{formatarValor(p.valorTotal)}</p>
                                    <button onClick={() => removerProduto(p.nome)} className='btn-excluir'>X</button>
                                </div>
                            })
                            : null
                        }
                    </div>

                </div>

                <br />

                <h4>Dados adicionais</h4>
                <div className='tabela'>
                    <div className='Dados'>
                        <label>Total dos itens
                            <input type="text" disabled value={formatarValor(Number(totalItens))} />
                        </label>

                        <label>Desconto (%)
                            <input type="number" value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} />
                        </label>
                    </div>

                    <div className='Dados'>
                        <label>Taxa de entrega
                            <input type="number" disabled={!entrega} value={txEntrega} onChange={(e) => setTxEntrega(Number(e.target.value))} />
                        </label>

                        <label>Total
                            <input type="text" value={formatarValor(totalItens - ((totalItens / 100) * desconto) + txEntrega)} />
                        </label>
                    </div>

                    <label id='obs'>Observação
                        <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)}>

                        </textarea>
                    </label>


                </div>

                <button id='gerar' onClick={enviar}>
                    Gerar venda!!
                </button>

            </div>
        </div>

    </div>
}