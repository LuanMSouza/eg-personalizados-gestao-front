import './hero.css'
import Button from '../../componentes/button/button'

import CadastrarProduto from '../../modais/cadastrarProduto/cadastrarProduto'
import ListarProdutos from '../../modais/listaDeProdutos/listaDeProdutos'


import { useEffect, useState } from 'react'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import type { Produto } from '../../types'

export default function Hero() {

    const [modalCadastrarProduto, setModalCadastrarProduto] = useState(false)
    const [modalListarProdutos, setModalListarProdutos] = useState(false)

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [vendas, setVendas] = useState([])

    const pegarProdutos = async () => {
        try {
            const res = await api.get('/produtos')
            setProdutos((prev) => [...prev, ...res.data.data])

        } catch (error) {
            Swal.fire('Opa...', 'ocorreu um erro!!', 'error')
        }
    }

    useEffect(() => {
        pegarProdutos()
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
                <Button text='Gerenciar Imagens' tipo='claro' />
                <Button text='Gerar orçamento' tipo='escuro' />
                <Button text='Gerar venda' tipo='claro' />
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

        </section>
    )
}