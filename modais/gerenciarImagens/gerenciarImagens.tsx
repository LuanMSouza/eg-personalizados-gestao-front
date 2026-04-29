// @ts-ignore
import { useState } from 'react'
import type { Produto, Tema } from '../../types'
// @ts-ignore
import './gerenciarImagens.css'
import { api } from '../../axios'
import Swal from 'sweetalert2'

type gerenciarImagensProps = {
    sair: () => void
    temas: Tema[]
    produtos: Produto[]
}


export default function GerenciarImagens({ sair, produtos, temas }: gerenciarImagensProps) {

    const [produto, setProduto] = useState('')
    const [tema, setTema] = useState('')
    const [imagem, setImagem] = useState<File | null>(null);

    const uparImagem = async () => {
        try {
            const formData = new FormData();

            // Adiciona os campos de texto
            formData.append('produto_id', String(produto));
            formData.append('tema_id', String(tema));

            // Adiciona o arquivo (o estado 'imagem' que veio do input file)
            if (imagem) {
                formData.append('imagem', imagem);
            }

            const res = await api.post('/imagens/uppload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire('Sucesso!', 'Imagem e dados salvos.', 'success');
            setProduto('')
            setTema('')
            setImagem(null)


        } catch (error) {
            Swal.fire('Erro', 'Falha no upload', 'error');
        }
    }



    return <div className="Cortina">

        <div className="Container">
            <button onClick={sair} className="sair">X</button>
            <h3 className="TituloModal">Area de gestão das imagens!!!!</h3>

            {/* adicionar Imagem */}
            <div className="adicionarImagem">
                <label>Produto
                    <select value={produto} onChange={(e) => setProduto(e.target.value)}>
                        <option disabled value="">Selecione um produto...</option>

                        {produtos.map((p) => {

                            return <option value={p.id} key={p.id}>
                                {p.nome}
                            </option>

                        })}

                    </select>
                </label>

                <label>Tema
                    <select value={tema} onChange={(e) => setTema(e.target.value)}>
                        <option value="">Selecione um tema...</option>

                        {temas.map((t) => {

                            return <option value={t.id} key={t.id}>
                                {t.nome}
                            </option>

                        })}

                    </select>
                </label>

                <label>
                    Imagem!!
                    <input
                        // Remova o value={imagem}
                        onChange={(e) => {
                            const arquivo = e.target.files?.[0];
                            if (arquivo) {
                                setImagem(arquivo);
                            }
                        }}
                        type="file"
                        accept="image/*" // Dica: filtra para aceitar apenas imagens
                    />
                </label>

                <button onClick={uparImagem}>Enviar imagem</button>

            </div>


        </div>
    </div>
}