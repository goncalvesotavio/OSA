import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BarraCarrinho from '../components/BarraCarrinho';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { buscarUniformesPorIds } from '../components/fetchUniformes';
import { useIdleTimer } from '../hooks/useIdleTimer';
import InactivityModal from '../components/InactivityModal';

const rotasSemCarrinho = [
    '/',
    '/descanso',
    '/carrinho',
    '/informacoes',
    '/confirmacao-compra',
    '/termos-de-uso',
    '/forma-pagamento',
    '/pagamento-pix',
    '/pagamento-cartao',
    '/pagamento-dinheiro',
    '/pagamento-cartao-credito',
    '/pagamento-cartao-debito'
];

export default function Layout() {
    const { isIdle, stayActive, countdown } = useIdleTimer({
        mainTimeout: 300000, // 5 minutos
        modalTimeout: 60000, // 1 minuto
        redirectTo: '/descanso'
    });

    const { carrinho } = useContext(CarrinhoContext);
    const location = useLocation();
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function carregarProdutos() {
            const ids = [...new Set(carrinho.uniformes.map(item => item.id_uniforme))];
            if (ids.length > 0) {
                const detalhes = await buscarUniformesPorIds(ids);
                setProdutos(detalhes);
            } else {
                setProdutos([]);
            }
        }
        carregarProdutos();
    }, [JSON.stringify(carrinho.uniformes)]);

    const mostrarBarra = !rotasSemCarrinho.includes(location.pathname) && (carrinho.uniformes.length > 0 || carrinho.armarios.length > 0);

    useEffect(() => {
        if (mostrarBarra) {
            document.body.classList.add('cart-visible');
        } else {
            document.body.classList.remove('cart-visible');
        }
        return () => {
            document.body.classList.remove('cart-visible');
        };
    }, [mostrarBarra]);

    return (
        <>
            <InactivityModal isOpen={isIdle} onStayActive={stayActive} countdown={countdown} />
            <Outlet context={mostrarBarra} />
            {mostrarBarra && <BarraCarrinho produtosUniformes={produtos} />}
        </>
    );
}
