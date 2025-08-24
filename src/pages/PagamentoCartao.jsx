import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PagamentoCartao.module.css';
import logoOsa from '/osaCompleto.png';
import iconeCartao from '../assets/cartao.png';

export default function PagamentoCartao() {
    const navigate = useNavigate();

    const handleCardTypeSelection = (tipo) => {
        if (tipo === 'Cartão de Débito') {
            navigate('/pagamento-cartao-debito');
        } else if (tipo === 'Cartão de Crédito') {
            navigate('/pagamento-cartao-credito');
        }
    };

    return (
        <div className={styles.paginaCartao}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            
            <header className={styles.cabecalho}>
                <img src={iconeCartao} alt="Cartão" className={styles.iconeCabecalho} />
                <h1 className={styles.titulo}>Cartão</h1>
            </header>

            <div className={styles.botoesContainer}>
                <button className={styles.botaoOpcao} onClick={() => handleCardTypeSelection('Cartão de Débito')}>
                    <span>Cartão de Débito</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => handleCardTypeSelection('Cartão de Crédito')}>
                    <span>Cartão de Crédito</span>
                </button>
            </div>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
