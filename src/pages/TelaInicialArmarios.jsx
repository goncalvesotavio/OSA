import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TelaInicialArmarios.module.css';
import logoOsa from '/osaCompleto.png';

export default function TelaInicialArmarios() {
    const navigate = useNavigate();

    const selecionarCorredor = (corredorId) => {
        if (corredorId === '1') {
            navigate('/armarios/corredor/1');
        } else if (corredorId === '2') {
            navigate('/armarios/corredor/2');
        } else if (corredorId === '3') {
            navigate('/armarios/corredor/3');
        } else if (corredorId === 'Mecânica') {
            navigate('/armarios/corredor/mecanica');
        } else {
            alert(`A página para o Corredor ${corredorId} ainda não foi criada.`);
        }
    };

    return (
        <div className={styles.paginaArmarios}>
            <button onClick={() => navigate('/inicio')} className={styles.botaoVoltar}>←</button>
            
            <h1 className={styles.titulo}>Em qual corredor deseja comprar seu armário?</h1>

            <div className={styles.botoesContainer}>
                <button className={styles.botaoOpcao} onClick={() => selecionarCorredor('1')}>
                    <span>Corredor 1</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => selecionarCorredor('2')}>
                    <span>Corredor 2</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => selecionarCorredor('3')}>
                    <span>Corredor 3</span>
                </button>
                <button className={styles.botaoOpcao} onClick={() => selecionarCorredor('Mecânica')}>
                    <span>Mecânica</span>
                </button>
            </div>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
