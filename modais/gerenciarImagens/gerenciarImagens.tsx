// @ts-ignore
import { useEffect, useState } from 'react'
import type { Imagens, Produto } from '../../types'
// @ts-ignore
import './gerenciarImagens.css'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import Loading from '../../componentes/loading/loading'

type gerenciarImagensProps = {
    sair: () => void
    produtos: Produto[]
}


export default function GerenciarImagens({ sair, produtos }: gerenciarImagensProps) {

    const [loading, setLoading] = useState(false)

    const [produto, setProduto] = useState('')
    const [imagem, setImagem] = useState<File | null>(null);

    const [imagensNoBanco, setImagensNoBanco] = useState<Imagens[]>([])

    const pegarImagens = async () => {
        const res = await api.get('/imagens')
        setImagensNoBanco(res.data)
    }

    const excluirImagem = async (i: Imagens) => {

        Swal.fire({
            title: 'Tem certeza?',
            text: `Deseja excluir a imagem do produto ${i.produtos?.nome}? Essa ação não pode ser desfeita!!`,
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Excluir!!',
            denyButtonText: 'Cancelar!',
            confirmButtonColor: '#d33',
            denyButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await api.delete(`/imagens/${i.id}`)
                if (res.data.ok) {
                    setImagensNoBanco(prev => prev.filter(item => item.id !== i.id));
                }
                Swal.fire('Deletado!', '', 'success');
            } else if (result.isDenied) {
                Swal.fire('Cancelado', 'A imagem está a salva :)', 'info');
            }
        });

    }

    useEffect(() => {
        pegarImagens()
    }, [])

    const uparImagem = async () => {

        setLoading(true)

        try {
            const formData = new FormData();

            formData.append('produto_id', String(produto));

            if (imagem) {
                formData.append('imagem', imagem);
            }

            const res = await api.post('/imagens/uppload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.data) {
                setImagensNoBanco(prev => [...prev, res.data.data])
            }

            Swal.fire('Sucesso!', 'Imagem salva.', 'success');
            setProduto('')
            setImagem(null)

        } catch (error) {
            Swal.fire('Erro', 'Falha no upload', 'error');
        } finally {
            setLoading(false)
        }
    }

    return <div className="Cortina">

        <Loading loading={loading} />

        <div className="Container">
            <button onClick={sair} className="sair">X</button>

            <div style={{ overflow: 'auto', maxHeight: '70vh' }}>

                <h3 className="TituloModal">Area de gestão das imagens!!!!</h3>

                {/* adicionar Imagem */}
                <div className="adicionarImagem">
                    <label>Produto
                        <select value={produto} onChange={(e) => setProduto(e.target.value)}>
                            <option disabled value="">Selecione um produto...</option>

                            {produtos.map((p) => (
                                <option value={p.id} key={p.id}>
                                    {p.nome}
                                </option>
                            ))}

                        </select>
                    </label>

                    <label className='imagem'>
                        Imagem!!
                        <input
                            onChange={(e) => {
                                const arquivo = e.target.files?.[0];
                                if (arquivo) {
                                    setImagem(arquivo);
                                }
                            }}
                            type="file"
                            accept="image/*"
                        />
                    </label>

                    <button id='uparImg' onClick={uparImagem}>Enviar imagem</button>

                </div>

                <div className='divisor'>
                    <div />
                    <p>Ou então...</p>
                </div>

                {/* Gerenciar imagens */}
                <div className='imagensNoBanco'>

                    {imagensNoBanco?.map((i) => (
                        <div key={i.id} className="card" onClick={() => excluirImagem(i)}>
                            <img src={i.img_url} alt={i.produtos?.nome} />
                            <p>P: {i.produtos?.nome}</p>
                        </div>
                    ))}

                </div>
            </div>


        </div>
    </div >
}
