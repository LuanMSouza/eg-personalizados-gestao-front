import '../App.css'
import './produtos.css'
import NavBar from '../../blocos/navbar/navbar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import type { Produto } from '../../types'
import CadastrarProduto from '../../modais/cadastrarProduto/cadastrarProduto'
import EditarProduto from '../../modais/editarProduto/editarProduto'
import Button from '../../componentes/button/button'

export default function Produtos() {
    const nav = useNavigate()

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [filtro, setFiltro] = useState('')
    const [modalCadastrar, setModalCadastrar] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)

    const pegarProdutos = async () => {
        try {
            const res = await api.get('/produtos')
            setProdutos(res.data.data)
        } catch {
            Swal.fire('Opa...', 'Ocorreu um erro ao carregar os produtos!', 'error')
        }
    }

    useEffect(() => {
        pegarProdutos()
    }, [])

    const produtosFiltrados = produtos.filter((p) =>
        p.nome.toLowerCase().includes(filtro.toLowerCase())
    )

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    const handleAtualizarLista = (produtoEditado: Produto) => {
        setProdutos((prev) =>
            prev.map((p) => (p.id === produtoEditado.id ? produtoEditado : p))
        )
    }

    return (
        <>
            <NavBar />

            <main className='pageProdutos'>

                <div className='headerProdutos'>
                    <div className='tituloVoltarProdutos'>
                        <button className='voltarBtn' onClick={() => nav('/dashboard')}>← Voltar</button>
                        <h1>Produtos</h1>
                    </div>
                    <Button text='Cadastrar produto' tipo='escuro' onClick={() => setModalCadastrar(true)} />
                </div>

                <div className='filtroWrap'>
                    <label>Filtre por nome</label>
                    <input
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        type='text'
                        placeholder='Digite o nome do produto...'
                    />
                </div>

                <div className='tabelaProdutosPage'>
                    <div className='cabecalhoProdutos'>
                        <span>ID</span>
                        <span>Nome</span>
                        <span>Preço de venda</span>
                    </div>

                    {produtosFiltrados.length === 0 ? (
                        <p className='vazio'>Nenhum produto encontrado...</p>
                    ) : (
                        produtosFiltrados.map((p) => (
                            <div className='linha' key={p.id} onClick={() => setProdutoSelecionado(p)}>
                                <p>{p.id}</p>
                                <p>{p.nome}</p>
                                <p>{formatarValor(p.preco_venda)}</p>
                            </div>
                        ))
                    )}
                </div>

            </main>

            {modalCadastrar && (
                <CadastrarProduto
                    sair={() => setModalCadastrar(false)}
                    atualizarProduto={(p) => setProdutos((prev) => [...prev, p])}
                />
            )}

            {produtoSelecionado && (
                <EditarProduto
                    sair={() => setProdutoSelecionado(null)}
                    produtoSelecionado={produtoSelecionado}
                    atualizarLista={handleAtualizarLista}
                />
            )}
        </>
    )
}
