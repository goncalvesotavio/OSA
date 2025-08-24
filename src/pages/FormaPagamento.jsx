import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/FormaPagamento.module.css';
import logoOsa from '/osaCompleto.png';
import iconePix from '../assets/pix.png';
import iconeCartao from '../assets/cartao.png';
import iconeDinheiro from '../assets/dinheiro.png';

export default function FormaPagamento() {
    const navigate = useNavigate();

    const handlePaymentSelection = (metodo) => {
        if (metodo === 'PIX') {
            navigate('/pagamento-pix');
        } else if (metodo === 'Cartão') {
            navigate('/pagamento-cartao');
        } else if (metodo === 'Dinheiro') {
            navigate('/pagamento-dinheiro');
        }
    };

    return (
        <div className={styles.paginaPagamento}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <h1 className={styles.titulo}>Como deseja pagar?</h1>

            <div className={styles.botoesContainer}>
                <button className={styles.botaoOpcao} onClick={() => handlePaymentSelection('PIX')}>
                    <img src={iconePix} alt="PIX" className={styles.icone} />
                    <span>PIX</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => handlePaymentSelection('Cartão')}>
                    <img src={iconeCartao} alt="Cartão" className={styles.icone} />
                    <span>Cartão</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => handlePaymentSelection('Dinheiro')}>
                    <img src={iconeDinheiro} alt="Dinheiro" className={styles.icone} />
                    <span>Dinheiro</span>
                </button>
            </div>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
