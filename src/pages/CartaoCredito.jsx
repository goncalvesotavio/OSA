import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CartaoCredito.module.css';
import logoOsa from '/osaCompleto.png';
import iconeCartao from '../assets/cartao.png';
import { finalizarCompra } from '../components/finalizarCompra';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { ClienteContext } from '../context/ClienteContext.jsx';
import { AlertContext } from '../context/AlertContext';
import { fetchUniformes, buscarDetalhesDoCarrinho } from '../components/fetchUniformes.jsx'
import { procurarEmail } from '../components/fetchClientes'
import { ArquivoContext } from '../context/ArquivoContext';

export default function CartaoCredito() {
    const { carrinho, limparCarrinho } = useContext(CarrinhoContext);
    const { cliente } = useContext(ClienteContext);
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();
    const [uniformes, setUniformes] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [showModal, setShowModal] = useState(false)
    const { armarios } = useContext(ArquivoContext)

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
    }, [navigate, carrinho, cliente])

    const finalizar = async (enviarEmail) => {
            setIsLoading(true);
            try {
                const pagamento = {
                    formaPagamento: 'Crédito',
                    pago: 'true'
                }
    
                const id_venda = await finalizarCompra(pagamento, cliente, carrinho, uniformes, limparCarrinho, armarios)
                
                if (enviarEmail) {
                    await handleEnviarComprovante()
                }
    
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
        }

    async function infos(id_venda) {
        const detalhesUniformes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
    
        let extraUniformes = "\nA apresentação deste comprovante é necessária para a retirada do(s) uniforme(s)";

        let detalhesUniformesFormatados = "";
        if (detalhesUniformes.length > 0) {
            detalhesUniformesFormatados = "Uniforme(s) adquirido(s):"
            detalhesUniformes.forEach(peca => {
                detalhesUniformesFormatados += `\n${peca.Nome}\nTamanho: ${peca.Tamanho}\nQuantidade: ${peca.quantidade}\nPreço unitário: R$${peca.Preço}\nPreço total: R$${peca.quantidade * peca.Preço}\n`;
            })
        }

        let detalhesArmarioFormatado = "";
        if (carrinho.armarios.length > 0) {
            detalhesArmarioFormatado = "Armário(s) adquirido(s):\n";
            carrinho.armarios.forEach(armario => {
                detalhesArmarioFormatado += `${armario.nome}\nCorredor: ${armario.corredor}\nPerto da(s) sala(s): ${armario.salaInfo}\nTotal: R$${armario.preco}\n`;
            })
        }

        const totalUniformes = detalhesUniformes.reduce((acc, item) => acc + (item.Preço * item.quantidade), 0);
        const totalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 0), 0);
        const totalCompra = totalUniformes + totalArmarios;

        let extra = `Forma de pagamento: Crédito\nTotal da compra: R$${totalCompra.toFixed(2)}`;

        return { detalhesUniformesFormatados, detalhesArmarioFormatado, extra, extraUniformes }
    }
    
    async function handleEnviarTermoUso() {
        try {
            const armariosArray = carrinho.armarios.map(a => {
                const valorInt = parseInt(a.numero)
                return armarios.find(ar => ar.numero === valorInt)
            }).filter(Boolean) 

            const response = await fetch('http://localhost:3000/enviar-email-termo-de-uso', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, armarios: armariosArray }),
            })

            if (!response.ok) throw new Error('Falha ao enviar termo de uso');
            console.log('Termos de uso enviados com sucesso.');
        } catch (error) {
            console.error('Erro ao enviar termos de uso:', error);
            showAlert('Falha ao enviar termos de uso.');
        }
    }
    
        async function handleEnviarComprovante(id_venda){
            try {
                const detalhesUniformes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
                let itensParaEmail = {}
                let assunto = ""
                let extra = "Forma de pagamento: Crédito"
    
                let detalhesUniformesFormatados = "Uniforme(s) adquirido(s):";
                detalhesUniformes.forEach(peca => {
                    detalhesUniformesFormatados += `\n${peca.Nome}\nTamanho: ${peca.Tamanho}\nQuantidade: ${peca.quantidade}\nPreço unitário: ${peca.Preço}\nPreço total: ${peca.quantidade * peca.Preço}\n`;
                });
    
                let detalhesArmarioFormatado = "Armário(s) adquirido(s):\n";
                carrinho.armarios.forEach(armario => {
                    detalhesArmarioFormatado += `${armario.nome}\nCorredor: ${armario.corredor}\nPerto da(s) sala(s): ${armario.salaInfo}\n`;
                });
    
                if (carrinho.uniformes.length > 0 && carrinho.armarios.length === 0) {
                    itensParaEmail = { uniformes: detalhesUniformesFormatados, total: `Total da compra: ${total.toFixed(2)}\n`, extra: extra + `\nA apresentação deste comprovante é necessária para a retirada do(s) uniforme(s)` };
                    assunto = "Compra de uniformes da ETEC Bento Quirino";
                } else if (carrinho.armarios.length > 0 && carrinho.uniformes.length === 0) {
                    itensParaEmail = { armarios: detalhesArmarioFormatado, total: `Total da compra: ${total.toFixed(2)}\n`, extra: extra };
                    assunto = "Aluguel de armário(s) da ETEC Bento Quirino";
                } else {
                    itensParaEmail = { uniformes: detalhesUniformesFormatados, armarios: detalhesArmarioFormatado, total: `Total da compra: ${total.toFixed(2)}\n`, extra: extra + `\nA apresentação deste comprovante é necessária para a retirada do(s) uniforme(s)` };
                    assunto = "Compra de uniformes e aluguel de armários da ETEC Bento Quirino";
                }
    
                const response = await fetch('http://localhost:3000/enviar-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, carrinho: itensParaEmail, assunto, id_venda}),
                });
    
                if (!response.ok) throw new Error('Falha ao enviar comprovante');
                
                console.log('Email enviado com sucesso.')
                alert('Comprovante enviado por email!')
            } catch (error) {
                console.error('Erro ao enviar comprovante:', error);
                alert('Falha ao enviar comprovante.');
            }
        }

    async function ativarImpressora(id_venda) {
        let itensParaComprovante = await infos(id_venda)

        await fetch("http://localhost:3001/imprimir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carrinho: itensParaComprovante, id_venda })
        })
    }

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
