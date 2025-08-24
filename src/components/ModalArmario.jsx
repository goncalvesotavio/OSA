import React from 'react';
import styles from '../styles/ModalArmario.module.css';

export default function ModalArmario({ armario, onConfirm, onCancel }) {
    if (!armario) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.texto}>
                    Deseja adicionar o armário {armario.numero} do nº{armario.secao} no corredor {armario.corredor} entre salas {armario.salaInfo} ao seu carrinho?
                </p>
                <div className={styles.armarioDisplay}>
                    <div className={styles.armarioDisplayInterno}>
                        {armario.numero}
                    </div>
                </div>
                <div className={styles.botoesContainer}>
                    <button className={styles.botaoConfirmar} onClick={onConfirm}>
                        SIM, ADICIONE AO MEU CARRINHO!
                    </button>
                    <button className={styles.botaoCancelar} onClick={onCancel}>
                        Não, voltar para armários
                    </button>
                </div>
            </div>
        </div>
    );
}
