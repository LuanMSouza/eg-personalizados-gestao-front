// @ts-ignore
import './hero.css'
import Button from '../../componentes/button/button'

import CadastrarProduto from '../../modais/cadastrarProduto/cadastrarProduto'
import ListarProdutos from '../../modais/listaDeProdutos/listaDeProdutos'


import { useEffect, useState } from 'react'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import { Tema, type Produto } from '../../types'
import GerarOrcamento from '../../modais/gerarOrcamento/gerarOrcamento'
import GerarVenda from '../../modais/gerarVenda/gerarVenda'
import GerenciarImagens from '../../modais/gerenciarImagens/gerenciarImagens'

export default function Hero() {

    const [modalCadastrarProduto, setModalCadastrarProduto] = useState(false)
    const [modalListarProdutos, setModalListarProdutos] = useState(false)
    const [modalGerarOrcamento, setModalGerarOrcamento] = useState(false)
    const [modalGerarVenda, setModalGerarVenda] = useState(false)
    const [modalGerenciarImagens, setModalGerenciarImagens] = useState(false)

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [temas, setTemas] = useState<Tema[]>([]);

    const pegarProdutos = async () => {
        try {
            const res = await api.get('/produtos')
            setProdutos((prev) => [...prev, ...res.data.data])

        } catch (error) {
            Swal.fire('Opa...', 'ocorreu um erro!!', 'error')
        }
    }

    const pegarTemas = async () => {
        try {
            const res = await api.get('/produtos/temas')
            setTemas((prev) => [...prev, ...res.data.data])

        } catch (error) {
            Swal.fire('Opa...', 'ocorreu um erro!!', 'error')
        }
    }

    useEffect(() => {
        pegarProdutos()
        pegarTemas()
    }, [])

    const handleAtualizarLista = (produtoEditado: Produto) => {
        setProdutos((prev) =>
            prev.map((p) => (p.id === produtoEditado.id ? produtoEditado : p))
        )
    }

    return (
        <section className='hero'>
            <h1>Bem vinda Érika!!</h1>
            <h2>O que faremos agora?...</h2>

            <div className='btns'>
                <Button text='Gerenciar Imagens' tipo='claro' onClick={() => setModalGerenciarImagens(true)} />
                <Button text='Gerar orçamento' tipo='escuro' onClick={() => setModalGerarOrcamento(true)} />
                <Button text='Gerar venda' tipo='claro' onClick={() => setModalGerarVenda(true)} />
                <Button text='Cadastrar produtos' tipo='escuro' onClick={() => setModalCadastrarProduto(true)} />
                <Button text='Lista de produtos' tipo='claro' onClick={() => setModalListarProdutos(true)} />
            </div>

            {modalCadastrarProduto &&
                <CadastrarProduto
                    atualizarProduto={(p) => setProdutos((prev) => [...prev, p])}
                    sair={() => setModalCadastrarProduto(false)} />}

            {modalListarProdutos &&
                <ListarProdutos
                    sair={() => setModalListarProdutos(false)}
                    atualizarLista={(p) => handleAtualizarLista(p)}
                    produtos={produtos} />}

            {modalGerarOrcamento &&
                <GerarOrcamento
                    sair={() => setModalGerarOrcamento(false)}
                    produtos={produtos} />}

            {modalGerarVenda &&
                <GerarVenda
                    sair={() => setModalGerarVenda(false)}
                    produtos={produtos} />}

            {modalGerenciarImagens &&
                <GerenciarImagens
                    temas={temas}
                    produtos={produtos}
                    sair={() => setModalGerenciarImagens(false)} />}

        </section>
    )
}