import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CartaoCredito.module.css';
import logoOsa from '/osaCompleto.png';
import iconeCartao from '../assets/cartao.png';
import { finalizarCompra } from '../components/finalizarCompra';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { ClienteContext } from '../context/clienteContext.jsx';
import { AlertContext } from '../context/AlertContext';
import { fetchUniformes, buscarDetalhesDoCarrinho } from '../components/fetchUniformes.jsx';

export default function CartaoCredito() {
    const { carrinho, limparCarrinho } = useContext(CarrinhoContext);
    const { cliente } = useContext(ClienteContext);
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();
    const [uniformes, setUniformes] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/descanso');
        }, 600000);

        async function carregarDados() {
            const produtos = await fetchUniformes();
            setUniformes(produtos);

            const detalhes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
            const valorTotalUniformes = detalhes.reduce((acc, item) => acc + (item.Preço * item.quantidade), 0);
            const valorTotalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 90), 0);
            setTotal(valorTotalUniformes + valorTotalArmarios);
        }
        
        if (carrinho.uniformes.length > 0 || carrinho.armarios.length > 0) {
            carregarDados();
        }

        return () => clearTimeout(timer);
    }, [navigate, carrinho]);

    const ok = async () => {
        setIsLoading(true);
        try {
            const pagamento = {
                formaPagamento: 'Crédito',
                pago: 'false'
            };
            await finalizarCompra(pagamento, cliente, carrinho, uniformes, limparCarrinho);
            showAlert("Compra finalizada com sucesso!");
            navigate('/descanso');
        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            showAlert("Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.paginaCartaoCredito}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingText}>AGUARDE...</div>
                </div>
            )}
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <main className={styles.conteudo}>
                <img src={iconeCartao} alt="Cartão" className={styles.iconeCabecalho} />
                <h1 className={styles.titulo}>Cartão de Crédito selecionado.</h1>
                <div className={styles.totalContainer}>
                    <p className={styles.totalValor}>R$ {total.toFixed(2)}</p>
                </div>
                <p className={styles.instrucao}>
                    Insira ou aproxime o<br />cartão na máquina
                </p>
            </main>
            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
            <button onClick={ok} className={styles.botaoOk}>OK</button>
        </div>
    );
}
