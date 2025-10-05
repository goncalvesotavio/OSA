import React from 'react';
import styles from '../styles/ConfirmacaoEmailModal.module.css';

export default function ConfirmacaoEmailModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.modalTexto}>Deseja receber o comprovante por e-mail?</p>
                <div className={styles.modalBotoes}>
                    <button onClick={onConfirm} className={styles.modalBotaoSim}>SIM, ENVIAR COMPROVANTE</button>
                    <button onClick={onCancel} className={styles.modalBotaoNao}>NÃO, OBRIGADO</button>
                </div>
            </div>
        </div>
    );
}