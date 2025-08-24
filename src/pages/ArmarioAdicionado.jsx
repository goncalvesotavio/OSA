import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/ArmarioAdicionado.module.css';
import logoOsa from '/osaCompleto.png';

export default function ArmarioAdicionado() {
    const navigate = useNavigate();
    const { numero } = useParams(); // Pega o número do armário da URL

    return (
        <div className={styles.paginaSucesso}>
            <button onClick={() => navigate('/armarios')} className={styles.botaoVoltar}>←</button>
            
            <main className={styles.conteudo}>
                <h1 className={styles.titulo}>
                    O armário nº {numero} foi adicionado ao seu carrinho com sucesso!
                </h1>
                <div className={styles.botoesContainer}>
                    <button 
                        className={styles.botaoOpcao} 
                        onClick={() => navigate('/carrinho')} // Rota corrigida para a página de visualizar carrinho
                    >
                        VISUALIZE MEU CARRINHO!
                    </button>
                    <button 
                        className={styles.botaoOpcao} 
                        onClick={() => navigate('/inicio')}
                    >
                        CONTINUAR COMPRANDO!
                    </button>
                </div>
            </main>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
