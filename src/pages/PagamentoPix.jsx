import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PagamentoPix.module.css';
import logoOsa from '/osaCompleto.png';
import iconePix from '../assets/pix.png';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { ClienteContext } from '../context/clienteContext';
import { AlertContext } from '../context/AlertContext';
import { buscarDetalhesDoCarrinho, fetchUniformes } from '../components/fetchUniformes';
import { finalizarCompra } from '../components/finalizarCompra';
import { procurarEmail } from '../components/fetchClientes';

const IconeSetaAbaixo = () => (
    <svg className={styles.seta} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

export default function PagamentoPix() {
    const navigate = useNavigate();
    const { carrinho, limparCarrinho } = useContext(CarrinhoContext);
    const { cliente } = useContext(ClienteContext);
    const { showAlert } = useContext(AlertContext);
    const [total, setTotal] = useState(0);
    const [uniformes, setUniformes] = useState([]);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/descanso');
        }, 300000);

        async function carregarDados() {
            const produtos = await fetchUniformes();
            setUniformes(produtos);

            if (carrinho.uniformes.length > 0 || carrinho.armarios.length > 0) {
                const detalhes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
                const valorTotalUniformes = detalhes.reduce((acc, item) => acc + (item.Preço * item.quantidade), 0);
                const valorTotalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 90), 0);
                setTotal(valorTotalUniformes + valorTotalArmarios);
            }

            if (cliente) {
                const data = await procurarEmail(cliente);
                if (data && data.length > 0) {
                    setEmail(data[0].Email);
                }
            }
        }
        carregarDados();

        return () => clearTimeout(timer);
    }, [navigate, carrinho, cliente]);

    const finalizar = async (enviarEmail) => {
        setIsLoading(true);
        try {
            if (enviarEmail) {
                await handleEnviarComprovante();
            }

            const pagamento = {
                formaPagamento: 'Pix',
                pago: 'true'
            };
            await finalizarCompra(pagamento, cliente, carrinho, uniformes, limparCarrinho);

            if (carrinho.armarios.length > 0) {
                for (const armario of carrinho.armarios) {
                    await handleEnviarTermoUso(armario.nome);
                }
            }
            
            showAlert("Compra finalizada!");
            navigate('/descanso');

        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            showAlert("Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    async function handleEnviarTermoUso(armario) {
        try {
            const response = await fetch('http://localhost:3000/enviar-email-termo-de-uso', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, armario }),
            });
            if (!response.ok) throw new Error('Falha ao enviar termo de uso');
            console.log('Termo de uso enviado com sucesso.');
        } catch (error) {
            console.error('Erro ao enviar termos de uso:', error);
            showAlert('Falha ao enviar termos de uso.');
        }
    }

    async function handleEnviarComprovante() {
        try {
            const detalhesUniformes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
            let itensParaEmail = {};
            let assunto = "";

            let detalhesUniformesFormatados = "Uniforme(s) adquirido(s):";
            detalhesUniformes.forEach(peca => {
                detalhesUniformesFormatados += `\n${peca.Nome}\nTamanho: ${peca.Tamanho}\nQuantidade: ${peca.quantidade}\nPreço unitário: ${peca.Preço}\nPreço total: ${peca.quantidade * peca.Preço}\n`;
            });

            let detalhesArmarioFormatado = "Armário(s) adquirido(s):\n";
            carrinho.armarios.forEach(armario => {
                detalhesArmarioFormatado += `${armario.nome}\nCorredor: ${armario.corredor}\nPerto da(s) sala(s): ${armario.salaInfo}\n`;
            });

            if (carrinho.uniformes.length > 0 && carrinho.armarios.length === 0) {
                itensParaEmail = { uniformes: detalhesUniformesFormatados, total: `Total da compra: ${total.toFixed(2)}\n`, extra: `Forma de pagamento: Pix\nA apresentação deste comprovante é necessária para a retirada do(s) uniforme(s)` };
                assunto = "Compra de uniformes da ETEC Bento Quirino";
            } else if (carrinho.armarios.length > 0 && carrinho.uniformes.length === 0) {
                itensParaEmail = { armarios: detalhesArmarioFormatado, total: `Total da compra: ${total.toFixed(2)}\n`, extra: `Forma de pagamento: Pix` };
                assunto = "Aluguel de armário(s) da ETEC Bento Quirino";
            } else {
                itensParaEmail = { uniformes: detalhesUniformesFormatados, armarios: detalhesArmarioFormatado, total: `Total da compra: ${total.toFixed(2)}\n`, extra: `Forma de pagamento: Pix\nA apresentação deste comprovante é necessária para a retirada do(s) uniforme(s)` };
                assunto = "Compra de uniformes e aluguel de armários da ETEC Bento Quirino";
            }

            const response = await fetch('http://localhost:3000/enviar-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, carrinho: itensParaEmail, assunto }),
            });

            if (!response.ok) throw new Error('Falha ao enviar comprovante');
            
            console.log('Email enviado com sucesso.')
            alert('Comprovante enviado por email!')
        } catch (error) {
            console.error('Erro ao enviar comprovante:', error);
            alert('Falha ao enviar comprovante.');
        }
    }

    return (
        <div className={styles.paginaPix}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingText}>AGUARDE...</div>
                </div>
            )}
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <main className={styles.conteudo}>
                <img src={iconePix} alt="PIX" className={styles.iconePix} />
                <h1 className={styles.tituloPix}>PIX</h1>
                <div className={styles.totalContainer}>
                    <p className={styles.totalValor}>R$ {total.toFixed(2)}</p>
                </div>
                <p className={styles.instrucao}>
                    Escaneie o QR Code na<br />máquina de cartão
                </p>
                <IconeSetaAbaixo />
            </main>
            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
            <button onClick={() => setShowModal(true)} className={styles.botaoOk}>OK</button>

            {showModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <p className={styles.modalTexto}>Deseja receber o comprovante por e-mail?</p>
                        <div className={styles.modalBotoes}>
                            <button onClick={() => finalizar(true)} className={styles.modalBotaoSim}>SIM, ENVIAR COMPROVANTE</button>
                            <button onClick={() => finalizar(false)} className={styles.modalBotaoNao}>NÃO, OBRIGADO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}