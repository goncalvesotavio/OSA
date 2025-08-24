import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PaginaInicial.module.css';
import logoOsa from '/osaCompleto.png';
import iconeArmarios from '../assets/armarios.png';
import iconeUniformes from '../assets/uniformes.png';

export default function PaginaInicial() {
    const navigate = useNavigate();

    const irParaUniformes = () => {
        navigate('/uniformes');
    };

    const irParaArmarios = () => {
        navigate('/armarios');
    };

    return (
        <div className={styles.paginaInicial}>
            <h1 className={styles.titulo}>Como podemos te ajudar hoje?</h1>

            <div className={styles.botoesContainer}>
                <button className={styles.botaoOpcao} onClick={irParaArmarios}>
                    <img src={iconeArmarios} alt="Armários" className={styles.icone} />
                    <span>Armários</span>
                </button>
                <button className={styles.botaoOpcao} onClick={irParaUniformes}>
                    <img src={iconeUniformes} alt="Uniformes" className={styles.icone} />
                    <span>Uniformes</span>
                </button>
            </div>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
