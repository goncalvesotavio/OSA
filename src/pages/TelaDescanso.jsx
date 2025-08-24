import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TelaDescanso.module.css';

import logoOsa from '/osaCompleto.png';
import logoBentao from '/bentao.png';

export default function TelaDescanso() {
    const navigate = useNavigate();

    const handleScreenClick = () => {
        navigate('/inicio');
    };

    return (
        <div className={styles.telaDescanso} onClick={handleScreenClick}>
            <div className={styles.backgroundCircles}>
                <div className={`${styles.circle} ${styles.circle1}`}></div>
                <div className={`${styles.circle} ${styles.circle2}`}></div>
                <div className={`${styles.circle} ${styles.circle3}`}></div>
                <div className={`${styles.circle} ${styles.circle4}`}></div>
                <div className={`${styles.circle} ${styles.circle5}`}></div>
                <div className={`${styles.circle} ${styles.circle6}`}></div>
            </div>

            <main className={styles.conteudoCentral}>
                <img src={logoOsa} alt="Logo OSA" className={styles.logoOsa} />
                <span className={styles.ampersand}>&</span>
                <img src={logoBentao} alt="Logo Bento Quirino" className={styles.logoBentao} />
            </main>

            <footer className={styles.barraInferior}>
                <p>Toque para começar</p>
            </footer>
        </div>
    );
}
