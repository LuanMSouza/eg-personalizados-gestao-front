// @ts-ignore
import './ultimasVendas.css'
import { useEffect, useState } from 'react';
import { api } from '../../axios';
import Swal from 'sweetalert2';
import type { Venda } from '../../types';
import { Truck, CircleUser, Target } from 'lucide-react';


export default function UltimasVendas() {

    const [vendas, setVendas] = useState<Venda[]>([])

    const pegarVendas = async () => {
        try {
            const res = await api.get('/vendas')
            setVendas(res.data.data)

            console.log(res.data.data);


        } catch (error) {
            Swal.fire('Opa...', 'ocorreu um erro!!', 'error')
        }

    }

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    useEffect(() => {
        pegarVendas()
    }, [])

    const alterarPagamento = (id: number, pagoAtual?: boolean) => {
        const novoStatusPago = !pagoAtual;

        Swal.fire({
            title: 'Tem certeza?',
            text: `Deseja alterar a situação desse pedido para ${novoStatusPago ? 'Pago' : 'Pendente'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, alterar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/vendas/${id}`, { pago: novoStatusPago });

                    setVendas((prev) =>
                        prev.map((v) =>
                            v.id === id ? { ...v, pago: novoStatusPago } : v
                        )
                    );

                    Swal.fire('Sucesso!', 'Status de pagamento atualizado.', 'success');
                } catch (error) {
                    console.error(error);
                    Swal.fire('Erro', 'Não foi possível alterar o pagamento.', 'error');
                }
            }
        });
    };

    const alterarStatus = (id: number, statusAtual?: string) => {
        Swal.fire({
            title: 'Atualizar Status',
            text: 'Selecione o novo status do pedido:',
            icon: 'info',
            input: 'select',
            inputOptions: {
                'pendente': 'Pendente',
                'producao': 'Em Produção',
                'finalizado': 'Finalizado'
            },
            inputValue: statusAtual,
            showCancelButton: true,
            confirmButtonText: 'Atualizar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa selecionar um status!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const novoStatus = result.value;

                    await api.put(`/vendas/${id}`, { status: novoStatus });

                    setVendas((prev) =>
                        prev.map((v) =>
                            v.id === id ? { ...v, status: novoStatus } : v
                        )
                    );

                    Swal.fire('Sucesso!', `Pedido agora está em: ${novoStatus}`, 'success');
                } catch (error) {
                    console.error(error);
                    Swal.fire('Erro', 'Não foi possível atualizar o status.', 'error');
                }
            }
        });
    };

    const gerarPrint = async (v: any) => {
        try {
            const res = await api.post('/vendas/gerarArquivo', v);
            const base64Data = res.data.image;

            const link = document.createElement('a');

            const nomeArquivo = `${v.orcamento ? 'orcamento' : 'venda'}_${v.id || 'novo'}.png`;

            link.href = base64Data;
            link.download = nomeArquivo;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire('Sucesso!', 'Imagem baixada com sucesso.', 'success');

        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível gerar a imagem para download.', 'error');
        }
    }


    return <div className='ultimasVendas'>

        <h2>Ultimas vendas</h2>

        <div className="tabelaUltimasVendas">

            {vendas.map((v) => {

                if (v.orcamento) return

                return <div key={v.id} className='linha' style={{ opacity: v.status === 'finalizado' && v.pago ? '.5' : '1' }}>
                    <p style={{ cursor: 'pointer' }} onClick={() => gerarPrint(v)} className='id'>{v.id}</p>
                    <p className='cliente'>{v.cliente}</p>
                    <p onClick={() => alterarStatus(v.id, v.status)} style={{ cursor: 'pointer' }} className={v.status}>{v.status === 'producao' ? 'produção' : v.status}</p>
                    <p onClick={() => alterarPagamento(v.id, v.pago)} style={{ cursor: 'pointer' }} className={v.pago ? 'pago' : 'em-aberto'}>
                        {v.pago ? 'pago' : 'em aberto'}
                    </p>
                    <p className='total'>{formatarValor(v.valor_total)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyItems: 'center' }}>
                        {v.endereco ? <Truck size={20} color='red' /> : null}
                        {v.contato ? <CircleUser size={20} color='green' /> : null}
                        {v.obs ? <Target size={20} color='blue' /> : null}
                    </div>
                </div>
            })}

        </div>

        <h2>Ultimos Orçamentos</h2>

        <div className="tabelaUltimosOrcamentos">

            {vendas.map((v) => {

                if (!v.orcamento) return

                return <div key={v.id} className='linha' style={{ opacity: v.status === 'finalizado' && v.pago ? '.5' : '1' }}>
                    <p style={{ cursor: 'pointer' }} onClick={() => gerarPrint(v)} className='id'>{v.id}</p>
                    <p className='cliente'>{v.cliente}</p>
                    <p className='total'>{formatarValor(v.valor_total)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyItems: 'center' }}>
                        {v.endereco ? <Truck size={20} color='red' /> : null}
                        {v.contato ? <CircleUser size={20} color='green' /> : null}
                        {v.obs ? <Target size={20} color='blue' /> : null}
                    </div>
                </div>
            })}

        </div>

    </div >
}