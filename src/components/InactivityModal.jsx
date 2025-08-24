import React from 'react';
import styles from '../styles/InactivityModal.module.css';

export default function InactivityModal({ isOpen, onStayActive, countdown }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.texto}>Você ainda está aí?</p>
                <p className={styles.timer}>{countdown}</p>
                <button className={styles.botaoSim} onClick={onStayActive}>
                    Sim
                </button>
            </div>
        </div>
    );
}
