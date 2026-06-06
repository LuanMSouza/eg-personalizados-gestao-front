// @ts-ignore
import './hero.css'
import Button from '../../componentes/button/button'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import type { Produto } from '../../types'
import GerarOrcamento from '../../modais/gerarOrcamento/gerarOrcamento'
import GerarVenda from '../../modais/gerarVenda/gerarVenda'
import GerenciarImagens from '../../modais/gerenciarImagens/gerenciarImagens'

export default function Hero() {

    const nav = useNavigate()

    const [modalGerarOrcamento, setModalGerarOrcamento] = useState(false)
    const [modalGerarVenda, setModalGerarVenda] = useState(false)
    const [modalGerenciarImagens, setModalGerenciarImagens] = useState(false)

    const [produtos, setProdutos] = useState<Produto[]>([]);

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

    return (
        <section className='hero'>

            <h1>Bem vinda Érika!!</h1>
            <h2>O que faremos agora?...</h2>

            <div className='btns'>
                <Button text='Gerenciar Imagens' tipo='claro' onClick={() => setModalGerenciarImagens(true)} />
                <Button text='Gerar orçamento' tipo='escuro' onClick={() => setModalGerarOrcamento(true)} />
                <Button text='Gerar venda' tipo='claro' onClick={() => setModalGerarVenda(true)} />
                <Button text='Produtos' tipo='escuro' onClick={() => nav('/produtos')} />
            </div>

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
                    produtos={produtos}
                    sair={() => setModalGerenciarImagens(false)} />}

        </section>
    )
}